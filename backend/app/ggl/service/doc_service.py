#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from backend.app.ggl.crud.crud_doc import doc_dao
from backend.app.ggl.model.ggl_dir import Dir
from backend.app.ggl.schema.doc import CreateDocParam, UpdateDocParam
from backend.database.db_sql import async_db_session
from sqlalchemy import Select
from fastapi import Request
from backend.common.exception import errors


class DocService:

    @staticmethod
    async def create(request: Request, obj: CreateDocParam) -> None:
        async with async_db_session.begin() as db:
            doc_dir = db.get(Dir, obj.dir_id)
            if request.user.id != doc_dir.owner_id:
                raise errors.ForbiddenError(msg='无权限')
            await doc_dao.create(db, obj)

    @staticmethod
    async def delete(pk: int) -> int:
        async with async_db_session.begin() as db:
            return await doc_dao.delete(db, pk)

    @staticmethod
    async def update(doc_id: int, obj: UpdateDocParam) -> int:
        async with async_db_session.begin() as db:
            return await doc_dao.update(db, doc_id, obj)

    @staticmethod
    async def get_select(*, dir_id: int) -> Select:
        return await doc_dao.get_list_by_dir(dir_id)


doc_service = DocService()
