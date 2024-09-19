#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from elasticsearch import Elasticsearch

from backend.app.ggl.conf import gogollm_settings

ELASTIC_URL = gogollm_settings.ELASTIC_URL
ELASTIC_USERNAME = gogollm_settings.ELASTIC_USERNAME
ELASTIC_PASSWORD = gogollm_settings.ELASTIC_PASSWORD


def search(query, index_name, field_name, limit):
    dsl = {
        'query': {
            'match': {
                field_name: query
            }
        },
        'size': limit
    }
    es_client = Elasticsearch([ELASTIC_URL], http_auth=(ELASTIC_USERNAME, ELASTIC_PASSWORD), ping_before_connect=False)
    result = es_client.search(index=index_name, body=dsl)
    es_client.close()
    result_list = []
    for hit in result['hits']['hits']:
        code = str(hit['_source'][field_name])
        if 'あ' in code:
            code = code.replace('あ', '/')
        if 'え' in code:
            code = code.replace('え', '-')
        result_list.append({
            "content": code,
            "field_name": field_name,
            "score": hit['_score']
        })
    result_list = unique_by_key(result_list, 'content')
    return result_list


# 以键的值作为标识符进行 去重
def unique_by_key(seq, key):
    seen = set()
    seen_add = seen.add
    return [x for x in seq if x[key] not in seen and not seen_add(x[key])]
