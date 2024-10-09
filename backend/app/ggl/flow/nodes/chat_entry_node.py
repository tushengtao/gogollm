#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from langchain_core.runnables import RunnableLambda
from backend.app.ggl.flow.nodes.helper import set_input_variables_value


def get_chat_entry_node(nodeId, flowState):
    question = flowState["question"]
    question = question.replace('\n', '')
    set_input_variables_value(nodeId=nodeId, flowState=flowState, value=question)
    return RunnableLambda(lambda question: question)