#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from fastapi import APIRouter
from backend.app.ggl.api.v1 import router

v1 = APIRouter()

v1.include_router(router)
