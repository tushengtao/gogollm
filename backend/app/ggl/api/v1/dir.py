#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from typing import Annotated
from fastapi import APIRouter, Path, Request
from backend.common.security.jwt import DependsJwtAuth
from backend.common.response.response_schema import ResponseModel, response_base
from backend.app.ggl.schema.dir import CreateDirParam, UpdateDirParam
from backend.app.ggl.service.dir_service import dir_service

router = APIRouter()


@router.post(
    '',
    summary='创建数据目录',
    dependencies=[
        DependsJwtAuth
    ],
)
async def create_dir(obj: CreateDirParam) -> ResponseModel:
    await dir_service.create(obj=obj)
    return await response_base.success()


@router.get(
    '/dirs',
    summary='获取用户所有的数据集dirs',
    dependencies=[
        DependsJwtAuth
    ],
)
async def get_user_all_dirs(request: Request) -> ResponseModel:
    apps = await dir_service.get_user_all_dirs(user_id=request.user.id)
    return await response_base.success(data=apps)


@router.put(
    '',
    summary='更新数据集',
    dependencies=[
        DependsJwtAuth
    ],
)
async def update_dir(obj: UpdateDirParam) -> ResponseModel:
    await dir_service.update(pk=obj.id, obj=obj)
    return await response_base.success()


@router.delete(
    path='/{pk}',
    summary='删除数据集',
    description='删除是假删除，不影响数据库数据，使用del_flag',
    dependencies=[
        DependsJwtAuth
    ],
)
async def delete_dir(pk: Annotated[int, Path(...)]) -> ResponseModel:
    count = await dir_service.delete(pk=pk)
    if count > 0:
        return await response_base.success()
    return await response_base.fail()
