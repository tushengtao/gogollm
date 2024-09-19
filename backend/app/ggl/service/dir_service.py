#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from backend.app.admin.model import User
from backend.app.ggl.crud.crud_dir import dir_dao
from backend.app.ggl.model.ggl_dir import Dir
from backend.app.ggl.schema.dir import CreateDirParam, UpdateDirParam
from backend.database.db_sql import async_db_session
from typing import Sequence


class DirService:
    @staticmethod
    async def get_user_all_dirs(user_id: int) -> Sequence[Dir]:
        async with async_db_session() as db:
            owner_dirs = await dir_dao.get_owner_dirs(db, user_id)
            user_share_dirs = await dir_dao.get_user_share_dirs(db, user_id)
            user = await db.get(User, user_id)
            dept_id = user.dept_id
            dept_share_dirs = await dir_dao.get_dept_share_dirs(db, dept_id)
            return {
                'owner_dirs': owner_dirs,
                'user_share_dirs': user_share_dirs,
                'dept_share_dirs': dept_share_dirs
            }

    @staticmethod
    async def create(obj: CreateDirParam) -> None:
        async with async_db_session.begin() as db:
            await dir_dao.create(db, obj)

    @staticmethod
    async def delete(pk: int) -> int:
        async with async_db_session.begin() as db:
            return await dir_dao.delete(db, pk)

    @staticmethod
    async def update(pk: int, obj: UpdateDirParam) -> int:
        async with async_db_session.begin() as db:
            return await dir_dao.update(db, pk, obj)

    @staticmethod
    async def update_share_dept(*, pk: int, dept_ids: Sequence[int]) -> None:
        async with async_db_session.begin() as db:
            dir = db.get(Dir, pk)
            await dir_dao.update_share_dept(db, dir, dept_ids)

    @staticmethod
    async def update_share_user(*, pk: int, user_ids: Sequence[int]) -> None:
        async with async_db_session.begin() as db:
            dir = db.get(Dir, pk)
            await dir_dao.update_share_user(db, dir, user_ids)


dir_service = DirService()
