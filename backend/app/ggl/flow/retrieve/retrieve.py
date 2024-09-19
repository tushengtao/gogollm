#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from backend.app.ggl.conf import gogollm_settings
from backend.app.ggl.flow.embedding.EmbeddingClient import EmbeddingClient
from backend.app.ggl.flow.retrieve.utils import contains_chinese, filter_array_by_substring
from backend.app.ggl.flow.retrieve.vector_retrieve import search as vector_search
from backend.app.ggl.flow.retrieve.reranker.reranker_ali_gte import reranker as reranker_ali_gte
from backend.app.ggl.flow.retrieve.reranker.reranker_jinai import reranker as reranker_jinai

from backend.app.ggl.flow.retrieve.es_retrieve import search as es_search


def vector_retrieve(options, retrieval_method):
    result_json_list = perform_search(options, retrieval_method)
    # 处理reranker逻辑
    if "+reranker" in retrieval_method and result_json_list:
        query = options['content']
        documents = [item['content'] for item in result_json_list]

        # TODO FIXME 删除 不适用于通用场景 ：如果query不包含中文 ，使用子串进行过滤： 如果向量匹配到的数据项不是query的子串 就直接过滤掉
        if not contains_chinese(query):
            documents = filter_array_by_substring(query, documents)

        reranked_results = rerank(query, documents, result_json_list)

        if reranked_results:
            result_json_list = reranked_results

    data = result_json_list[:options['retrieval_count']]
    return {
        "data": data,
        "field_name": options['field_name']
    }


def perform_search(options, retrieval_method):
    result_json_list = []
    if "vector" in retrieval_method:
        retrieve_vector = get_embedding(options['content'])
        result_json_list = vector_search(options['select_table'], retrieve_vector, 100, options['field_name'])
    elif "es" in retrieval_method:
        result_json_list = es_search(options['content'], options['elasticsearch_index_name'], options['field_name'],
                                     100)
    else:
        raise ValueError(f"Invalid retrieval method: {retrieval_method}")
    return result_json_list


def rerank(query, documents, result_json_list):
    reranker_list = []
    top_n = len(documents)
    if top_n > 0:
        if contains_chinese(query):
            reranker_list = reranker_ali_gte(query, documents, top_n)
        else:
            # 纯英文 reranker_jinai 目前 reranker_jinai 测试下来不稳定
            reranker_list = reranker_ali_gte(query, documents, top_n)

    reranked_results = []
    if reranker_list:
        for item in reranker_list:
            reranked_results.append({
                "content": item['document'],
                "field_name": result_json_list[0]['field_name'],
                "score": item['relevance_score']
            })
    return reranked_results


def get_embedding(text):
    OPENAI_API_BASE = gogollm_settings.OPENAI_API_BASE
    OPENAI_API_KEY = gogollm_settings.OPENAI_API_KEY
    # TODO model 应该前端配置 在数据集时设置
    embedding_client = EmbeddingClient(api_key=OPENAI_API_KEY, api_url=OPENAI_API_BASE + "/embeddings",
                                       model="text-embedding-v2")
    r = embedding_client.embed_query(text=text)
    return r
