#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import sys

from typing import Annotated
from uuid import uuid4

from fastapi import Depends
from sqlalchemy import URL
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from backend.common.log import log
from backend.common.msd.model import MappedBase
from backend.core.conf import settings
from contextlib import contextmanager

# 导入同步数据库引擎和 sessionmaker
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

# 定义同步数据库连接 URL
SYNC_SQLALCHEMY_DATABASE_URL = (
    f'postgresql://{settings.DB_USER}:{settings.DB_PASSWORD}@{settings.DB_HOST}:'
    f'{settings.DB_PORT}/{settings.DB_DATABASE}'
)
# 创建同步数据库引擎
sync_engine = create_engine(SYNC_SQLALCHEMY_DATABASE_URL, echo=settings.DB_ECHO)
# 创建同步 sessionmaker
sync_db_session = sessionmaker(bind=sync_engine, autoflush=False, expire_on_commit=False)

# 定义同步 session 生成器函数
@contextmanager
def get_sync_db() -> Session:
    """同步 session 生成器"""
    session = sync_db_session()
    try:
        yield session
        session.commit()
    except Exception as se:
        session.rollback()
        raise se
    finally:
        session.close()


# 同步 Session Annotated
CurrentSyncSession = Annotated[Session, Depends(get_sync_db)]


def create_engine_and_session(url: str | URL):
    try:
        # 数据库引擎
        engine = create_async_engine(url, echo=settings.DB_ECHO, future=True, pool_pre_ping=True)
        # log.success('数据库连接成功')
    except Exception as e:
        log.error('❌ 数据库链接失败 {}', e)
        sys.exit()
    else:
        db_session = async_sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)
        return engine, db_session


SQLALCHEMY_DATABASE_URL = (
    f'postgresql+asyncpg://{settings.DB_USER}:{settings.DB_PASSWORD}@{settings.DB_HOST}:'
    f'{settings.DB_PORT}/{settings.DB_DATABASE}'
)

async_engine, async_db_session = create_engine_and_session(SQLALCHEMY_DATABASE_URL)


async def get_db() -> AsyncSession:
    """session 生成器"""
    session = async_db_session()
    try:
        yield session
    except Exception as se:
        await session.rollback()
        raise se
    finally:
        await session.close()


# Session Annotated
CurrentSession = Annotated[AsyncSession, Depends(get_db)]


async def create_table():
    """创建数据库表"""
    async with async_engine.begin() as coon:
        await coon.run_sync(MappedBase.metadata.create_all)


def uuid4_str() -> str:
    """数据库引擎 UUID 类型兼容性解决方案"""
    return str(uuid4())
