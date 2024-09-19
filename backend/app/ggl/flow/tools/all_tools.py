#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from backend.app.ggl.flow.tools.bailian_knowledge_retrieval_tool import BailianKnowledgeRetrievalTool
from backend.app.ggl.flow.tools.duckduckgo_search_tool import DuckDuckGoSearchTool
from backend.app.ggl.flow.tools.elasticsearch_search_tool import ElasticSearchSearchTool
from backend.app.ggl.flow.tools.jina_reader_tool import JinaReaderTool
from backend.app.ggl.flow.tools.python_repl_tool import PythonReplTool

all_tools = {
    "jina_reader_tool": JinaReaderTool(),
    "bailian_knowledge_retrieval_tool": BailianKnowledgeRetrievalTool(),
    "duckduckgo_search_tool": DuckDuckGoSearchTool(),
    "python_repl_tool": PythonReplTool(),
    "elasticsearch_search_tool": ElasticSearchSearchTool()
}
