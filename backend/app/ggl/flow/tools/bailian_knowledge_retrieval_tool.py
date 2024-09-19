#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from typing import Any, Type
from pydantic import BaseModel, Field
from langchain_core.tools import BaseTool
from alibabacloud_bailian20231229.client import Client as bailian20231229Client
from alibabacloud_tea_openapi import models as open_api_models
from alibabacloud_bailian20231229 import models as bailian_20231229_models
from alibabacloud_tea_util import models as util_models
from backend.app.ggl.conf import gogollm_settings


def create_client() -> bailian20231229Client:
    config = open_api_models.Config(
        access_key_id=gogollm_settings.ALIBABA_CLOUD_ACCESS_KEY_ID,
        access_key_secret=gogollm_settings.ALIBABA_CLOUD_ACCESS_KEY_SECRET
    )
    config.endpoint = f'bailian.cn-beijing.aliyuncs.com'
    return bailian20231229Client(config)


class SearchInput(BaseModel):
    query: str = Field(description="should be a search query")


class BailianKnowledgeRetrievalTool(BaseTool):
    name = "bailian_knowledge_retrieval_tool"
    description = "百炼知识库检索工具"
    args_schema: Type[BaseModel] = SearchInput
    return_direct = False
    workspaceId = ""
    indexId = ""
    model_name = "gte-rerank-hybrid"
    rerank_min_score = 0.3
    save_retriever_history = False
    extra_node_data: Any = None

    def _run(
            self,
            query: str
    ) -> str:
        client = create_client()
        rerank_0 = bailian_20231229_models.RetrieveRequestRerank(
            model_name=self.model_name
        )
        retrieve_request = bailian_20231229_models.RetrieveRequest(
            query=query,
            rerank=[
                rerank_0
            ],
            rerank_min_score=self.rerank_min_score,
            index_id=self.indexId,
            save_retriever_history=self.save_retriever_history
        )
        runtime = util_models.RuntimeOptions()
        headers = {}
        try:
            resp = client.retrieve_with_options(self.workspaceId, retrieve_request, headers, runtime)
            nodes = resp.body.data.nodes
            items = []
            if len(nodes) > 0:
                for node in nodes:
                    item = {
                        "source_doc_name": node.metadata['doc_name'],
                        "content": node.text,
                        "score": node.score
                    }
                    items.append(item)
            return str(items)
        except Exception as error:
            raise error

    def bind(self, **kwargs: Any):
        self.extra_node_data = kwargs
        tools_list = self.extra_node_data["tools_list"]
        for tool in tools_list:
            if tool["name"] == self.name:
                self.return_direct = tool['return_direct']
                self.description = tool['description']
                self.workspaceId = tool['workspaceId']
                self.indexId = tool['indexId']
                self.model_name = tool['model_name']
                self.rerank_min_score = tool['rerank_min_score']
                self.save_retriever_history = tool['save_retriever_history']
