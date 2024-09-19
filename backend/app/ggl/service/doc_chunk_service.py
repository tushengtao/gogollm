#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from backend.app.ggl.crud.crud_doc_chunk import doc_chunk_dao
from backend.app.ggl.schema.doc_chunk import CreateDocChunkParam, UpdateDocChunkParam
from backend.database.db_sql import async_db_session
from sqlalchemy import Select


class DocChunkService:

    @staticmethod
    async def create(obj: CreateDocChunkParam) -> None:
        async with async_db_session.begin() as db:
            await doc_chunk_dao.create(db, obj)

    @staticmethod
    async def delete(doc_chunk_id: int) -> int:
        async with async_db_session.begin() as db:
            return await doc_chunk_dao.delete(db, doc_chunk_id)

    @staticmethod
    async def update(doc_chunk_id: int, obj: UpdateDocChunkParam) -> int:
        async with async_db_session.begin() as db:
            return await doc_chunk_dao.update(db, doc_chunk_id, obj)

    @staticmethod
    async def get_select(*, doc_id: int) -> Select:
        return await doc_chunk_dao.get_list_by_doc(doc_id)


doc_chunk_service = DocChunkService()
