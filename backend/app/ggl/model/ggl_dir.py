#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from typing import Union,List
from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Text
from backend.app.ggl.model.ggl_dir_dept import ggl_dir_dept
from backend.database.db_sql import uuid4_str
from backend.common.msd.model import Base, id_key
from backend.app.ggl.model.ggl_doc import Doc
from backend.app.admin.model.sys_user import User
from backend.app.admin.model.sys_dept import Dept


class Dir(Base):
    """目录表"""

    __tablename__ = 'ggl_dir'

    id: Mapped[id_key] = mapped_column(init=False)
    uuid: Mapped[str] = mapped_column(String(50), init=False, default_factory=uuid4_str, unique=True)
    owner_id: Mapped[int | None] = mapped_column(
        ForeignKey('sys_user.id', ondelete='SET NULL'), default=None, comment='拥有者关联ID'
    )
    del_flag: Mapped[bool] = mapped_column(default=False, comment='删除标志')
    owner: Mapped[Union['User', None]] = relationship(init=False, back_populates='owner_dirs')
    name: Mapped[str] = mapped_column(String(25), default=None,  comment="目录名称")
    desc: Mapped[str] = mapped_column(Text, default=None,  comment="目录描述")
    # 父级菜单一对多
    parent_id: Mapped[int | None] = mapped_column(
        ForeignKey('ggl_dir.id', ondelete='SET NULL'), default=None, index=True, comment='父目录ID'
    )
    parent: Mapped[Union['Dir', None]] = relationship(init=False, back_populates='children', remote_side=[id])
    children: Mapped[List['Dir'] | None] = relationship(init=False, back_populates='parent')
    share_depts: Mapped[List['Dept']] = relationship(init=False, secondary=ggl_dir_dept, back_populates="share_dirs", lazy="selectin")
    docs: Mapped[List['Doc']] = relationship(init=False, back_populates='dir')
