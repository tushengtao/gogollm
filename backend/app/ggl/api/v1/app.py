#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import os
from dotenv import load_dotenv
from typing import Annotated
import asyncio
from fastapi import APIRouter, Path, Request
from fastapi.responses import StreamingResponse
from langfuse.callback import CallbackHandler
from sqlalchemy import func
from sqlalchemy import select
from openai import OpenAI
from backend.app.admin.model import Dept, User
from backend.app.ggl.api.v1.app_helper import llm_with_tool_astream, react_agent_astream, structured_chat_agent_astream, \
    app_astream_events
from backend.app.ggl.model.ggl_app import App
from backend.app.ggl.model.ggl_app_dept import ggl_app_dept
from backend.app.ggl.model.ggl_chat_session import ChatSession
from backend.common.exception import errors
from backend.common.security.jwt import DependsJwtAuth
from backend.common.response.response_schema import ResponseModel, response_base
from backend.app.admin.service.user_service import user_service
from backend.app.ggl.util.id_util import generate_flow_id
from backend.app.ggl.service.app_service import app_service
from backend.app.ggl.schema.app import CreateAppParam, UpdateAppFlowDataParam, OpenApiChatParam
from backend.database.db_sql import CurrentSession
from backend.app.ggl.flow.code_executor.pbox.executor import execute as execute_code, create_remote_sandbox, \
    async_close_remote_sandbox



router = APIRouter()
load_dotenv()


async def astream(chains, question, config):
    if 1 == config['app_type']:
        async for chunk in llm_with_tool_astream(chains, question, config):
            yield chunk
    elif 0 == config['app_type']:
        async for chunk in react_agent_astream(chains, question, config):
            yield chunk
    elif 2 == config['app_type']:
        async for chunk in structured_chat_agent_astream(chains, question, config):
            yield chunk
    else:
        async for chunk in chains.astream(question, config=config):
            yield str(chunk).encode("utf-8")
        async for chunk in llm_with_tool_astream(chains, question, config):
            yield chunk


async def invoke(chains, question, config):
    result = chains.ainvoke(question, config=config)
    if hasattr(result, 'content'):
        yield result.content
    elif hasattr(result, 'output'):
        yield result.output
    else:
        # del result['chat_history']
        yield result


@router.post("/code_node_run_test", summary="代码节点运行测试", dependencies=[DependsJwtAuth])
async def code_node_run_test(request: Request) -> ResponseModel:
    req = await request.json()
    default_code = 'print("代码空，请编写你需要测试的代码")'
    code = req.get("code")
    if code is None or code == "":
        code = default_code
    try:
        kernel_id = create_remote_sandbox()
        resp = execute_code(kernel_id, code)
        asyncio.create_task(async_close_remote_sandbox(kernel_id))
        results = None
        if resp['error']:
            results = resp["error"]
        else:
            del resp['error']
            del resp['logs']['stderr']
        if len(resp['results']) == 0:
            del resp['results']
            results = resp['logs']
        else:
            del resp['logs']
            results = resp['results']
        return await response_base.success(data=results)
    except Exception as e:
        raise errors.RequestError(msg=f"代码节点运行测试错误{e}")


@router.post("/code_autocomplete", summary="代码自动补全", dependencies=[DependsJwtAuth])
async def code_autocomplete(request: Request):
    req = await request.json()
    prefix = req.get("prefix", None)
    suffix = req.get("suffix", None)
    model = req.get("model", "glm-4-flash")
    messages = [
        {
            "role": "system",
            "content": """You are a python programmer that replaces <FILL_ME> part with the right code. 
            Only output the code that replaces <FILL_ME> part. Do not add any explanation or markdown.""",
        },
        {"role": "user", "content": f"{prefix}<FILL_ME>{suffix}"},
    ]
    try:
        if prefix is None and suffix is None:
            return {"prediction": "# 请输入"}
        base_url = os.environ.get("OPENAI_API_BASE")
        api_key = os.environ.get("OPENAI_API_KEY")
        client = OpenAI(base_url=base_url, api_key=api_key)
        chat_completion = client.chat.completions.create(model=model, messages=messages)
        prediction = chat_completion.choices[0].message.content
        return await response_base.success(data={"prediction": prediction})
    except Exception as e:
        raise errors.RequestError(msg=f"代码自动补全请求错误:{e}")


