#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from langchain_core.runnables import RunnableLambda
from backend.app.ggl.flow.build_flow_chain import get_all_successors, build_chains


def get_branch_node(nodeId, flowState, current_index, AllNodesDict):
    return RunnableLambda(branch_node).bind(nodeId=nodeId,
                                            flowState=flowState,
                                            current_index=current_index,
                                            AllNodesDict=AllNodesDict)


# 分支节点
def branch_node(inputs, **kwargs):
    nodeId = kwargs["nodeId"]
    AllNodesDict = kwargs["AllNodesDict"]
    flowState = kwargs["flowState"]
    flow_dag = flowState["flow_dag"]
    parallel_execution_nodes = flowState["parallel_execution_nodes"]
    current_index = kwargs["current_index"]
    nodeData = flow_dag["nodes_info"][nodeId]["data"]
    conditions = nodeData["conditions"]
    target_node_id = None
    condition_met = False
    for condition in conditions:
        variables = condition.get('variables', [])
        source_handle_id = condition['id']
        all_variables_met = False
        for variable in variables:
            var_name = variable.get('varName')
            operator = variable.get('operator')
            value = variable.get('value')
            input_value = inputs.get(var_name)
            if operator == 'equals' and input_value == value:
                all_variables_met = True
            elif operator == 'contains' and value.lower() in input_value.lower():
                all_variables_met = True
            elif operator == 'lengthEquals' and len(input_value) == int(value):
                all_variables_met = True
            else:
                all_variables_met = False
            if not all_variables_met:
                #  一个条件内的所有变量都成立此条件才成立，否则不成立 ，停止此条件下的其他变量判断
                break

        if all_variables_met:
            condition_met = True
            for item in flow_dag["edges_info"]:
                if item["sourceHandle"] == source_handle_id:
                    target_node_id = item["target"]
            break
    if not condition_met:
        # TODO 界面配置 结束 或者 其他不匹配所有条件的chain链路
        return {"result": "All condition not met"}, 400
    else:
        next_index = current_index + 1
        parallel_execution_nodes[next_index] = [target_node_id]
        new_parallel_execution_nodes = parallel_execution_nodes[next_index:]
        all_successors = get_all_successors(flow_dag["nodes_info"], target_node_id)
        all_successors_parallel_execution_nodes = []
        if len(all_successors) > 0:
            for item in new_parallel_execution_nodes:
                temp = []
                for i in item:
                    if i in all_successors:
                        temp.append(i)
                all_successors_parallel_execution_nodes.append(temp)
        if len(all_successors_parallel_execution_nodes) == 0:
            all_successors_parallel_execution_nodes = new_parallel_execution_nodes
        return build_chains(all_successors_parallel_execution_nodes, flowState, AllNodesDict)
