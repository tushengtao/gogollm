#!/usr/bin/env python3
# -*- coding: utf-8 -*-
def set_input_variables_value(nodeId, flowState, value):
    flow_dag = flowState["flow_dag"]
    targetHandleList = []
    for edge in flow_dag["edges_info"]:
        if edge["source"] == nodeId:
            targetHandleList.append(edge["targetHandle"])
    # 获取 此nodeId 节点的 所有后继节点
    successorList = flow_dag["nodes_info"][nodeId]["successors"]
    for successor in successorList:
        variable_list = flow_dag["nodes_info"][successor]["data"].get("inputVariables", [])
        for variable in variable_list:
            if variable["id"] in targetHandleList:
                variable["value"] = value

