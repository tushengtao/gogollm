#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from pydantic import ConfigDict
from datetime import datetime
from backend.app.admin.schema.dept import GetDeptListDetails
from backend.app.admin.schema.user import GetUserInfoDetail
from backend.common.msd.schema import SchemaBase



class DirSchemaBase(SchemaBase):
    owner_id: int
    name: str
    desc: str | None
    parent_id: int | None


class CreateDirParam(DirSchemaBase):
    pass


class UpdateDirParam(DirSchemaBase):
    id: int
    share_users: list[int]
    share_depts: list[int]


class GetDirDetail(DirSchemaBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    uuid: str
    owner: GetUserInfoDetail
    created_time: datetime
    updated_time: datetime | None = None
    share_users: list[GetUserInfoDetail]
    share_depts: list[GetDeptListDetails]

