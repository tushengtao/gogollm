#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from pydantic import ConfigDict
from datetime import datetime
from backend.app.ggl.schema.dir import GetDirDetail
from backend.common.msd.schema import SchemaBase


class DocSchemaBase(SchemaBase):
    dir_id: int
    source: str
    name: str
    content: str
    source_desc: str | None
    source_type: str
    path: str | None
    url: str | None
    file_size: int | None
    word_count: int | None
    split_config: dict | None
    meta_info: dict | None


class CreateDocParam(DocSchemaBase):
    pass


class UpdateDocParam(DocSchemaBase):
    id: int


class GetDocDetail(DocSchemaBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    uuid: str
    dir: GetDirDetail
    created_time: datetime
    updated_time: datetime | None

