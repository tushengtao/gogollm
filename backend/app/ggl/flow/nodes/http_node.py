#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import re
import aiohttp
import hashlib
import aioredis
from langchain_core.runnables import RunnableLambda
from backend.app.ggl.conf import gogollm_settings
from backend.core.conf import settings

REDIS_URL = f"redis://:{settings.REDIS_PASSWORD}@{settings.REDIS_HOST}:{settings.REDIS_PORT}/{gogollm_settings.REDIS_DATABASE}"


def get_http_node(nodeId, flowState):
    nodeData = flowState["flow_dag"]["nodes_info"][nodeId]["data"]
    return RunnableLambda(http_node).bind(nodeData=nodeData)


def extract_data_from_response(response, output_variables):
    deal_output_variables = []
    for item in output_variables:
        deal_output_variables.append({item['name']: item['value']})
    extracted_data = {}
    for variable in deal_output_variables:
        parse_key = None
        parse_field = None
        # 遍历variable字典
        for key, value in variable.items():
            # 取出需要解析的字段
            parse_key = key
            parse_field = value
            break
        if parse_field:
            keys = parse_field.split('.')
            value = response
            # keys: such as data.url  :['data','url']
            for key in keys:
                if isinstance(value, dict) and key in value:
                    value = value[key]
                else:
                    value = None
                    break
            extracted_data[parse_key] = value
    return extracted_data


def format_url_with_dynamic_vars(base_url, inputVariables):
    dynamic_vars = re.findall(r'{{(.*?)}}', base_url)
    # 将 URL 中的 {{ 和 }} 替换为 {}
    base_url = base_url.replace('{{', '{').replace('}}', '}')
    # 使用 format_map 方法替换 URL 中的动态变量
    format_map_var = {}
    for var_name in dynamic_vars:
        for input_var in inputVariables:
            if var_name == input_var['name']:
                format_map_var[var_name] = input_var['value']
    base_url = base_url.format_map(format_map_var)
    return base_url


def parse_get_method_params(requestParams, inputVariables):
    for key, value in requestParams.items():
        if value.startswith('{{') and value.endswith('}}'):
            dynamic_vars = re.findall(r'{{(.*?)}}', value)
            for var in dynamic_vars:
                for input_var in inputVariables:
                    var_name = input_var['name']
                    if var == var_name:
                        requestParams[key] = input_var['value']


def parse_post_method_body_json(json_data, parent_key='', deal_keys_dict={}, inputVariables={}):
    if isinstance(json_data, dict):
        for key, value in json_data.items():
            new_key = f"{parent_key}.{key}" if parent_key else key
            parse_post_method_body_json(json_data=value, parent_key=new_key, deal_keys_dict=deal_keys_dict,
                                        inputVariables=inputVariables)
    elif isinstance(json_data, list):
        for index, item in enumerate(json_data):
            new_key = f"{parent_key}[{index}]"
            parse_post_method_body_json(json_data=item, parent_key=new_key, deal_keys_dict=deal_keys_dict,
                                        inputVariables=inputVariables)
    else:
        if isinstance(json_data, str):
            if json_data.startswith('{{') and json_data.endswith('}}'):
                dynamic_vars = re.findall(r'{{(.*?)}}', json_data)
                for var in dynamic_vars:
                    for input_var in inputVariables:
                        if input_var['name'] == var:
                            target_replace_value = input_var['value']
                            deal_keys_dict[parent_key] = target_replace_value


def replace_values_in_post_method_body_json(json_data, deal_keys_dict):
    if isinstance(json_data, dict):
        for key, value in json_data.items():
            if isinstance(value, (dict, list)):
                replace_values_in_post_method_body_json(value, deal_keys_dict)
            elif isinstance(value, str) and value.startswith('{{') and value.endswith('}}'):
                full_key = f"{key}"
                if full_key in deal_keys_dict:
                    json_data[key] = deal_keys_dict[full_key]
                else:
                    for deal_key, deal_value in deal_keys_dict.items():
                        if deal_key.endswith(full_key):
                            json_data[key] = deal_value
                            break
    elif isinstance(json_data, list):
        for index, item in enumerate(json_data):
            if isinstance(item, (dict, list)):
                replace_values_in_post_method_body_json(item, deal_keys_dict)
            elif isinstance(item, str) and item.startswith('{{') and item.endswith('}}'):
                full_key = f"[{index}]"
                if full_key in deal_keys_dict:
                    json_data[index] = deal_keys_dict[full_key]
                else:
                    for deal_key, deal_value in deal_keys_dict.items():
                        if deal_key.endswith(full_key):
                            json_data[index] = deal_value
                            break


async def http_node(inputs, **kwargs):
    nodeData = kwargs['nodeData']
    method = nodeData["method"]
    base_url = nodeData["base_url"]
    outputVariables = nodeData['outputVariables']
    inputVariables = nodeData["inputVariables"]
    headers = {}
    requestParams = ""
    if nodeData["headers"] != "":
        headers = json.loads(nodeData["headers"])
    requestParams = nodeData["requestParams"]
    if nodeData["requestParams"] != "":
        requestParams = json.loads(nodeData["requestParams"])
    question = inputs["question"]
    for input_var in inputVariables:
        if input_var['value'] == "":
            input_var['value'] = inputs[input_var['name']]

    base_url = format_url_with_dynamic_vars(base_url, inputVariables)

    #  get、post方法 解析处理参数
    if requestParams != "":
        if method == 'GET':
            parse_get_method_params(requestParams, inputVariables)
        else:
            requestParams_copy = requestParams.copy()
            deal_keys_dict = {}
            parse_post_method_body_json(json_data=requestParams_copy, parent_key='', deal_keys_dict=deal_keys_dict,
                                        inputVariables=inputVariables)
            replace_values_in_post_method_body_json(requestParams, deal_keys_dict)
    else:
        requestParams={}

    # 保存http响应结果
    result = {}
    # 缓存
    md5_cache_key = hashlib.md5(base_url.encode("utf-8") + json.dumps(requestParams).encode("utf-8")).hexdigest()
    # 前缀
    md5_cache_key = "gogollm_node_http_" + md5_cache_key
    redis = await aioredis.from_url(REDIS_URL, encoding="utf-8", decode_responses=True)
    async with redis.client() as conn:
        exist = await conn.get(md5_cache_key)
        if exist:
            result = json.loads(exist)
        else:
            if method == 'GET':
                async with aiohttp.ClientSession() as session:
                    async with session.get(base_url, params=requestParams, timeout=100, headers=headers) as resp:
                        result = await resp.json()
                        async with redis.client() as conn:
                            await conn.set(md5_cache_key, json.dumps(result, ensure_ascii=False), 3600)

            elif method == 'POST':
                async with aiohttp.ClientSession() as session:
                    async with session.post(base_url, data=requestParams, timeout=100, headers=headers) as resp:
                        result = await resp.json()
                        async with redis.client() as conn:
                            await conn.set(md5_cache_key, json.dumps(result, ensure_ascii=False), 3600)
            else:
                raise ValueError("method must be GET or POST")
    next_node_data = None
    if outputVariables:
        next_node_data = extract_data_from_response(result, outputVariables)
    # 历史消息
    # next_node_data["chat_history"] = inputs["chat_history"]
    next_node_data["question"] = question
    return next_node_data
