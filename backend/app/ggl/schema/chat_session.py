#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from backend.common.msd.schema import SchemaBase


class CreateChatSessionParam(SchemaBase):
    session_id: str
    app_id: int
    user_id: str
    session_name: str


class UpdateChatSessionParam(CreateChatSessionParam):
    id: int
