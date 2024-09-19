import logo from '@/assets/imgs/StructuredChatAgentNode.png';
import NodeBodyCard from '@/pages/Ggl/Flow/components/NodeBodyCard';
import { StructuredChatAgentNodeForm } from '@/pages/Ggl/Flow/nodes/nodeForm/StructuredChatAgentNodeForm';
import { Handle, Position, useFlowEditor } from '@ant-design/pro-flow';
import { uuid } from '@ant-design/pro-flow/es/FlowEditor/utils/uuid';
import React, { useEffect, useState } from 'react';

export const StructuredChatAgentNode: React.FC = (node: any) => {
  const editor = useFlowEditor();
  const { id, data } = node;
  const initNodeData = data;
  // LangGraphReactAgentNode
  const [nodeData, setNodeData] = useState(() => {
    const message_count = initNodeData.message_count || 5;
    const agent_prompt = initNodeData.agent_prompt || '';
    const max_tokens = initNodeData.max_tokens || 4096; // TODO form里添加
    const temperature = initNodeData.temperature || 0.9;
    const top_p = initNodeData.top_p || 0.7; // TODO form里添加
    const inputVariables = initNodeData.inputVariables || [
      { id: uuid(), name: 'question', value: '' },
    ];
    const tools_list = initNodeData.tools_list || [];
    const nodeName = initNodeData.nodeName || 'StructuredChatAgent';
    const model_label = initNodeData.model_label || '';
    const model_name = initNodeData.model_name || 'deepseek-chat';
    const use_unified_llm_gateway = initNodeData.use_unified_llm_gateway || false;
    const node_carry_history_msg = initNodeData.node_carry_history_msg || false;

    return {
      message_count,
      agent_prompt,
      max_tokens,
      temperature,
      top_p,
      model_label,
      model_name,
      use_unified_llm_gateway,
      node_carry_history_msg,
      nodeName,
      tools_list,
      inputVariables,
    };
  });
  useEffect(() => {
    // 更新节点数据
    editor.updateNodeData(id, nodeData, true);
  }, [nodeData]);

  return (
    <div style={{ position: 'relative' }}>
      {/* 默认的输入节点 */}
      {nodeData.inputVariables.length < 1 && (
        <Handle
          key={uuid()}
          id={id}
          type={'target'}
          position={Position.Left}
          style={{ top: '50%', left: '-5px' }}
        />
      )}

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
              style={{ top: topPosition, left: '-5px' }}
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
        <StructuredChatAgentNodeForm nodeData={nodeData} setNodeData={setNodeData} />
      </NodeBodyCard>
      <Handle key={uuid()} id={id} type={'source'} position={Position.Right} />
    </div>
  );
};
