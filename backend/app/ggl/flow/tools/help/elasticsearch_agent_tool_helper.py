#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import re
import json
import threading
from typing import Any
from elasticsearch import Elasticsearch
from elasticsearch.exceptions import ElasticsearchException
from backend.app.ggl.conf import gogollm_settings
from backend.common.log import log
from backend.app.ggl.flow.code_executor.pbox.executor import execute as execute_code, create_remote_sandbox, \
    close_remote_sandbox

ELASTIC_URL = gogollm_settings.ELASTIC_URL
ELASTIC_USERNAME = gogollm_settings.ELASTIC_USERNAME
ELASTIC_PASSWORD = gogollm_settings.ELASTIC_PASSWORD


def es_search_result_deal(es_search_result, code):
    thread_local = threading.local()

    def set_code_exec_result(result):
        # result 应该是一个list
        thread_local.result = {"result": result}

    # 将variables中的键值对添加到局部命名空间中
    locals().update({"es_search_result": es_search_result})
    locals().update({'set_code_exec_result': set_code_exec_result})
    exec(code)
    return thread_local.result


def genertate_field_dsl_deal(code, variables):
    thread_local = threading.local()

    # 必须在 code自定义编写代码调用 set_code_exec_result(main(), field_name) ，mainx()返回处理结果
    def set_code_exec_result(result, field_name):
        # result 应该是一个list
        thread_local.result = {"result": result, "field_name": field_name}

    # 将variables中的键值对添加到局部命名空间中
    locals().update(variables)
    locals().update({'set_code_exec_result': set_code_exec_result})
    exec(code)
    return thread_local.result


def retrieval_field_custom_remote_deal(question, field_item):
    # 将 question 传入执行的自定义代码
    kernel_id = create_remote_sandbox()
    code = f'question="{question}"\n' + field_item['code']
    field_name = field_item['name']
    code = f'field_name="{field_name}"\n' + code
    result = execute_code(kernel_id, code)

    threading.Thread(target=close_remote_sandbox, args=(kernel_id,)).start()

    log.info(f"SearchElasticSearchTool 关键词抽取-{field_name}:" + result['results'][0]['data'])
    return field_name, result['results'][0]['data']


def retrieval_field_custom_local_deal(code, variables):
    thread_local = threading.local()

    # 必须在 code自定义编写代码调用 set_code_exec_result(main(), field_name) ，mainx()返回处理结果
    def set_code_exec_result(result, field_name):
        thread_local.result = {"result": result, "field_name": field_name}

    # 将variables中的键值对添加到局部命名空间中
    locals().update(variables)
    locals().update({'set_code_exec_result': set_code_exec_result})
    exec(code)
    return thread_local.result


def extract_json_str(input_string):
    pattern = r"```json\n(.*?)```"
    matches = re.search(pattern, input_string, re.DOTALL)
    if matches:
        return matches.group(1)
    else:
        return '{}'


def es_search(index_name, query, size=3) -> list[Any]:
    if "SELECT" in query or "select" in query:
        query = sql_to_dsl_string(query)
    if check_size_in_dsl(query, size):
        return es_dsl_search(index_name, query)
    else:
        raise Exception("check_size_in_es_dsl_string Exception: " + query)


def sql_to_dsl_string(sql) -> str:
    es_client = Elasticsearch([ELASTIC_URL], http_auth=(ELASTIC_USERNAME, ELASTIC_PASSWORD),
                              ping_before_connect=False)
    body = {
        "query": sql
    }
    response = es_client.sql.translate(body=body)
    dsl = json.dumps(response, ensure_ascii=False)
    return dsl


def es_dsl_search(index_name, dsl) -> list[Any]:
    try:
        es_client = Elasticsearch([ELASTIC_URL], http_auth=(ELASTIC_USERNAME, ELASTIC_PASSWORD),
                                  ping_before_connect=False)
        search_result = es_client.search(index=index_name, body=dsl)
        result = []
        for hit in search_result['hits']['hits']:
            hit['_source']['_id'] = hit['_id']
            result.append(hit['_source'])
        return result
    except ElasticsearchException as e:
        raise Exception("es_dsl_search Exception") from e


def check_size_in_dsl(dsl, size_to_check):
    """
    检查ES DSL字符串中是否包含特定的size值。
    :param dsl_string: ES DSL的字符串
    :param size_to_check: 需要检查的size值，默认为3
    :return: 如果找到返回True，否则返回False
    """
    try:
        if type(dsl) is str:
            dsl_dict = json.loads(dsl)
        else:
            dsl_dict = dsl
        return check_size_in_dsl_dict(dsl_dict, size_to_check)
    except json.JSONDecodeError:
        log.exception("提供的字符串不是有效的es查询JSON" + dsl)
        return False


def check_size_in_dsl_dict(dsl, size_to_check) -> bool:
    """
    递归检查ES DSL中是否包含特定的size值。
    :param dsl: ES DSL的字典
    :param size_to_check: 需要检查的size值，默认为3
    :return: 如果找到返回True，否则返回False
    """
    if isinstance(dsl, dict):
        for key, value in dsl.items():
            if key == 'size' and value == size_to_check:
                return True
    return False


def strip_quotes(input_str):
    # 检查字符串是否以单引号开头和结尾
    if input_str.startswith("'") and input_str.endswith("'"):
        # 去除字符串开头和结尾的单引号
        return input_str[1:-1]
    else:
        return input_str
