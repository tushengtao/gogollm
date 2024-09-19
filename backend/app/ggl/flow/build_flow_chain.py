#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
from copy import deepcopy
from langchain_core.runnables import RunnableParallel
from backend.app.ggl.flow import dag_util
from backend.app.ggl.flow.dag_util import draw_graph
from backend.common.exception import errors


# 加载 flowdata json
def load_flow_data_json(json_data):
    return json.loads(json_data)


def adapter_parallel_chain(parallel_input):
    parallel_input_keys = list(parallel_input.keys())
    merged_dict = parallel_input[parallel_input_keys[0]].copy()
    for key in parallel_input_keys:
        merged_dict.update(parallel_input[key])
    return merged_dict


def build_chains(parallel_execution_nodes, flowState, AllNodesDict):
    chains = None
    flow_dag = flowState["flow_dag"]
    current_index = -1
    for group in parallel_execution_nodes:
        current_index += 1
        if len(group) == 0:
            continue
        elif len(group) == 1:
            # 说明是 单节点 没有并行节点
            nodeId = group[0]
            node_type = flow_dag["nodes_info"][nodeId]["type"]
            if chains is None:
                # 第一个 chain 链入口
                chains = AllNodesDict[node_type](nodeId=nodeId, flowState=flowState)
            else:
                if node_type == "BranchNode":
                    nowchain = AllNodesDict[node_type](nodeId=nodeId,
                                                       flowState=flowState,
                                                       current_index=current_index,
                                                       AllNodesDict=AllNodesDict)
                    chains = chains | nowchain
                    break
                else:
                    nowchain = AllNodesDict[node_type](nodeId=nodeId, flowState=flowState)
                    chains = chains | nowchain
        else:
            parallelToolDict = {}
            for nodeId in group:
                node_type = flow_dag["nodes_info"][nodeId]["type"]
                if node_type == "BranchNode":
                    raise errors.ServerError(msg="编排错误，分支节点不与其他节点有共同前驱/分支节点不与其他节点并行")
                else:
                    parallelToolDict[nodeId] = AllNodesDict[node_type](nodeId=nodeId, flowState=flowState)
            parallel_chain = RunnableParallel(parallelToolDict)
            chains = chains | parallel_chain | adapter_parallel_chain
    return chains


def get_all_successors(nodes_info, node_id):
    # 获取当前节点的直接后继
    direct_successors = nodes_info.get(node_id, {}).get('successors', [])
    # 递归获取所有后继节点
    all_successors = set(direct_successors)
    for successor in direct_successors:
        all_successors.update(get_all_successors(nodes_info, successor))
    return all_successors


def deal_parallel_execution_nodes(flow_dag, parallel_execution_nodes, sorted_zero_in_degree_nodes, roots):
    deal_node_array = deepcopy(sorted_zero_in_degree_nodes)
    deal_node_array.remove(roots[0])
    for node in deal_node_array:
        # 获取此入度为0的node的所有后继
        node_successors = flow_dag["nodes_info"][node]["successors"]
        sibling_node = ''  # node 的兄弟姐妹 节点
        for successor in node_successors:
            # 获取这个后继节点的前驱node：
            node_predecessors = flow_dag["nodes_info"][successor]["predecessors"]
            for pre in node_predecessors:
                if pre != node:
                    sibling_node = pre
                    break
            break
        # predecessor 遍历 parallel_execution_nodes
        for index, sublist in enumerate(parallel_execution_nodes):
            if sibling_node in sublist:
                # 添加到并行列表
                parallel_execution_nodes[index].append(node)
                break
        parallel_execution_nodes[0].remove(node)


def executable_flow_info(flow_data):
    # ------------------------  1 解析node执行顺序 -----------------------
    # 1. 构建图
    flow_dag_edges = dag_util.build_flow_dag_edges(flow_data['edges'])
    # 2.执行拓扑排序
    graph, in_degrees = dag_util.get_graph_indegrees(flow_data)
    zero_in_degree_nodes = dag_util.get_zero_in_degree_nodes(in_degrees)
    flow_dag = dag_util.build_flow_dag(graph, zero_in_degree_nodes)
    # draw_graph(flow_dag)
    flow_dag['edges_info'] = flow_data['edges']
    # 3. 获取排序后的入度为0的节点 列表
    sorted_zero_in_degree_nodes = dag_util.sort_zero_in_degree_nodes(graph, zero_in_degree_nodes)
    # 4. 获取根节点 无论什么节点他的入口都是 问题入口节点，仅有一个入口节点
    roots = dag_util.get_root_node(flow_dag)
    # 5. 入度为0 节点从 parallel_execution_groups[0] 移除 ，并且加入到 后续的兄弟姐妹并行列表里
    parallel_execution_nodes = dag_util.find_parallel_nodes(flow_dag_edges)
    if parallel_execution_nodes[0][0] in sorted_zero_in_degree_nodes and len(roots) == 1 and roots[0] \
            in sorted_zero_in_degree_nodes:
        deal_parallel_execution_nodes(flow_dag, parallel_execution_nodes, sorted_zero_in_degree_nodes, roots)
    else:
        raise Exception("flow_dag校验失败")
    return flow_dag, parallel_execution_nodes
