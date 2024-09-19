#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from fastapi import APIRouter
from backend.app.ggl.api.v1.app import router as app_router
from backend.app.ggl.api.v1.doc import router as doc_router
from backend.app.ggl.api.v1.dir import router as dir_router
from backend.app.ggl.api.v1.doc_chunk import router as doc_chunk_router
from backend.app.ggl.api.v1.chat_session import router as chat_session_router
from backend.app.ggl.api.v1.chat_history import router as chat_history_router

router = APIRouter(prefix="/ggl")

router.include_router(app_router, prefix="/app", tags=["app应用管理"])
router.include_router(dir_router, prefix="/dir", tags=["数据集目录管理"])
router.include_router(doc_router, prefix="/doc", tags=["数据集doc文档管理"])
router.include_router(doc_chunk_router, prefix="/doc_chunk", tags=["数据集doc文档块管理"])
router.include_router(chat_session_router, prefix="/chat_session", tags=["app应用chat会话管理"])
router.include_router(chat_history_router, prefix="/chat_history", tags=["app应用chat历史消息管理"])
