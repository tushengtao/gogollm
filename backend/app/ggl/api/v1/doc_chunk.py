#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from typing import Annotated
from fastapi import APIRouter, Depends, Path
from backend.app.ggl.schema.doc_chunk import CreateDocChunkParam, GetDocChunkDetail, UpdateDocChunkParam
from backend.common.pagination import DependsPagination, paging_data
from backend.common.response.response_schema import ResponseModel, response_base
from backend.common.security.jwt import DependsJwtAuth
from backend.common.security.permission import RequestPermission
from backend.common.security.rbac import DependsRBAC
from backend.database.db_sql import CurrentSession
from backend.app.ggl.service.doc_chunk_service import doc_chunk_service

router = APIRouter()


@router.post(
    '',
    summary='在指定文档添加数据块',
    dependencies=[
        Depends(RequestPermission('ggl:doc_chunk:add')),
        DependsRBAC,
    ],
)
async def create_doc_chunk(obj: CreateDocChunkParam) -> ResponseModel:
    doc_chunk_service.create(obj=obj)
    return await response_base.success()


@router.get(
    '/{pk}/list',
    summary='分页获取文档块列表',
    dependencies=[
        DependsJwtAuth,
        DependsPagination,
    ],
)
async def get_pagination_doc_chunk(
        db: CurrentSession,
        pk: Annotated[int, Path(...)]
) -> ResponseModel:
    doc_chunk_select = await doc_chunk_service.get_select(doc_id=pk)
    page_data = await paging_data(db, doc_chunk_select, GetDocChunkDetail)
    return await response_base.success(data=page_data)


@router.put(
    '',
    summary='更新文档块',
    dependencies=[
        DependsJwtAuth
    ]
)
async def update_doc_chunk(obj: UpdateDocChunkParam) -> ResponseModel:
    await doc_chunk_service.update(doc_chunk_id=obj.id, obj=obj)
    return await response_base.success()


@router.delete(
    path='/{pk}',
    summary='删除数据文档块',
    description='删除是假删除，不影响数据库数据，使用del_flag',
    dependencies=[
        DependsJwtAuth
    ],
)
async def delete_doc_chunk(pk: Annotated[int, Path(...)]) -> ResponseModel:
    count = await doc_chunk_service.delete(doc_chunk_id=pk)
    if count > 0:
        return await response_base.success()
    return await response_base.fail()
