#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from typing import Sequence
from backend.app.admin.model import User, Dept
from backend.app.ggl.flow.build_flow_chain import executable_flow_info, build_chains
from backend.common.exception import errors
from sqlalchemy import select
from backend.app.ggl.schema.app import CreateAppParam, UpdateAppFlowDataParam
from backend.database.db_sql import async_db_session
from backend.app.ggl.model.ggl_app import App
from backend.app.ggl.crud.crud_app import app_dao
from backend.app.ggl.flow.nodes.all_node import AllNodesDict


class AppService:
    @staticmethod
    async def chat_test(req: dict):
        app_id = req['app_id']
        is_streaming = req['streaming']
        msg_history_count = req.get('msg_history_count', 0)
        app_flow_data = req['app_flow_data']
        session_id = req['session_id']
        user_id = req.get("user_id", "")
        app_name = req['app_name']
        flow_dag, parallel_execution_nodes = executable_flow_info(app_flow_data)
        question = req['question']
        flowState = {
            'app_id': app_id,
            'app_name': app_name,
            'session_id': session_id,
            'user_id': user_id,
            'streaming': is_streaming,
            'msg_history_count': msg_history_count,
            'question': question,
            'flow_dag': flow_dag,
            'parallel_execution_nodes': parallel_execution_nodes
        }
        # 构造langchain
        flow_chain = build_chains(parallel_execution_nodes, flowState, AllNodesDict)
        return flow_chain

    @staticmethod
    async def chat(req: dict):
        app_id = req['app_id']
        is_streaming = req['streaming']
        msg_history_count = req.get('msg_history_count', 0)
        app_flow_data = req['app_flow_data']
        session_id = req['session_id']
        user_id = req.get("user_id", "")
        app_name = req['app_name']
        flow_dag, parallel_execution_nodes = executable_flow_info(app_flow_data)
        question = req['question']
        flowState = {
            'app_id': app_id,
            'app_name': app_name,
            'session_id': session_id,
            'user_id': user_id,
            'streaming': is_streaming,
            'msg_history_count': msg_history_count,
            'question': question,
            'flow_dag': flow_dag,
            'parallel_execution_nodes': parallel_execution_nodes
        }
        # 构造langchain
        flow_chain = build_chains(parallel_execution_nodes, flowState, AllNodesDict)
        return flow_chain

    @staticmethod
    async def get_flow_state(user: User, req: dict):
        app_id = req['app_id']
        send_messages = req['messages']
        is_streaming = req['streaming']
        msg_history_count = req.get('msg_history_count', 0)
        app_flow_data = req['app_flow_data']
        session_id = req['session_id']
        app_name = req['app_name']
        flow_dag, parallel_execution_nodes = executable_flow_info(app_flow_data)
        question = send_messages[-1]['content']
        flowState = {
            'app_id': app_id,
            'app_name': app_name,
            'session_id': session_id,
            'user_id': user.id,
            'streaming': is_streaming,
            'msg_history_count': msg_history_count,
            'question': question,
            'flow_dag': flow_dag,
            'messages': send_messages,
            'parallel_execution_nodes': parallel_execution_nodes
        }
        return flowState

    @staticmethod
    async def get_user_all_apps(user_id: int, dept_id: int) -> dict:
        async with async_db_session() as db:
            user = await app_dao.get_owner_apps(db, user_id)
            owner_apps = [app for app in user.owner_apps if not app.del_flag]
            owner_apps = sorted(owner_apps, key=lambda app: app.created_time, reverse=True)
            dept = await app_dao.get_share_apps(db, dept_id)
            share_apps = [app for app in dept.share_apps if not app.del_flag and app.owner_id != user_id]
            share_apps = sorted(share_apps, key=lambda app: app.created_time, reverse=True)

            return {
                'owner_apps': owner_apps,
                'share_apps': share_apps,
            }

    @staticmethod
    async def get_app_by_id(app_id: int) -> App:
        async with async_db_session() as db:
            return await app_dao.get(db, app_id=app_id)

    @staticmethod
    async def create(*, obj: CreateAppParam) -> None:
        async with async_db_session.begin() as db:
            app_res = await db.execute(select(App).where(App.name == obj.name))
            app = app_res.scalars().first()
            if app:
                raise errors.ForbiddenError(msg='此应用名称已存在')
            else:
                await app_dao.create(db, obj)

    @staticmethod
    async def update_app_basic_info(req: dict) -> None:
        app_id = req.get('app_id')
        name = req.get('name')
        desc = req.get('desc')
        type = req.get('type', 0)
        dept_ids = req.get('dept_ids', [])
        async with async_db_session.begin() as db:
            app_result = await db.execute(
                select(App).where(App.id == app_id)
            )
            app = app_result.scalars().first()
            if not app:
                raise errors.NotFoundError(msg='应用不存在')
            # 更新应用对象的属性
            if name is not None:
                app_exist = await db.execute(select(App).where(App.name == name))
                app_exist_obj = app_exist.scalars().first()
                if app_exist_obj and app_exist_obj.id != app_id:
                    raise errors.ForbiddenError(msg='此应用名称已存在')
                else:
                    app.name = name
            if desc is not None:
                app.desc = desc
            app.type = type
            # 更新关联的部门
            if dept_ids is not None:
                dept_result = await db.execute(
                    select(Dept).where(Dept.id.in_(dept_ids))
                )
                depts = dept_result.scalars().all()
                app.share_depts = depts

    @staticmethod
    async def delete(*, pk: int) -> int:
        async with async_db_session.begin() as db:
            return await app_dao.delete(db, pk)

    @staticmethod
    async def update_app_flow(*, pk: int, obj: UpdateAppFlowDataParam) -> int:
        async with async_db_session.begin() as db:
            return await app_dao.update_app_flow(db, pk, obj)

    @staticmethod
    async def update_share_dept(*, pk: int, dept_ids: Sequence[int]) -> None:
        async with async_db_session.begin() as db:
            app = db.get(App, pk)
            await app_dao.update_share_dept(db, app, dept_ids)


app_service = AppService()
