#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from typing import Union

from sqlalchemy import String, ForeignKey, BigInteger
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Text, JSON
from backend.database.db_sql import uuid4_str
from backend.common.msd.model import Base, id_key


class Doc(Base):
    """文档表"""

    __tablename__ = 'ggl_doc'

    id: Mapped[id_key] = mapped_column(init=False)
    uuid: Mapped[str] = mapped_column(String(50), init=False, default_factory=uuid4_str, unique=True)
    dir_id: Mapped[int] = mapped_column(ForeignKey('ggl_dir.id'), nullable=False)
    dir: Mapped[Union['Dir', None]] = relationship(init=False, back_populates='docs')
    del_flag: Mapped[bool] = mapped_column(default=False, comment='删除标志')
    name: Mapped[str] = mapped_column(String(25), default=False, comment="文档名称")
    content: Mapped[str] = mapped_column(Text, comment="内容", default="", deferred=True)
    source: Mapped[str] = mapped_column(String(25), default='', comment="来源")
    source_desc: Mapped[str] = mapped_column(Text, default='', comment="来源描述")
    source_type: Mapped[str] = mapped_column(String(25), default='', comment="来源类型")
    path: Mapped[str] = mapped_column(Text, default='', comment="文档路径：oss")
    url: Mapped[str] = mapped_column(Text, default='', comment="文档网络地址")
    file_size: Mapped[BigInteger] = mapped_column(BigInteger, default=0, comment="文件大小")
    word_count: Mapped[BigInteger] = mapped_column(BigInteger, default=0, comment="字数")
    split_config: Mapped[dict] = mapped_column(JSON, default=None, comment="分割配置")
    meta_info: Mapped[dict] = mapped_column(JSON, default=None,  comment="文档元数据")

    chunks: Mapped[list['DocChunk']] = relationship(init=False, back_populates='doc')
