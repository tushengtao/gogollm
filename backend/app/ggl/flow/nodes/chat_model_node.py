#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from langchain.agents import create_openai_tools_agent, AgentExecutor
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder, PromptTemplate, HumanMessagePromptTemplate
from langchain.output_parsers import ResponseSchema, StructuredOutputParser

from backend.app.ggl.flow.tools.all_tools import all_tools
from backend.app.ggl.langchain.llm.ChatModel import ChatModel
from backend.app.ggl.langchain.memory.PostgresChatMessageHistory import PostgresChatMessageHistory
from backend.app.ggl.langchain.memory.RunnableWithMessageHistory import RunnableWithMessageHistory
from backend.app.ggl.conf import gogollm_settings
from backend.app.ggl.langchain.output.GoGoLLMStructuredOutputParser import GoGoLLMStructuredOutputParser
from backend.database.db_sql import sync_db_session


def get_chat_model_node(nodeId, flowState):
    nodeData = flowState["flow_dag"]["nodes_info"][nodeId]["data"]
    msg_history_count = flowState["msg_history_count"]
    question = flowState["question"]
    session_id = flowState["session_id"]
    app_id = flowState["app_id"]
    app_name = flowState["app_name"]
    user_id = flowState["user_id"]
    prompt = nodeData["prompt"]

    carry_messages = []
    input_variables = nodeData.get("inputVariables", [])
    outputVariables = nodeData.get("outputVariables", [])
    response_schemas = []
    for item in outputVariables:
        response_schemas.append(ResponseSchema(name=item["name"], description=item["value"]))
    output_parser = None
    format_instructions = ""
    if len(response_schemas) > 0:
        output_parser = StructuredOutputParser.from_response_schemas(response_schemas)
        format_instructions = output_parser.get_format_instructions()
    input_variables_dict = {item["name"]: item["value"] for item in input_variables if item["value"] not in [None, ""]}
    prompt_input_variables_key_list = [str(key) for key in input_variables_dict.keys()]
    # 部分变量格式化，先格式化变量值存在的
    partial_variables_dict = {item["name"]: '{{' + item["name"] + '}}' for item in input_variables if
                              item["name"] not in prompt_input_variables_key_list}

    if prompt not in [None, ""]:
        if format_instructions != "":
            partial_variables_dict["format_instructions"] = format_instructions
            partial_variables_dict["chat_history"] = '{{chat_history}}'
            prompt = prompt + "\n The output format requirements are as follows：" + format_instructions
        prompt_template = PromptTemplate(input_variables=prompt_input_variables_key_list,
                                         partial_variables=partial_variables_dict,
                                         template=prompt, template_format="mustache")
        # 只有当input_variables_dict不为空时才进行格式化
        # 检查prompt中是否存在input_variables的键
        prompt_has_input_variables = any(key in prompt for key in input_variables_dict.keys())
        if input_variables_dict and prompt_has_input_variables:
            format_prompt = prompt_template.format(**input_variables_dict)
            carry_messages.append(('system', format_prompt))
        else:
            carry_messages.append(('system', prompt))

    node_carry_history_msg = nodeData['node_carry_history_msg']
    only_carry_human_history_msg = nodeData['only_carry_human_history_msg']

    if node_carry_history_msg is False:
        msg_history_count = 0

    nodeData["streaming"] = flowState["streaming"]
    model_config = {
        "model_label": nodeData["model_label"],
        "model_name": nodeData["model_name"],
        "temperature": nodeData["temperature"],
        "base_url": gogollm_settings.OPENAI_API_BASE,
        "streaming": nodeData["streaming"]
    }
    use_unified_llm_gateway = nodeData["use_unified_llm_gateway"]
    llm = None
    if use_unified_llm_gateway:
        del model_config["model_label"]
        llm = ChatOpenAI(**model_config)
    else:
        llm = ChatModel(model_config).get_llm()

    if output_parser is not None:
        llm.bind(response_format={"type": "json_object"})

    save_current_conversation = nodeData.get("save_current_conversation", True)
    memory = PostgresChatMessageHistory(
        session_id=session_id,
        app_id=app_id,
        user_id=user_id,
        msg_history_count=msg_history_count,
        sync_session=sync_db_session(),
        question=question,
        save_current_conversation=save_current_conversation,
        only_carry_human_history_msg=only_carry_human_history_msg
    )

    carry_messages.append(MessagesPlaceholder(variable_name="chat_history"))
    human_prompt = "{{question}}"
    human_message_template = HumanMessagePromptTemplate.from_template(input_variables=['question'],
                                                                      template=human_prompt, template_format="mustache")
    carry_messages.append(human_message_template)
    nodeData["session_id"] = session_id
    nodeData["user_id"] = user_id
    nodeData["app_id"] = app_id
    nodeData["app_name"] = app_name

    # 处理 tool
    tools_list = nodeData.get("tools_list", [])
    llm_tools = []
    if len(tools_list) > 0:
        for tool in tools_list:
            llm_tool = all_tools[tool.get("name")]
            llm_tool.bind(**nodeData)
            llm_tools.append(llm_tool)
        carry_messages.append(MessagesPlaceholder("agent_scratchpad"))
        chat_prompt = ChatPromptTemplate.from_messages(carry_messages, template_format="mustache")
        agent = create_openai_tools_agent(llm, llm_tools, chat_prompt)
        chain = AgentExecutor(agent=agent, tools=llm_tools)
    else:
        chat_prompt = ChatPromptTemplate.from_messages(carry_messages, template_format="mustache")
        chain = chat_prompt | llm
        if output_parser is not None:
            custom_output_parser = GoGoLLMStructuredOutputParser(runnable=output_parser, question=question)
            chain = chain | custom_output_parser

    chain_with_history = RunnableWithMessageHistory(
        chain,
        lambda sid: memory,
        input_messages_key="question",
        history_messages_key="chat_history"
    )
    return chain_with_history
