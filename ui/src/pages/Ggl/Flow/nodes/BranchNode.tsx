import React, {useEffect, useRef, useState} from 'react';
import {Handle, Position, useFlowEditor} from '@ant-design/pro-flow';
import NodeBodyCard from "@/pages/Ggl/Flow/components/NodeBodyCard";
import logo from '@/assets/imgs/BranchNode.png';
import {uuid} from '@ant-design/pro-flow/es/FlowEditor/utils/uuid';
import {BranchNodeForm} from "@/pages/Ggl/Flow/nodes/nodeForm/BranchNodeForm";

export const BranchNode: React.FC = (node: any) => {
    const editor = useFlowEditor();
    const {id, data} = node;
    const initNodeData = data;
    const nodeDivRef = useRef(null);
    const [nodeData, setNodeData] = useState(() => {
        const nodeName = initNodeData.nodeName || 'BranchNode';
        const outputVariables = initNodeData.outputVariables || [];
        const conditions = initNodeData.conditions || [
            {
                id: uuid(),
                target_node:'',
                variables: [
                    { varName: '', operator: 'equals', value: '' },
                ],
            },
        ];
        return {
            outputVariables,
            nodeName,
            conditions
        };
    });

    useEffect(() => {
        editor.updateNodeData(id, nodeData, true);
    }, [nodeData]);

    return (
        <div ref={nodeDivRef} style={{width:"100%"}}>
            <Handle
                key={id}
                id={id}
                type={'target'}
                position={Position.Left}
                style={{top: '50%', left: '-5px'}}
            />

            <NodeBodyCard logo={logo} nodeId={id} nodeData={nodeData} setNodeData={setNodeData} editor={editor}>
                {/* @ts-ignore */}
                <BranchNodeForm
                    nodeData={nodeData}
                    setNodeData={setNodeData}
                >
                </BranchNodeForm>
            </NodeBodyCard>

            {nodeData.conditions.map(
                (variable: { id: string }, index: number) => {
                    const initialHandleBottomPosition = 145;
                    let preVariablesCount = 0
                    for(let i=0;i<index;i++){
                        preVariablesCount =  preVariablesCount + nodeData.conditions[i].variables.length;

                    }
                    let position = `${initialHandleBottomPosition}px`;
                    if (index > 0){
                        position = `${initialHandleBottomPosition  + (70 * index) + (preVariablesCount-1) * 60 + 70 }px`;
                    }
                    return (
                        <Handle
                            id={variable.id}
                            key={variable.id}
                            type="source"
                            position={Position.Right}
                            style={{top: position, right: '-5px'}}
                        />
                    );
                },
            )}
        </div>
    );
};
