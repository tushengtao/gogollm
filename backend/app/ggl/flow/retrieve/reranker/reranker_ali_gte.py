#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import requests
from backend.app.ggl.conf import gogollm_settings

ALI_BAILIAN_RERANKER_URL = 'https://dashscope.aliyuncs.com/api/v1/services/rerank/text-rerank/text-rerank'
# 轮询API KEY 列表
API_KEYS = gogollm_settings.aliyun_bailian_api_keys
current_aliyun_bailian_api_key_index = 0


def get_next_api_key():
    """返回下一个可用的API密钥，并循环使用"""
    global current_aliyun_bailian_api_key_index
    key = API_KEYS[current_aliyun_bailian_api_key_index]
    current_aliyun_bailian_api_key_index = (current_aliyun_bailian_api_key_index + 1) % len(API_KEYS)
    return key


def reranker(query, documents, top_n=5):
    headers = {
        'Authorization': f'Bearer {get_next_api_key()}',
        'Content-Type': 'application/json'
    }
    top_n = min(top_n, 500)
    data = {
        "model": "gte-rerank",
        "input": {
            "query": query,
            "documents": documents
        },
        "parameters": {
            "return_documents": True,
            "top_n": top_n
        }
    }

    response = requests.post(ALI_BAILIAN_RERANKER_URL, headers=headers, json=data)
    if response.status_code == 200:
        results = response.json()
        reranker_list = results['output']['results']
        for item in reranker_list:
            item['document'] = item['document']['text']
        return reranker_list
    else:
        raise Exception(f"Reranker ALI API request failed with status code {response.status_code}: {response.text}")
