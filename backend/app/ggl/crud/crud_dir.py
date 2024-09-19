#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from backend.app.admin.model import Dept, User
from backend.app.ggl.model.ggl_dir import Dir
from backend.app.ggl.schema.dir import CreateDirParam, UpdateDirParam
from backend.common.msd.crud import CRUDBase
from sqlalchemy import select, and_
from sqlalchemy.orm import selectinload
from typing import Sequence


class CRUDDir(CRUDBase[Dir, CreateDirParam, UpdateDirParam]):
    async def get(self, db, dir_id: int) -> Dir | None:
        """
        获取目录
        :param db:
        :param dir_id:
        :return:
        """
        return await self.get_(db, pk=dir_id)

    async def get_with_relation(self, db, dir_id: int) -> Dir | None:
        """
        获取目录和共享部门、用户
        :param db:
        :param dir_id:
        :return:
        """
        dir = await db.execute(
            select(self.model)
            .options(selectinload(self.model.owner))
            .options(selectinload(self.model.share_depts))
            .options(selectinload(self.model.share_users))
            .where(self.model.id == dir_id)
        )
        return dir.scalars().first()

    async def get_owner_dirs(self, db, user_id: int) -> Sequence[Dir]:
        """
        获取用户owner所有私有的目录
        :param db:
        :param user_id:
        :return:
        """
        dirs = await db.execute(
            select(self.model)
            .where(
                and_(self.model.owner_id == user_id, self.model.del_flag == False)
            )
        )
        return dirs.scalars().all()

    async def get_dept_share_dirs(self, db, dept_id: int) -> Sequence[Dir]:
        """
        获取一个部门被共享的所有目录
        :param db:
        :param dept_id:
        :return:
        """
        dirs = await db.execute(
            select(self.model)
            .join(self.model.share_depts)
            .where(
                and_(Dept.id == dept_id, self.model.del_flag == False)
            )
        )
        return dirs.scalars().all()

    async def get_user_share_dirs(self, db, user_id: int) -> Sequence[Dir]:
        """
        获取一个用户被共享的所有目录
        :param db:
        :param user_id:
        :return:
        """
        dirs = await db.execute(
            select(self.model)
            .join(self.model.share_users)
            .where(
                and_(User.id == user_id, self.model.del_flag == False)
            )
        )
        return dirs.scalars().all()

    async def get_all(self, db) -> Sequence[Dir]:
        dirs = await db.execute(select(self.model))
        return dirs.scalars().all()

    async def create(self, db, obj_in: CreateDirParam) -> None:
        """
        创建目录
        :param db:
        :param obj_in:
        :return:
        """
        return await self.create_(db, obj_in=obj_in)

    async def update(self, db, dir_id: int, obj_in: UpdateDirParam) -> int:
        """
        更新目录
        :param dir_id:
        :param db:
        :param obj_in:
        :return:
        """
        rowcount = await self.update_(db, pk=dir_id, obj_in=obj_in)
        return rowcount

    async def delete(self, db, dir_id: int) -> int:
        """
        删除目录
        :param dir_id:
        :param db:
        :return:
        """
        return await self.delete_(db, pk=dir_id, del_flag=True)



    async def update_share_dept(self, db, dir_id: int, share_depts: Sequence[int]) -> None:
        """
        设置dir的共享部门和共享用户
        :param db:
        :param app_id:
        :param share_depts:
        :return:
        """
        dir = await db.get(Dir, dir_id)
        for i in list(dir.share_depts):
            dir.share_depts.remove(i)
        dept_list = []
        for i in share_depts:
            dept_list.append(await db.get(Dept, i))
        dir.share_depts.extend(dept_list)

    async def update_share_user(self, db, dir_id: int, share_users: Sequence[int]) -> None:
        """
        设置dir的共享部门和共享用户
        :param db:
        :param dir_id:
        :param share_users:
        :return:
        """
        dir = await db.get(Dir, dir_id)
        for i in list(dir.share_users):
            dir.share_users.remove(i)
        user_list = []
        for i in share_users:
            user_list.append(await db.get(User, i))
        dir.share_users.extend(user_list)


dir_dao: CRUDDir = CRUDDir(Dir)
