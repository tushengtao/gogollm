from typing import Any

from langchain_core.agents import AgentFinish
from langchain_core.callbacks import StreamingStdOutCallbackHandler


class CallbackHandlerStreaming(StreamingStdOutCallbackHandler):
    """
    Callback handler for streaming output to the user interface using Streamlit.
    """

    def __init__(self):
        self.content: str = ""

    def on_llm_new_token(self, token: str, **kwargs: any) -> None:
        # runs for every token generated by the LLM
        if token:
            self.content += token
    def on_agent_finish(self, finish: AgentFinish, **kwargs: Any) -> Any:
        """Run on agent end."""
        if self.content:
            self.content = ""
