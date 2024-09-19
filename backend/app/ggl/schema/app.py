#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from backend.app.admin.schema.dept import GetDeptListDetails
from backend.app.admin.schema.user import GetUserInfoDetail
from backend.common.msd.schema import SchemaBase
from pydantic import ConfigDict, Field
from datetime import datetime
from typing import Optional
import json


class AppSchemaBase(SchemaBase):
    name: str
    desc: str | None
    type: int | None


class OpenApiChatParam(SchemaBase):
    app_id: int
    streaming: bool
    question: str
    user_id: str
    session_id: str


class CreateAppParam(AppSchemaBase):
    owner_id: Optional[int] = Field(default=None, exclude=True)
    flow_data: Optional[dict] = Field(default=json.loads('{"nodes":[],"edges":[],"viewport":{"x":0,"y":0,"zoom":1}}'),
                                      exclude=True)


class UpdateAppParam(SchemaBase):
    name: Optional[str] = Field(default=None, exclude=True)
    desc: Optional[str] = Field(default=None, exclude=True)
    type: Optional[int] = Field(default=None, exclude=True)
    flow_data: Optional[dict] = Field(default=None, exclude=True)


class UpdateAppFlowDataParam(SchemaBase):
    flow_data: dict


class UpdateAppShareUserParam:
    id: int
    share_users: list[int]


class UpdateAppShareDeptParam:
    id: int
    share_depts: list[int]


class GetAppDetail(AppSchemaBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    owner: GetUserInfoDetail
    created_time: datetime
    updated_time: datetime | None = None
    share_users: list[GetUserInfoDetail]
    share_depts: list[GetDeptListDetails]
