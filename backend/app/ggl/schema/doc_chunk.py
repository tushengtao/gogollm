#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from backend.common.msd.schema import SchemaBase
from datetime import datetime
from pgvector.sqlalchemy import Vector


class DocChunkSchemaBase(SchemaBase):
    uuid: str
    doc_id: int
    meta_info: dict | None
    content: str | None
    content_type: str | None


class CreateDocChunkParam(DocChunkSchemaBase):
    pass


class UpdateDocChunkParam(DocChunkSchemaBase):
    id: int


class GetDocChunkDetail(DocChunkSchemaBase):
    id: int
    created_time: datetime
    updated_time: datetime | None
