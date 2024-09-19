#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import time
from datetime import datetime

from fastapi import APIRouter, Request
from langchain_core.messages import messages_from_dict
from sqlalchemy import select
from backend.app.ggl.model.ggl_chat_history import ChatHistory
from backend.common.security.jwt import DependsJwtAuth
from backend.common.response.response_schema import ResponseModel, response_base
from backend.database.db_sql import CurrentSession

router = APIRouter()


@router.post(
    '/list',
    summary='获取用户的某个会话的所有消息历史',
    dependencies=[
        DependsJwtAuth
    ],
)
async def get_user_chat_history(db: CurrentSession, request: Request) -> ResponseModel:
    req = await request.json()
    app_id = req.get('app_id')
    session_id = req.get('session_id')
    user_id = req.get("user_id", "")
    user = request.user
    if user_id == "":
        user_id = user.uuid
    async with db.begin():
        result = await db.execute(
            select(ChatHistory).where(
                ChatHistory.app_id == app_id,
                ChatHistory.user_id == user_id,
                ChatHistory.session_id == session_id
            ).order_by(ChatHistory.created_time.asc())
        )
        items = result.scalars().all()
        result = []
        for item in items:
            message = item.message
            return_msg = {
                'content': message['data']['content'],
                'id': message['data']['additional_kwargs']['id'],
                'role': ''
            }
            _type = message['type']
            if _type == 'human':
                return_msg['role'] = 'user'
            elif _type == 'AIMessageChunk':
                return_msg['role'] = 'assistant'
            elif _type == 'ai':
                return_msg['role'] = 'assistant'
            else:
                raise ValueError(f"Got unexpected message type: {_type}")
            result.append(return_msg)
        return await response_base.success(data=result)
