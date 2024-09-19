#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from typing import Sequence
from sqlalchemy import select
from sqlalchemy.orm import selectinload, noload
from sqlalchemy.ext.asyncio import AsyncSession
from backend.common.msd.crud import CRUDBase
from backend.app.admin.model import Dept, User
from backend.app.ggl.model.ggl_app import App
from backend.app.ggl.schema.app import CreateAppParam, UpdateAppParam, UpdateAppFlowDataParam


class CRUDApp(CRUDBase[App, CreateAppParam, UpdateAppParam]):

    async def get(self, db, app_id: int) -> App | None:
        """
        获取应用
        :param db:
        :param app_id:
        :return:
        """
        app_res = await db.execute(
            select(App).options(noload('*')).where(App.id == app_id)
        )
        app = app_res.scalars().first()
        return app

    async def get_with_relation(self, db, app_id: int) -> App | None:
        """
        获取应用和共享部门、用户
        :param db:
        :param app_id:
        :return:
        """
        app = await db.execute(
            select(self.model)
            .options(selectinload(self.model.owner))
            .options(selectinload(self.model.share_depts))
            .where(self.model.id == app_id)
        )
        return app.scalars().first()

    async def get_owner_apps(self, db, user_id: int):
        user_res = await db.execute(
            select(User)
            .options(selectinload(User.owner_apps), noload('*'))
            .where(User.id == user_id)
        )
        return user_res.scalars().first()

    async def get_share_apps(self, db, dept_id: int):
        dept_res = await db.execute(
            select(Dept)
            .options(selectinload(Dept.share_apps).joinedload(App.owner), noload('*'))
            .where(Dept.id == dept_id)
        )
        return dept_res.scalars().first()

    async def get_all(self, db) -> Sequence[App]:
        """
        获取所有应用
        :param db:
        :return:
        """
        apps = await db.execute(select(self.model))
        return apps.scalars().all()

    async def update_app_flow(self, db, app_id: int, obj_in: UpdateAppFlowDataParam) -> int:
        """
        更新应用flow
        :param db:
        :param app_id:
        :param obj_in:
        :return:
        """
        rowcount = await self.update_(db, pk=app_id, obj_in=obj_in)
        return rowcount

    async def create(self, db, obj_in: CreateAppParam) -> None:
        """
        创建应用
        :param db:
        :param obj_in:
        :return:
        """
        app = App(
            name=obj_in.name,
            owner_id=obj_in.owner_id,
            type=obj_in.type,
            desc=obj_in.desc,
            flow_data=obj_in.flow_data
        )
        db.add(app)
        db.commit()

    async def delete(self, db, app_id: int) -> int:
        """
        删除应用  伪删除
        :param db:
        :param app_id:
        :return:
        """
        return await self.delete_(db, pk=app_id, del_flag=True)

    async def update_share_dept(self, db: AsyncSession, app: App, share_depts: Sequence[int]) -> None:
        """
        设置app的共享部门和共享用户
        :param app:
        :param db:
        :param share_depts:
        :return:
        """
        for i in list(app.share_depts):
            app.share_depts.remove(i)
        dept_list = []
        for i in share_depts:
            dept_list.append(await db.get(Dept, i))
        app.share_depts.extend(dept_list)


app_dao: CRUDApp = CRUDApp(App)
