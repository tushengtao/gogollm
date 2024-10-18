from backend.app.ggl.langchain.agent.AgentFinalAnswerStreaming import AgentFinalAnswerStreaming
from langchain_core.messages import FunctionMessage


async def llm_with_tool_astream(chains, question, config):
    chains_str = str(chains)
    is_openai_tools_agent = False
    if "agent_scratchpad" in chains_str:
        is_openai_tools_agent = True
    if is_openai_tools_agent:
        # 当一个编排流程chain有多个大模型节点时，需要添加step_count判断 使得最后一个llm节点流式输出
        step_count = len(chains.steps)
        async for event in chains.astream_events(question, config=config, version="v2"):
            kind = event["event"]
            if kind == "on_chat_model_stream":
                tags = event.get("tags", [])
                now_step = 0
                if len(tags) > 0:
                    now_step = int(tags[0].split("seq:step:")[-1])
                if now_step >= step_count:
                    token = event['data']['chunk'].content
                    yield str(token).encode("utf-8")
    else:
        async for chunk in chains.astream(question, config=config):
            if hasattr(chunk, 'content'):
                yield str(chunk.content).encode("utf-8")
            elif 'messages' in chunk:
                for message in chunk.get('messages', []):
                    if isinstance(message, FunctionMessage) is False:
                        yield str(message.content).encode("utf-8")
            else:
                # json格式输出
                if 'chat_history' in chunk:
                    del chunk['chat_history']
                if 'question' in chunk:
                    del chunk['question']
                yield str(chunk).encode("utf-8")


async def app_astream_events(chains, question, config):
    chains_str = str(chains)
    is_openai_tools_agent = False
    if "agent_scratchpad" in chains_str:
        is_openai_tools_agent = True
    if is_openai_tools_agent:
        async for event in chains.astream_events(question, config=config, version="v2"):
                yield str(event).encode("utf-8")
    else:
        async for chunk in chains.astream(question, config=config):
            yield str(chunk).encode("utf-8")


async def react_agent_astream(chains, question, config):
    final_answer_streaming = AgentFinalAnswerStreaming(answer_prefix_tokens=["Final", "Answer", ":"])
    async for event in chains.astream_events(question, config=config, version="v2"):
        kind = event["event"]
        if kind == "on_chat_model_stream":
            token = event['data']['chunk'].content
            async for final_answer_token in final_answer_streaming.on_final_answer_stream(token):
                yield str(final_answer_token).encode("utf-8")
        # if kind == "on_tool_end":
        #     output = event['data']['output']
        #     yield str(output).encode("utf-8")


async def structured_chat_agent_astream(chains, question, config):
    async for chunk in chains.astream(question, config=config):
        if 'output' in chunk:
            yield str(chunk['output']).encode("utf-8")
