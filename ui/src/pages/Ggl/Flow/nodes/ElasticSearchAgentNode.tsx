import React, {useEffect, useState} from 'react';
import {Handle, Position, useFlowEditor} from '@ant-design/pro-flow';
import NodeBodyCard from '@/pages/Ggl/Flow/components/NodeBodyCard';
import {ElasticSearchAgentNodeForm} from '@/pages/Ggl/Flow/nodes/nodeForm/ElasticSearchAgentNodeForm';
import logo from '@/assets/imgs/ElasticSearch.png';
import {uuid} from '@ant-design/pro-flow/es/FlowEditor/utils/uuid';

export const ElasticSearchAgentNode: React.FC = (node: any) => {
    const editor = useFlowEditor();
    const {id, data} = node;
    const initNodeData = data;
    const [nodeData, setNodeData] = useState(() => {
        const agent_prompt = initNodeData.agent_prompt || '';
        const search_tool_description = initNodeData.search_tool_description || '';
        const max_tokens = initNodeData.max_tokens || 4096; // TODO form里添加
        const agent_temperature = initNodeData.agent_temperature || 0.9;
        const tool_temperature = initNodeData.tool_temperature || 0.7;
        const top_p = initNodeData.top_p || 0.7; // TODO form里添加
        const inputVariables = initNodeData.inputVariables || [
            {id: uuid(), name: 'question', value: ''},
        ];
        const structured_retrieval_table_name =
            initNodeData.structured_retrieval_table_name || '';
        const elasticsearch_index_name =
            initNodeData.elasticsearch_index_name || '';
        const structuredFieldRetrievalConfig =
            initNodeData.structuredFieldRetrievalConfig || [];
        const outputVariables = initNodeData.outputVariables || [];
        const nodeName = initNodeData.nodeName || 'ElasticSearchAgent';
        const model_label = initNodeData.model_label || '';
        const use_unified_llm_gateway = initNodeData.use_unified_llm_gateway || false;
        const model_name = initNodeData.model_name || 'deepseek-chat';
        const return_direct = initNodeData.return_direct || false;
        const elasticsearch_retrieval_count = initNodeData.elasticsearch_retrieval_count || 3;
        const elasticsearch_result_deal_code = initNodeData.elasticsearch_result_deal_code || '';
        const node_carry_history_msg = initNodeData.node_carry_history_msg || false;
        return {
            agent_prompt,
            structured_retrieval_table_name,
            elasticsearch_index_name,
            search_tool_description,
            max_tokens,
            agent_temperature,
            tool_temperature,
            top_p,
            model_label,
            model_name,
            use_unified_llm_gateway,
            return_direct,
            elasticsearch_retrieval_count,
            elasticsearch_result_deal_code,
            node_carry_history_msg,
            nodeName,
            inputVariables,
            outputVariables,
            structuredFieldRetrievalConfig,
        };
    });

    useEffect(() => {
        // 更新节点数据
        editor.updateNodeData(id, nodeData, true);
    }, [nodeData]);
    return (
        <div style={{position: 'relative'}}>
            {/* 动态添加handle  和 input 变量 通过id 绑定*/}
            {nodeData.inputVariables.map(
                (variable: { id: string }, index: number) => {
                    const initialHandleTopPosition = 95; // 第一个Handle的top位置
                    const handleSpacing = 60; // 每个Handle之间的间隔
                    // 计算每个Handle的top位置
                    const topPosition = `${initialHandleTopPosition + index * handleSpacing + index * 4}px`;
                    return (
                        <Handle
                            id={variable.id}
                            key={variable.id}
                            type={'target'}
                            position={Position.Left}
                            style={{top: topPosition, left: '-5px'}}
                        />
                    );
                },
            )}
            <NodeBodyCard
                logo={logo}
                nodeId={id}
                nodeData={nodeData}
                setNodeData={setNodeData}
                editor={editor}
            >
                {/*自定义节点表单*/}
                <ElasticSearchAgentNodeForm
                    nodeData={nodeData}
                    setNodeData={setNodeData}
                />
            </NodeBodyCard>
            {/* 默认的输出节点 */}
            {nodeData.outputVariables.length < 1 && (
                <Handle
                    key={uuid()}
                    id={id}
                    type={'source'}
                    position={Position.Right}
                />
            )}
            {/* 自定义输出 {} 平铺格式 */}
            {nodeData.outputVariables.map(
                (variable: { id: string }, index: number) => {
                    const initialHandleBottomPosition = 50; // 第一个Handle的top位置
                    const len = nodeData.outputVariables.length;
                    const handleSpacing = 65 - (len - index) * 0.1; // 每个Handle之间的间隔
                    // 计算每个Handle的top位置
                    const bottomPosition = `${initialHandleBottomPosition + handleSpacing * (len - index) + index * 0.2}px`;
                    return (
                        <Handle
                            id={variable.id}
                            key={variable.id}
                            type="source"
                            position={Position.Right}
                            style={{bottom: bottomPosition, right: '-5px', top: 'unset'}}
                        />
                    );
                },
            )}
        </div>
    );
};
