#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from typing import Annotated
from fastapi import APIRouter, Path, Request
from sqlalchemy import select, update, exists
from backend.app.ggl.model.ggl_chat_session import ChatSession

from backend.app.ggl.schema.chat_session import UpdateChatSessionParam
from backend.common.security.jwt import DependsJwtAuth
from backend.common.response.response_schema import ResponseModel, response_base
from backend.database.db_sql import CurrentSession

router = APIRouter()


@router.post(
    '/list',
    summary='获取用户某个app的所有会话',
    dependencies=[
        DependsJwtAuth
    ],
)
async def get_user_app_session(db: CurrentSession, request: Request) -> ResponseModel:
    req = await request.json()
    app_id = req.get('app_id')
    user_id = req.get("user_id", "")
    user = request.user
    if user_id == "":
        user_id = user.uuid
    async with db.begin():
        result = await db.execute(
            select(ChatSession).where(
                ChatSession.app_id == app_id,
                ChatSession.user_id == user_id,
                ChatSession.del_flag == False
            ).order_by(ChatSession.created_time.desc())
        )
        items = result.scalars().all()
        return await response_base.success(data=items)


@router.delete(
    path='/{session_id}',
    summary='删除会话',
    description='删除是假删除，不影响数据库数据，使用del_flag',
    dependencies=[
        DependsJwtAuth
    ],
)
async def delete_session(db: CurrentSession, session_id: Annotated[str, Path(...)]) -> ResponseModel:
    async with db.begin():
        result = await db.execute(
            update(ChatSession).where(
                ChatSession.session_id == session_id
            ).values(del_flag=True)
        )
        if result.rowcount > 0:
            return await response_base.success()
        return await response_base.fail()
