#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import requests
from backend.app.ggl.conf import gogollm_settings


def reranker(query, documents, top_n):
    api_key = gogollm_settings.JINA_AI_API_KEY
    url = f"https://api.jina.ai/v1/rerank"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer " + api_key
    }
    top_n = min(top_n, 1024)
    data = {
        "model": "jina-reranker-v1-base-en",
        "query": query,
        "documents": documents,
        "top_n": top_n
    }
    response = requests.post(url, headers=headers, json=data)
    results = response.json()
    reranker_list = results['results']
    for item in reranker_list:
        item['document'] = item['document']['text']
    return reranker_list
