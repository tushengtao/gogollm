#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from sqlalchemy import String
from sqlalchemy import Text
from sqlalchemy.orm import Mapped, mapped_column

from backend.common.msd.model import Base, id_key


class Api(Base):
    """系统api"""

    __tablename__ = 'sys_api'

    id: Mapped[id_key] = mapped_column(init=False)
    name: Mapped[str] = mapped_column(String(50), unique=True, comment='api名称')
    method: Mapped[str] = mapped_column(String(50), comment='请求方法')
    path: Mapped[str] = mapped_column(String(500), comment='api路径')
    remark: Mapped[str | None] = mapped_column(Text, comment='备注')
