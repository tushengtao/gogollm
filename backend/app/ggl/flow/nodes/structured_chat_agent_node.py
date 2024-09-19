#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.agents import AgentExecutor, create_structured_chat_agent
from backend.app.ggl.conf import gogollm_settings
from backend.app.ggl.flow.tools.all_tools import all_tools
from backend.app.ggl.langchain.llm.ChatModel import ChatModel
from backend.app.ggl.langchain.memory.PostgresChatMessageHistory import PostgresChatMessageHistory
from backend.app.ggl.langchain.memory.RunnableWithMessageHistory import RunnableWithMessageHistory
from backend.database.db_sql import sync_db_session


def get_structured_chat_agent_node(nodeId, flowState):
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
    system = """
Respond to the human as helpfully and accurately as possible. You have access to the following tools:

{tools}

Use a json blob to specify a tool by providing an action key (tool name) and an action_input key (tool input).

Valid "action" values: "Final Answer" or {tool_names}

Provide only ONE action per $JSON_BLOB, as shown:

```
{{
  "action": $TOOL_NAME,
  "action_input": $INPUT
}}
```

Follow this format:

Question: input question to answer
Thought: consider previous and subsequent steps
Action:
```
$JSON_BLOB
```
Observation: action result
... (repeat Thought/Action/Observation N times)
Thought: I know what to respond
Action:
```
{{
  "action": "Final Answer",
  "action_input": "Final response to human"
}}

Begin! Reminder to ALWAYS respond with a valid json blob of a single action. Use tools if necessary. 
Respond directly if appropriate. Format is Action:```$JSON_BLOB```then Observation
"""

    human = """
{question}
        
{agent_scratchpad}
        
(reminder to respond in a JSON blob no matter what)
"""
    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", system),
            MessagesPlaceholder("chat_history", optional=True),
            ("human", human),
        ]
    )

    # prompt = ChatPromptTemplate.from_template(template=agent_prompt, template_format="mustache")
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
        del model_config["model_label"]
        llm = ChatOpenAI(**model_config)
    else:
        llm = ChatModel(model_config).get_llm()
    agent = create_structured_chat_agent(llm=llm, tools=llm_tools, prompt=prompt)
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
        question=question
    )
    agent_executor_with_history = RunnableWithMessageHistory(
        agent_executor,
        lambda session_id: memory,
        input_messages_key="question",
        history_messages_key="chat_history"
    )
    agent_executor = agent_executor_with_history
    return agent_executor
