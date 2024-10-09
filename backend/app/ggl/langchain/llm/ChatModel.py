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
        # 确保api_keys是一个列表，如果只有一个key或者为空，将其转换成单元素列表
        self.api_keys = api_keys if isinstance(api_keys, list) and api_keys else [api_keys]
        self.current_index = 0

    def get_next_key(self):
        # 检查是否有可用的key
        if not self.api_keys:
            raise ValueError("No API keys available")
        key = self.api_keys[self.current_index]
        # 更新索引，确保循环使用key
        self.current_index = (self.current_index + 1) % len(self.api_keys)
        return key


# 根据环境变量名称获取并轮询API key
def get_api_key_rotator(env_var_name):
    api_keys_str = os.getenv(env_var_name)
    # 如果api_keys_str为空或者没有逗号分隔，则将其转换为单元素列表
    api_keys = api_keys_str.split(',') if api_keys_str and ',' in api_keys_str else [api_keys_str]
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
