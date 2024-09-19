import React, {useEffect, useState} from 'react';
import {Handle, Position, useFlowEditor} from '@ant-design/pro-flow';
import {CodeNodeForm} from './nodeForm/CodeNodeForm';
import NodeBodyCard from "@/pages/Ggl/Flow/components/NodeBodyCard";
import logo from '@/assets/imgs/CodeNode.png';
import {uuid} from '@ant-design/pro-flow/es/FlowEditor/utils/uuid';

export const CodeNode: React.FC = (node: any) => {
    const editor = useFlowEditor();
    const {id, data} = node;
    const initNodeData = data;
    // 表单数据 需要动态初始化绑定
    const [nodeData, setNodeData] = useState(() => {
        const inputVariables = initNodeData.inputVariables || [
            {id: uuid(), name: 'question', value: ''}
        ];
        const nodeName = initNodeData.nodeName || 'Code';
        const outputVariables = initNodeData.outputVariables || [];
        const isLocalExecution = initNodeData.isLocalExecution || false;
        const code = initNodeData.code || '';
        return {
            inputVariables,
            isLocalExecution,
            outputVariables,
            nodeName,
            code
        };
    });
    useEffect(() => {
        editor.updateNodeData(id, nodeData, true);
    }, [nodeData]);
    return (
        <div>
            {/* 动态添加handle  和input变量 通过id 绑定*/}
            {
                nodeData.inputVariables.map((variable: any, index: any) => {
                    const initialHandleTopPosition = 98; // 第一个Handle的top位置
                    const handleSpacing = 60; // 每个Handle之间的间隔
                    // 计算每个Handle的top位置
                    const topPosition = `${initialHandleTopPosition + index * handleSpacing + index * 3.5}px`;
                    return (
                        <Handle
                            key={variable.id}
                            id={variable.id}
                            type={'target'}
                            position={Position.Left}
                            style={{top: topPosition, left: '-5px'}}
                        />
                    );
                })
            }
            <NodeBodyCard logo={logo} nodeId={id} nodeData={nodeData} setNodeData={setNodeData} editor={editor}>
                {/*自定义节点表单*/}
                <CodeNodeForm
                    nodeId={id}
                    editor={editor}
                    nodeData={nodeData}
                    setNodeData={setNodeData}
                />
            </NodeBodyCard>
            {/* 默认输出 handle */}
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
