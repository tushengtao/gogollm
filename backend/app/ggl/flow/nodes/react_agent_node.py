#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain.agents import AgentExecutor, create_react_agent
from backend.app.ggl.conf import gogollm_settings
from backend.app.ggl.flow.tools.all_tools import all_tools
from backend.app.ggl.langchain.llm.ChatModel import ChatModel
from backend.app.ggl.langchain.memory.PostgresChatMessageHistory import PostgresChatMessageHistory
from backend.app.ggl.langchain.memory.RunnableWithMessageHistory import RunnableWithMessageHistory
from backend.app.ggl.langchain.output.ReActSingleInputOutputParser import ReActSingleInputOutputParser
from backend.database.db_sql import sync_db_session


def get_react_agent_node(nodeId, flowState):
    nodeData = flowState["flow_dag"]["nodes_info"][nodeId]["data"]
    question = flowState["question"]
    nodeData['question'] = question
    nodeData['session_id'] = flowState["session_id"]
    nodeData['user_id'] = flowState["user_id"]
    nodeData['app_id'] = flowState["app_id"]
    nodeData['app_name'] = flowState["app_name"]
    nodeData['msg_history_count'] = flowState["msg_history_count"]
    # tools
    tools_list = nodeData.get("tools_list", [])
    llm_tools = []
    if len(tools_list) > 0:
        for tool in tools_list:
            llm_tool = all_tools[tool.get("name")]
            llm_tool.bind(**nodeData)
            llm_tools.append(llm_tool)
    agent_prompt = nodeData["agent_prompt"]
    msg_history_count = nodeData["msg_history_count"]
    default_template = """
Assistant is a large language model trained by GoGoLLM.

Assistant is designed to be able to assist with a wide range of tasks, from answering simple questions to providing in-depth explanations and discussions on a wide range of topics. As a language model, Assistant is able to generate human-like text based on the input it receives, allowing it to engage in natural-sounding conversations and provide responses that are coherent and relevant to the topic at hand.

Assistant is constantly learning and improving, and its capabilities are constantly evolving. It is able to process and understand large amounts of text, and can use this knowledge to provide accurate and informative responses to a wide range of questions. Additionally, Assistant is able to generate its own text based on the input it receives, allowing it to engage in discussions and provide explanations and descriptions on a wide range of topics.

Overall, Assistant is a powerful tool that can help with a wide range of tasks and provide valuable insights and information on a wide range of topics. Whether you need help with a specific question or just want to have a conversation about a particular topic, Assistant is here to assist.

TOOLS:

Assistant has access to the following tools:

{{tools}}

To use a tool, please use the following format:


Thought: Do I need to use a tool? Yes
Action: the action to take, should be one of [{{tool_names}}]
Action Input: the input to the action
Observation: the result of the action


When you have a response to say to the Human, or if you do not need to use a tool, you MUST use the format:


Thought: Do I need to use a tool? No
Final Answer: [your response here]

Begin!

Previous conversation history:

{{chat_history}}

Previous conversation history end.

New input: {{question}}

{{agent_scratchpad}}
"""
    if agent_prompt in [None, ""]:
        agent_prompt = default_template
    prompt = ChatPromptTemplate.from_template(template=agent_prompt, template_format="mustache")
    nodeData["streaming"] = flowState["streaming"]
    model_config = {
        "model_label": nodeData["model_label"],
        "model_name": nodeData["model_name"],
        "temperature": nodeData["temperature"],
        "streaming": nodeData["streaming"],
        "base_url": gogollm_settings.OPENAI_API_BASE
    }
    use_unified_llm_gateway = nodeData["use_unified_llm_gateway"]
    llm = None
    if use_unified_llm_gateway:
        del model_config['model_label']
        llm = ChatOpenAI(**model_config)
    else:
        llm = ChatModel(model_config).get_llm()

    output_parser = ReActSingleInputOutputParser()
    agent = create_react_agent(llm=llm, tools=llm_tools, prompt=prompt, output_parser=output_parser)
    agent_executor = AgentExecutor(agent=agent, tools=llm_tools, handle_parsing_errors=True)

    node_carry_history_msg = nodeData['node_carry_history_msg']
    if node_carry_history_msg is False:
        msg_history_count = 0

    memory = PostgresChatMessageHistory(
        session_id=nodeData['session_id'],
        app_id=nodeData['app_id'],
        user_id=nodeData['user_id'],
        msg_history_count=msg_history_count,
        sync_session=sync_db_session(),
        question=question,
        is_react_agent_type=True
    )
    agent_executor_with_history = RunnableWithMessageHistory(
        agent_executor,
        lambda session_id: memory,
        input_messages_key="question",
        history_messages_key="chat_history",
        is_react_agent_type=True
    )
    agent_executor = agent_executor_with_history
    return agent_executor
