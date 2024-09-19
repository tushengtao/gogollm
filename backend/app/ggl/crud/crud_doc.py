#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from backend.app.ggl.model.ggl_doc import Doc
from backend.app.ggl.schema.doc import CreateDocParam, UpdateDocParam
from backend.common.msd.crud import CRUDBase
from sqlalchemy import select, and_, Select, desc
from sqlalchemy.orm import selectinload
from typing import Sequence


class CRUDDoc(CRUDBase[Doc, CreateDocParam, UpdateDocParam]):
    async def get(self, db, doc_id: int) -> Doc | None:
        """
        获取文档
        :param db:
        :param doc_id:
        :return:
        """
        return await self.get_(db, pk=doc_id)

    async def get_list_by_dir(self, dir_id: int) -> Select:
        """
        获取指定目录下的文档列表
        :param dir_id:
        :return: Select
        """
        se = select(self.model).options(selectinload(self.model.dir)).where(self.model.dir_id == dir_id).order_by(
            desc(self.model.updated_time)
        )
        return se

    async def create(self, db, obj_in: CreateDocParam) -> None:
        """
        创建文档
        :param db:
        :param obj_in:
        :return:
        """
        return await self.create_(db, obj_in=obj_in)

    async def update(self, db, doc_id: int, obj_in: UpdateDocParam) -> int:
        """
        更新文档
        :param db:
        :param doc_id:
        :param obj_in:
        :return:
        """
        rowcount = await self.update_(db, pk=doc_id, obj_in=obj_in)
        return rowcount

    async def delete(self, db, doc_id: int) -> int:
        """
        删除文档
        :param db:
        :param doc_id:
        :return:
        """
        return await self.delete_(db, pk=doc_id, del_flag=True)


doc_dao: CRUDDoc = CRUDDoc(Doc)
