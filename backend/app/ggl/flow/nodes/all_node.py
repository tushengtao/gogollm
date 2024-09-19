#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from backend.app.ggl.flow.nodes.branch_node import get_branch_node
from backend.app.ggl.flow.nodes.chat_entry_node import get_chat_entry_node
from backend.app.ggl.flow.nodes.chat_model_node import get_chat_model_node
from backend.app.ggl.flow.nodes.code_node import get_code_node
from backend.app.ggl.flow.nodes.elasticsearch_agent_node import get_elasticsearch_agent_node
from backend.app.ggl.flow.nodes.http_node import get_http_node
from backend.app.ggl.flow.nodes.react_agent_node import get_react_agent_node
from backend.app.ggl.flow.nodes.structured_chat_agent_node import get_structured_chat_agent_node

AllNodesDict = {
    "ChatEntryNode": get_chat_entry_node,
    "HttpNode": get_http_node,
    "CodeNode": get_code_node,
    "ChatModelNode": get_chat_model_node,
    "ElasticSearchAgentNode": get_elasticsearch_agent_node,
    "BranchNode": get_branch_node,
    "ReactAgentNode": get_react_agent_node,
    "StructuredChatAgentNode": get_structured_chat_agent_node,
}
