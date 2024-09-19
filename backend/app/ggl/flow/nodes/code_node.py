#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import ast
import asyncio
from langchain_core.runnables import RunnableLambda
from backend.app.ggl.flow.code_executor.pbox.executor import execute as execute_code, create_remote_sandbox, \
    async_close_remote_sandbox
from backend.common.exception import errors


def get_code_node(nodeId, flowState):
    return RunnableLambda(code_node).bind(nodeId=nodeId, flowState=flowState)


def extract_json_data_from_result(response, output_variables):
    deal_output_variables = []
    for item in output_variables:
        deal_output_variables.append({item['name']: item['value']})
    extracted_data = {}
    for variable in deal_output_variables:
        parse_key = None
        parse_field = None
        for key, value in variable.items():
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


async def code_node(inputs, **kwargs):
    flowState = kwargs['flowState']
    nodeId = kwargs['nodeId']
    nodeData = flowState["flow_dag"]["nodes_info"][nodeId]["data"]
    question = flowState["question"]
    code = nodeData["code"]
    outputVariables = nodeData['outputVariables']
    inputVariables = nodeData["inputVariables"]
    question = question.replace('\n', '')
    code = f'question="{question}"\n' + code
    params = {}
    for p in inputVariables:
        params[p["name"]] = inputs[p["name"]]

    for variable_name, variable_value in params.items():
        code = f'{variable_name}="{variable_value}"\n' + code

    kernel_id = create_remote_sandbox()
    resp = execute_code(kernel_id, code)
    code_result = {}
    if len(resp['results']) > 0 and resp['results'][0]['data']:
        code_result = ast.literal_eval(resp['results'][0]['data'])

    next_node_data = {}
    if outputVariables:
        next_node_data = extract_json_data_from_result(code_result, outputVariables)
    else:
        next_node_data = ''
        if resp['error']:
            raise errors.RequestError(msg=f'代码解释器执行失败，错误信息：{resp["error"]}')
        else:
            del resp['error']
            del resp['logs']['stderr']
        if len(resp['results']) == 0:
            del resp['results']
            next_node_data = str(resp['logs'])
        else:
            del resp['logs']
            next_node_data = resp['results'][0]

    asyncio.create_task(async_close_remote_sandbox(kernel_id))
    return next_node_data
