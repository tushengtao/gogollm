import os
from dotenv import load_dotenv
from langchain_core.language_models import BaseChatModel
from langchain_groq import ChatGroq
from langchain_community.chat_models import MiniMaxChat, ChatZhipuAI
from langchain_community.chat_models.tongyi import ChatTongyi
from langchain_community.chat_models.yi import ChatYi
from langchain_openai import ChatOpenAI

load_dotenv()


class APIKeyRotator:
    def __init__(self, api_keys):
        self.api_keys = api_keys
        self.current_index = 0

    def get_next_key(self):
        key = self.api_keys[self.current_index]
        self.current_index = (self.current_index + 1) % len(self.api_keys)
        return key


# 定义一个函数，根据环境变量名称获取并轮询API key
def get_api_key_rotator(env_var_name):
    api_keys_str = os.getenv(env_var_name)
    api_keys = api_keys_str.split(',') if api_keys_str else []
    return APIKeyRotator(api_keys)


# 定义一个字典，存储不同环境变量名称对应的APIKeyRotator实例
api_key_rotators = {
    "OPENAI_API_KEY": get_api_key_rotator("OPENAI_API_KEY"),
    "GROQ_API_KEY": get_api_key_rotator("GROQ_API_KEY"),
    "DEEPSEEK_API_KEY": get_api_key_rotator("DEEPSEEK_API_KEY"),
    "MINIMAX_API_KEY": get_api_key_rotator("MINIMAX_API_KEY"),
    "DASHSCOPE_API_KEY": get_api_key_rotator("DASHSCOPE_API_KEY"),
    "YI_API_KEY": get_api_key_rotator("YI_API_KEY"),
    "ZHIPUAI_API_KEY": get_api_key_rotator("ZHIPUAI_API_KEY")
}


class ChatModel:
    def __init__(self, model_config: dict):
        self.model_config = model_config

    def get_llm(self) -> BaseChatModel:
        conifg = self.model_config
        model = conifg['model_name']
        temperature = conifg['temperature']
        streaming = conifg['streaming']
        # top_p = conifg['top_p']
        model_label = conifg['model_label']
        model_provider = model_label.split('-')[0]
        if model_provider == "Groq":
            # NOTE： groq api does not support streaming with tools yet
            base_url = os.getenv("GROQ_API_BASE")
            api_key = api_key_rotators["GROQ_API_KEY"].get_next_key()
            return ChatGroq(model=model, temperature=temperature, streaming=streaming, api_key=api_key,
                            groq_api_base=base_url)
        elif model_provider == "Deepseek":
            del conifg['model_label']
            api_key = api_key_rotators["DEEPSEEK_API_KEY"].get_next_key()
            api_base = 'https://api.deepseek.com'
            return ChatOpenAI(model=model, temperature=temperature, streaming=streaming,
                              openai_api_base=api_base, openai_api_key=api_key)
        elif model_provider == "MiniMax":
            model_max_tokens = {
                "abab6.5t": 8192,
                "abab6.5g": 8192,
                "abab5.5s": 8192,
                "abab6.5s": 245760,
                "abab5.5": 16384
            }
            max_tokens = model_max_tokens[model]
            api_key = api_key_rotators["MINIMAX_API_KEY"].get_next_key()
            return MiniMaxChat(model=model, temperature=temperature, streaming=streaming, api_key=api_key,
                               max_tokens=max_tokens)
        elif model_provider == "Tongyi":
            api_key = api_key_rotators["DASHSCOPE_API_KEY"].get_next_key()
            return ChatTongyi(model=model, temperature=temperature, streaming=streaming, api_key=api_key)
        elif model_provider == "Yi":
            api_key = api_key_rotators["YI_API_KEY"].get_next_key()
            return ChatYi(model=model, temperature=temperature, streaming=streaming, api_key=api_key, top_p=0.9)
        elif model_provider == "Zhipu":
            api_key = api_key_rotators["ZHIPUAI_API_KEY"].get_next_key()
            return ChatZhipuAI(model=model, temperature=temperature, streaming=streaming, api_key=api_key)
        else:
            conifg['api_key'] = api_key_rotators["OPENAI_API_KEY"].get_next_key()
            del conifg['model_label']
            return ChatOpenAI(**conifg)
