import React from 'react';
import {Space} from 'antd';
import {FlowEditorInstance} from "@ant-design/pro-flow";
import DynamicInputVariable from "@/pages/Ggl/Flow/components/DynamicInputVariable"
import DynamicOutputVariable from "@/pages/Ggl/Flow/components/DynamicOutputVariable"
import CodeEditorModal from "@/pages/Ggl/Flow/components/CodeEditorModal";


export const CodeNodeForm: React.FC<{
    nodeId: string;
    editor: FlowEditorInstance;
    nodeData: any;
    setNodeData: any;
}> = ({nodeData, setNodeData}) => {
    return (
        <Space direction="vertical" size="middle">

            <DynamicInputVariable nodeData={nodeData} setNodeData={setNodeData} buttonName="添加输入变量"/>

            <CodeEditorModal
                language="python"
                value={nodeData.code}
                onChange={(codeValue: any) =>
                    setNodeData({
                        ...nodeData,
                        code: codeValue,
                    })
                }
            />
            {/*<Space>*/}
            {/*    本地执行：*/}
            {/*    <Switch*/}
            {/*        checked={nodeData.isLocalExecution ?? true}*/}
            {/*        onChange={(checked) =>*/}
            {/*            setNodeData({*/}
            {/*                ...nodeData,*/}
            {/*                isLocalExecution: checked,*/}
            {/*            })*/}
            {/*        }*/}
            {/*    />*/}
            {/*</Space>*/}

            {/*可动态添加Input的自定义封装组件*/}
            <DynamicOutputVariable nodeData={nodeData} setNodeData={setNodeData}/>

        </Space>


    );
}

