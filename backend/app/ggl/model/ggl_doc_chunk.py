#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from typing import Union

from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import JSON
from backend.database.db_sql import uuid4_str
from backend.common.msd.model import Base, id_key
from backend.app.ggl.model.ggl_doc import Doc
from sqlalchemy import Text
from pgvector.sqlalchemy import Vector
from pydantic import ConfigDict


class DocChunk(Base):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    """文档块表"""

    __tablename__ = 'ggl_doc_chunk'

    id: Mapped[id_key] = mapped_column(init=False)
    uuid: Mapped[str] = mapped_column(String(50), init=False, default_factory=uuid4_str, unique=True)
    doc_id: Mapped[int] = mapped_column(ForeignKey('ggl_doc.id'), nullable=False)
    doc: Mapped[Union['Doc', None]] = relationship(init=False, back_populates='chunks')
    del_flag: Mapped[bool] = mapped_column(default=False, comment='删除标志（0删除 1存在）')
    meta_info: Mapped[dict] = mapped_column(JSON, default=False, comment="块元数据")
    content: Mapped[str] = mapped_column(Text, default=False, comment="块内容")
    content_type: Mapped[str] = mapped_column(String(25), default=False, comment="块类型")
    embedding: Mapped[Vector] = mapped_column(Vector, default=False, comment="嵌入向量")

    # @field_validator('embedding')
    # def validate_embedding(self, value):
    #     return value
