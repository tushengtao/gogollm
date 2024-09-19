#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from typing import Optional, Type, Any
from langchain_core.callbacks import CallbackManagerForToolRun
from langchain_core.pydantic_v1 import BaseModel, Field
from langchain_core.tools import BaseTool
from backend.app.ggl.flow.tools.help.duckduckgo_search_tool_helper import DuckDuckGoSearchAPIWrapper


class DDGInput(BaseModel):
    query: str = Field(description="输入需要搜索的查询内容")
    query_time_limit: str = Field(description="""
    搜索的时间范围，请一步步分析用户查询需求，然后选择，如下：
      - "d"：表示搜索24小时内、1天内、今天、昨天的结果
      - "w"：表示搜索一周内的结果
      - "m"：表示搜索一个月内的结果
      - "y"：表示搜索一年内的结果
      - "none"（默认）：表示不限制搜索时间范围
    """, default="none")
    source: str = Field(description="""
    指定搜索结果的来源，如果用户想搜索最新的资讯、新闻，选择 `news`,如果不是选择默认值`text`。
      - `text`（默认）= 来自DuckDuckGo文本搜索引擎的搜索结果
      - `news` = 来自DuckDuckGo新闻搜索引擎的搜索结果
    """, default="text")


class DuckDuckGoSearchTool(BaseTool):
    name: str = "duckduckgo_search_tool"
    description: str = (
        """
        DuckDuckGo是一款浏览器搜索引擎。基于DuckDuckGo搜索引擎的搜索工具。 从网络上获取百科信息、实时信息、当前信息，如新闻、天气、体育比分等。
        """
    )
    max_results: int = 6
    api_wrapper: DuckDuckGoSearchAPIWrapper = Field(
        default_factory=DuckDuckGoSearchAPIWrapper
    )
    extra_node_data: Any = None
    args_schema: Type[BaseModel] = DDGInput

    def _run(
            self,
            query: str,
            query_time_limit: Optional[str] = 'none',
            source: Optional[str] = 'text',
            run_manager: Optional[CallbackManagerForToolRun] = None,
    ) -> str:
        """Use the tool."""
        return self.api_wrapper.run(query, query_time_limit, source, self.max_results)

    def bind(self, **kwargs: Any):
        self.extra_node_data = kwargs
        tools_list = self.extra_node_data["tools_list"]
        for tool in tools_list:
            if tool["name"] == self.name:
                self.return_direct = tool['return_direct']
                self.description = tool['description']
                self.max_results = tool['max_results']