@router.post('/openapi/chat', summary="openapi应用Chat对话")
async def openapi_chat(request: Request, obj: OpenApiChatParam):
    req = await request.json()
    app_id = req['app_id']
    is_streaming = req['streaming']
    question = req['question']
    session_id = req['session_id']
    user_id = req['user_id']
    app = await app_service.get_app_by_id(app_id=app_id)
    req['app_flow_data'] = app.flow_data
    req['app_name'] = app.name
    app_type = app.type
    langfuse_handler = CallbackHandler(session_id=session_id,
                                       user_id=user_id,
                                       trace_name=str(app.id) + '_' + app.name,
                                       timeout=6)
    flow_chain = await app_service.chat(req)
    config = {
        "callbacks": [langfuse_handler],
        "configurable": {"session_id": session_id, "thread_id": session_id},
        "app_type": app_type
    }
    if is_streaming:
        return StreamingResponse(app_astream_events(flow_chain, {"question": question}, config),
                                 media_type="text/event-stream")
    else:
        return StreamingResponse(invoke(flow_chain, {"question": question}, config),
                                 media_type="text/event-stream")


@router.post('/chat_test', summary="测试应用Chat对话", dependencies=[DependsJwtAuth])
async def chat_test(request: Request):
    req = await request.json()
    app_id = req['app_id']
    app = await app_service.get_app_by_id(app_id=app_id)
    req['app_name'] = app.name
    app_type = app.type
    user = request.user
    is_streaming = req['streaming']
    req_messages = req['messages']
    question = req_messages[-1]['content']
    req['question'] = question
    session_id = str(user.id) + '_' + req_messages[0]['id']
    req['session_id'] = session_id
    user_id = req.get("user_id", "")
    if user_id == "":
        user_id = user.uuid
    req['user_id'] = user_id
    langfuse_handler = CallbackHandler(session_id=session_id,
                                       user_id=user_id,
                                       trace_name=str(app.id) + '_' + app.name,
                                       timeout=6)
    flow_chain = await app_service.chat_test(req)
    config = {
        "callbacks": [langfuse_handler],
        "configurable": {"session_id": session_id, "thread_id": session_id},
        "app_type": app_type
    }
    if is_streaming:
        return StreamingResponse(astream(flow_chain, {"question": question}, config),
                                 media_type="text/event-stream")
    else:
        return StreamingResponse(invoke(flow_chain, {"question": question}, config),
                                 media_type="text/event-stream")


@router.post('/chat', summary="应用Chat对话", dependencies=[DependsJwtAuth])
async def chat(request: Request):
    req = await request.json()
    app_id = req['app_id']
    app = await app_service.get_app_by_id(app_id=app_id)
    req['app_flow_data'] = app.flow_data
    req['app_name'] = app.name
    app_type = app.type
    user = request.user
    is_streaming = req['streaming']
    req_messages = req['messages']
    question = req_messages[-1]['content']
    session_id = req['session_id']
    user_id = req.get("user_id", "")
    if user_id == "":
        user_id = user.uuid
    req['user_id'] = user_id
    req['question'] = question
    langfuse_handler = CallbackHandler(session_id=session_id,
                                       user_id=user_id,
                                       trace_name=str(app.id) + '_' + app.name,
                                       timeout=6)
    flow_chain = await app_service.chat(req)
    config = {
        "callbacks": [langfuse_handler],
        "configurable": {"session_id": session_id, "thread_id": session_id},
        "app_type": app_type
    }
    if is_streaming:
        return StreamingResponse(astream(flow_chain, {"question": question}, config),
                                 media_type="text/event-stream")
    else:
        return StreamingResponse(invoke(flow_chain, {"question": question}, config),
                                 media_type="text/event-stream")


@router.post(
    '',
    summary='创建应用',
    dependencies=[
        DependsJwtAuth
    ],
)
async def create_app(request: Request, obj: CreateAppParam) -> ResponseModel:
    obj.owner_id = request.user.id
    flow_data_str = '''{
    "nodes":[{"id":"70bloqe9980zz5x8","type":"ChatEntryNode","position":{"x":119.77,"y":256.44},
    "data":{"title":"对话入口"},
    "selected":false,
    "positionAbsolute":{"x":119.77,"y":256.44},
    "width":150,"height":30}],
    "edges":[],
    "viewport":{"x":0,"y":0,"zoom":0.9}}
    '''
    flow_data = json.loads(flow_data_str)
    flow_data['nodes'][0]['id'] = generate_flow_id()
    obj.flow_data = flow_data
    await app_service.create(obj=obj)
    return await response_base.success()


@router.get(
    '/userall',
    summary='获取用户所有的app',
    dependencies=[
        DependsJwtAuth
    ],
)
async def get_user_all_apps(request: Request) -> ResponseModel:
    apps = await app_service.get_user_all_apps(user_id=request.user.id, dept_id=request.user.dept_id)

    return await response_base.success(data=apps)


