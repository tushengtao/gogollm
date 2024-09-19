#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from collections import defaultdict
import networkx
import matplotlib.pyplot as plt
from collections import deque


def get_graph_indegrees(flow_data):
    graph = {}
    in_degrees = {}
    for node in flow_data['nodes']:
        node_id = node['id']
        graph[node_id] = {'predecessors': [], 'successors': [], 'data': node}
        in_degrees[node_id] = 0
    for edge in flow_data['edges']:
        source = edge['source']
        target = edge['target']
        graph[source]['successors'].append(target)
        graph[target]['predecessors'].append(source)
        in_degrees[target] += 1
    return graph, in_degrees


def build_flow_dag(graph, zero_in_degree_nodes):
    """构建最终的dag"""
    result = {
        'zero_in_degree_nodes': zero_in_degree_nodes,
        'nodes_info': {}
    }
    for node_id in graph:
        predecessors = list(dict.fromkeys(graph[node_id]['predecessors']))
        successors = list(dict.fromkeys(graph[node_id]['successors']))
        result['nodes_info'][node_id] = {
            'predecessors': predecessors,
            'successors': successors,
            'data': graph[node_id]['data']['data'],
            'type': graph[node_id]['data']['type']
        }
    return result


def is_valid_dag(dag_dict):
    """判断是否为有效的有向无环图(DAG)"""
    G = networkx.DiGraph()
    for node, info in dag_dict["nodes_info"].items():
        G.add_node(node)
        for succ in info["successors"]:
            G.add_edge(node, succ)
    return networkx.is_directed_acyclic_graph(G)


def draw_graph(result):
    """绘制图形表示"""
    G = networkx.DiGraph()
    for node, info in result["nodes_info"].items():
        G.add_node(node)
        for succ in info["successors"]:
            G.add_edge(node, succ)
    pos = networkx.spring_layout(G)  # 为所有节点计算位置
    networkx.draw(G, pos, with_labels=True, node_color='lightblue', node_size=3000, font_size=10, font_weight='bold',
                  arrowstyle='->', arrowsize=20)
    plt.show()


def bfs(graph, start_node):
    """广度优先搜索，返回从start_node开始的后续链长度"""
    visited = set()
    queue = [(start_node, 0)]
    max_depth = 0
    while queue:
        node, depth = queue.pop(0)
        if node not in visited:
            visited.add(node)
            max_depth = max(max_depth, depth)
            for next_node in graph[node]['successors']:
                queue.append((next_node, depth + 1))
    return max_depth


def sort_zero_in_degree_nodes(graph, zero_in_degree_nodes):
    """根据后续链长度 对入度为0的节点进行排序,按其后续链长度从大到小排序"""
    node_chain_length = [(node, bfs(graph, node)) for node in zero_in_degree_nodes]
    node_chain_length.sort(key=lambda x: x[1])
    nodes = [node for node, _ in node_chain_length]
    nodes.reverse()
    return nodes


def get_zero_in_degree_nodes(in_degrees):
    """获取入度为0的节点"""
    zero_in_degree_nodes = []
    for node_id, in_degree in in_degrees.items():
        if in_degree == 0:
            zero_in_degree_nodes.append(node_id)
    return zero_in_degree_nodes


def get_root_node(flow_dag):
    """获取所有根节点，即入度为0的节点"""
    zero_in_degree_nodes = flow_dag['zero_in_degree_nodes']
    roots = []
    """获取图的根节点"""
    for node in zero_in_degree_nodes:
        successors = flow_dag['nodes_info'][node]['successors']
        for successor in successors:
            if len(flow_dag['nodes_info'][successor]['predecessors']) == 1:
                roots.append(node)
    return roots


# 深度优先搜索
def dfs(node, graph, visited, sequence):
    if node not in visited:
        visited.add(node)
        for neighbor in graph[node]:
            dfs(neighbor, graph, visited, sequence)
        sequence.append(node)


# 拓扑排序
def topological_sort(graph):
    visited = set()
    sequence = []
    nodes = list(graph.keys())  # 将图的节点转换为列表以避免迭代时修改图
    for node in nodes:
        if node not in visited:
            dfs(node, graph, visited, sequence)
    return sequence[::-1]  # 逆转序列以得到正确的执行顺序


# 可并行 的node
def find_parallel_nodes(graph):
    topological_sort(graph)
    in_degree = {node: 0 for node in graph}  # 初始化每个节点的入度
    for node in graph:
        for neighbor in graph[node]:
            in_degree[neighbor] += 1
    queue = deque([node for node in in_degree if in_degree[node] == 0])  # 所有入度为0的节点可以立即执行
    parallel_nodes = []
    while queue:
        current_level = []
        for _ in range(len(queue)):
            node = queue.popleft()
            current_level.append(node)
            for neighbor in graph[node]:
                in_degree[neighbor] -= 1
                if in_degree[neighbor] == 0:
                    queue.append(neighbor)
        parallel_nodes.append(current_level)
    return parallel_nodes


def build_flow_dag_edges(edges):
    graph = defaultdict(list)
    for edge in edges:
        graph[edge['source']].append(edge['target'])
    return graph
