#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict
from backend.core.path_conf import BasePath


class GoGoLLMSettings(BaseSettings):
    """GoGoLLM Settings"""

    model_config = SettingsConfigDict(env_file=f'{BasePath}/.env', env_file_encoding='utf-8', extra='ignore')

    # langchain 配置
    LANGCHAIN_DEBUG: bool = False

    REDIS_DATABASE: int = 0

    # llm api proxy config: oneapi
    OPENAI_API_BASE: str
    OPENAI_API_KEY: str

    # baidu qianfan config
    REDIS_BAIDU_API_TOKEN_DATABASE: int
    BAIDU_QIANFAN_API_KEY: str
    BAIDU_QIANFAN_SECRET_KEY: str

    # jina.ai
    JINA_AI_API_KEY: str

    # langfuse config
    LANGFUSE_PUBLIC_KEY: str
    LANGFUSE_SECRET_KEY: str
    LANGFUSE_HOST: str

    # ElasticSearch 配置
    ELASTIC_URL: str
    ELASTIC_USERNAME: str
    ELASTIC_PASSWORD: str

    # aliyun
    ALIBABA_CLOUD_ACCESS_KEY_ID: str
    ALIBABA_CLOUD_ACCESS_KEY_SECRET: str

    # aliyun 百炼
    ALIYUN_BAILIAN_API_KEYS: str

    @property
    def aliyun_bailian_api_keys(self):
        return self.ALIYUN_BAILIAN_API_KEYS.split(',')

    # PandoraBox
    PBOX_EXECUTE_TYPE: str = 'local'
    PBOX_REMOTE_API_KEY: str
    PBOX_REMOTE_URL: str

    DUCKDUCKGO_BASE_URL: str


@lru_cache
def get_ggl_settings() -> GoGoLLMSettings:
    """获取 Ggl 配置"""
    return GoGoLLMSettings()


gogollm_settings = get_ggl_settings()
