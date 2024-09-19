#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from typing import Annotated
from fastapi import APIRouter, Path, Request

from backend.common.security.jwt import DependsJwtAuth
from backend.common.pagination import DependsPagination, paging_data
from backend.common.response.response_schema import ResponseModel, response_base
from backend.app.ggl.schema.doc import CreateDocParam, GetDocDetail, UpdateDocParam
from backend.app.ggl.service.doc_service import doc_service
from backend.database.db_sql import CurrentSession

router = APIRouter()


@router.post(
    '',
    summary='在指定数据目录下添加文档',
    dependencies=[
        DependsJwtAuth
    ],
)
async def create_doc(request: Request, obj: CreateDocParam) -> ResponseModel:
    await doc_service.create(request=request, obj=obj)
    return await response_base.success()


@router.get(
    '/{pk}/list',
    summary='分页获取文档列表',
    dependencies=[
        DependsJwtAuth,
        DependsPagination,
    ],
)
async def get_pagination_doc(
        db: CurrentSession,
        pk: Annotated[int, Path(...)]
) -> ResponseModel:
    doc_select = await doc_service.get_select(dir_id=pk)
    page_data = await paging_data(db, doc_select, GetDocDetail)
    return await response_base.success(data=page_data)


# 修改 文档：主要是内容 名称 配置（如embedding模型、根据文档问答智能拆分的大模型、拆分标识、拆分固定长度）
@router.put(
    '',
    summary='修改文档',
    dependencies=[
        DependsJwtAuth
    ]
)
async def update_doc(obj: UpdateDocParam) -> ResponseModel:
    await doc_service.update(doc_id=obj.id, obj=obj)
    return await response_base.success()


@router.delete(
    path='/{pk}',
    summary='删除数据文档',
    description='删除是假删除，不影响数据库数据，使用del_flag',
    dependencies=[
        DependsJwtAuth
    ],
)
async def delete_doc(pk: Annotated[int, Path(...)]) -> ResponseModel:
    count = await doc_service.delete(pk=pk)
    if count > 0:
        return await response_base.success()
    return await response_base.fail()
