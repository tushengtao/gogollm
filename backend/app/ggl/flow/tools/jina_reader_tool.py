#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import requests
from typing import Any, Type
from pydantic import BaseModel, Field
from langchain_core.tools import BaseTool
from backend.common.exception import errors


class JinaReaderInput(BaseModel):
    url: str = Field(description="获取网址详细内容的链接")


class JinaReaderTool(BaseTool):
    name = "jina_reader_tool"
    description = """
    从给定的HTTP/HTTPS网址获取网页的详细内容。 此工具适用于从网页中提取信息。
    """
    args_schema: Type[BaseModel] = JinaReaderInput
    return_direct = False
    extra_node_data: Any = None

    def _run(
            self,
            url: str
    ) -> str:
        try:
            headers = {
                "Accept": "application/json"
            }
            request_url = 'https://r.jina.ai/' + url
            response = requests.get(request_url, headers=headers, timeout=120)
            result = response.json()
            if result.get('code') == 200:
                return str(result.get('data'))
            else:
                return "获取网页内容失败"
        except Exception as e:
            raise errors.RequestError(msg=f'Jina Reader 获取{url}网页内容失败')

    def bind(self, **kwargs: Any):
        self.extra_node_data = kwargs
        tools_list = self.extra_node_data["tools_list"]
        for tool in tools_list:
            if tool["name"] == self.name:
                self.return_direct = tool['return_direct']
                self.description = tool['description']