@router.get(
    '/{pk}',
    summary='根据id获取app',
    dependencies=[
        DependsJwtAuth
    ],
)
async def get_app_by_id(pk: Annotated[int, Path(...)]) -> ResponseModel:
    app = await app_service.get_app_by_id(app_id=pk)
    return await response_base.success(data=app)


@router.post('/homepage_stats', summary="首页统计数据", dependencies=[DependsJwtAuth])
async def get_homepage_stats(db: CurrentSession):
    async with db.begin():
        # 获取应用总数
        app_count_query = select(func.count(App.id)).where(App.del_flag == False)
        result_app_count = await db.execute(app_count_query)
        app_count = result_app_count.scalar()

        # 获取会话数最多的前 5 个应用
        top_apps_query = (
            select(App.name, func.count(ChatSession.id).label('session_count'))
            .join(ChatSession, App.id == ChatSession.app_id)
            .where(App.del_flag == False)
            .group_by(App.id, App.name)
            .order_by(func.count(ChatSession.id).desc())
            .limit(5)
        )
        result_top_apps = await db.execute(top_apps_query)
        top_apps = result_top_apps.fetchall()

        # 获取用户会话数排名
        user_ranking_query = (
            select(User.username, func.count(ChatSession.id).label('session_count'))
            .join(ChatSession, User.uuid == ChatSession.user_id)
            .group_by(User.uuid, User.username)
            .order_by(func.count(ChatSession.id).desc())
            .limit(10)
        )
        result_user_ranking = await db.execute(user_ranking_query)
        user_ranking = result_user_ranking.fetchall()

    # 使用显式地构建字典
    return await response_base.success(data={
        "app_count": app_count,
        "top_apps": [{"name": row[0], "session_count": row[1]} for row in top_apps],
        "user_ranking": [{"username": row[0], "session_count": row[1]} for row in user_ranking],
    })



@router.put(
    '/flow/{pk}',
    summary='更新应用flowdata',
    dependencies=[
        DependsJwtAuth
    ],
)
async def update_app_flow(request: Request, pk: Annotated[int, Path(...)],
                          obj: UpdateAppFlowDataParam) -> ResponseModel:
    app = await app_service.get_app_by_id(app_id=pk)
    if request.user.id != app.owner_id:
        owner = await user_service.get_userinfo_by_id(user_id=app.owner_id)
        raise errors.ForbiddenError(msg='无修改权限，请联系应用所有者: ' + owner.username)
    await app_service.update_app_flow(pk=pk, obj=obj)
    return await response_base.success()


@router.get(
    '/depts/{pk}',
    summary='获取app的共享部门',
    dependencies=[
        DependsJwtAuth
    ],
)
async def get_app_share_depts(db: CurrentSession, request: Request, pk: Annotated[int, Path(...)]) -> ResponseModel:
    async with db.begin():
        result_depts = []
        query = select(Dept).join(ggl_app_dept).where(ggl_app_dept.c.app_id == pk)
        result = await db.execute(query)
        depts = result.scalars().all()
        for dept in depts:
            result_depts.append({'id': dept.id, 'name': dept.name})
        return await response_base.success(data=result_depts)


@router.put(
    '/update',
    summary='修改app基本信息',
    dependencies=[
        DependsJwtAuth
    ],
)
async def update_app_basic_info(request: Request) -> ResponseModel:
    req = await request.json()
    app_id = req.get('app_id')
    app = await app_service.get_app_by_id(app_id=app_id)
    if request.user.id != app.owner_id:
        owner = await user_service.get_userinfo_by_id(user_id=app.owner_id)
        raise errors.ForbiddenError(msg='无修改权限，请联系应用所有者: ' + owner.username)
    else:
        await app_service.update_app_basic_info(req=req)
    return await response_base.success()


@router.delete(
    path='/{pk}',
    summary='删除应用',
    description='删除是假删除，不影响数据库数据，使用del_flag标记',
    dependencies=[
        DependsJwtAuth
    ],
)
async def delete_app(request: Request, pk: Annotated[int, Path(...)]) -> ResponseModel:
    app = await app_service.get_app_by_id(app_id=pk)
    if request.user.id != app.owner_id:
        owner = await user_service.get_userinfo_by_id(user_id=app.owner_id)
        raise errors.ForbiddenError(msg='无删除权限，请联系应用所有者: ' + owner.username)
    else:
        count = await app_service.delete(pk=pk)
        if count > 0:
            return await response_base.success()
    return await response_base.fail()
