#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from typing import List
from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Text, JSON
from backend.app.ggl.model.ggl_app_dept import ggl_app_dept
from backend.common.msd.model import Base, id_key
from backend.app.admin.model.sys_user import User
import json


class App(Base):
    """应用表"""

    __tablename__ = 'ggl_app'

    id: Mapped[id_key] = mapped_column(init=False)
    # 应用-拥有者一对多
    owner_id: Mapped[int] = mapped_column(ForeignKey('sys_user.id'), comment='拥有者关联ID')
    owner: Mapped[User] = relationship(init=False, back_populates='owner_apps', lazy="joined")
    name: Mapped[str] = mapped_column(String(256), comment="应用名称")
    del_flag: Mapped[bool] = mapped_column(default=False, comment='删除标志')
    desc: Mapped[str] = mapped_column(Text, default="", comment="应用描述")
    flow_data: Mapped[dict] = mapped_column(JSON, default=None, comment="编排流程数据")
    type: Mapped[int] = mapped_column(default=1, comment="应用类型: 0 固定编排 1 流程编排 2 其他")
    share_depts: Mapped[List['Dept']] = relationship('Dept', init=False, secondary=ggl_app_dept, back_populates="share_apps", lazy="selectin")
