#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from backend.app.ggl.model.ggl_doc_chunk import DocChunk
from backend.app.ggl.schema.doc_chunk import CreateDocChunkParam, UpdateDocChunkParam
from backend.common.msd.crud import CRUDBase
from sqlalchemy import select, Select, desc


class CRUDDocChunk(CRUDBase[DocChunk, CreateDocChunkParam, UpdateDocChunkParam]):
    async def get(self, db, doc_chunk_id: int) -> DocChunk | None:
        return await self.get_(db, pk=doc_chunk_id)

    async def get_list_by_doc(self, doc_id: int) -> Select:
        se = select(self.model).where(self.model.doc_id == doc_id).order_by(desc(self.model.updated_time))
        return se

    async def create(self, db, obj_in: CreateDocChunkParam) -> None:
        """
        创建文档块
        :param db:
        :param obj_in:
        :return:
        """
        return await self.create_(db, obj_in=obj_in)

    async def update(self, db, doc_chunk_id: int, obj_in: UpdateDocChunkParam) -> int:
        """
        更新文档块
        :param db:
        :param doc_chunk_id:
        :param obj_in:
        :return:
        """
        rowcount = await self.update_(db, pk=doc_chunk_id, obj_in=obj_in)
        return rowcount

    async def delete(self, db, doc_chunk_id: int) -> int:
        """
        删除文档块
        :param db:
        :param doc_chunk_id:
        :return:
        """
        return await self.delete_(db, pk=doc_chunk_id, del_flag=True)


doc_chunk_dao: CRUDDocChunk = CRUDDocChunk(DocChunk)
