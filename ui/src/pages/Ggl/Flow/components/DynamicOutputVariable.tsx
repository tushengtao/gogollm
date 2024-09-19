import React from 'react';
import {Input, Button, Form, Space} from 'antd';
import {MinusCircleOutlined} from "@ant-design/icons";
import {uuid} from "@ant-design/pro-flow/es/FlowEditor/utils/uuid";

const DynamicOutputVariable: React.FC<{
    nodeData: any,
    setNodeData: any,
    buttonName?: string
}> = ({
          nodeData,
          setNodeData,
          buttonName = '添加输出变量'
      }) => {
    const {outputVariables} = nodeData;
    const removeVariable = (id: string) => {
        const newVariables = outputVariables.filter((variable: { id: string; }) => variable.id !== id);
        setNodeData({
            ...nodeData,
            outputVariables: newVariables,
        });
    };
    const addVariable = () => {
        setNodeData((prevState: { outputVariables: any; }) => {
            // 使用 prevState 来保证基于最新的状态进行更新
            return {
                ...prevState,
                outputVariables: [
                    ...prevState.outputVariables,
                    {id: uuid(), name: '', value: ''}
                ],
            };
        });
    };

    const handleInputChange = (id: string, field: string, event: React.ChangeEvent<HTMLInputElement>) => {
        setNodeData({
            ...nodeData,
            outputVariables: outputVariables.map((variable: { id: string; }) =>
                (variable.id === id ? {...variable, [field]: event.target.value} : variable)
            ),
        });
    };

    return (
        <Form>
            <Space direction="vertical">
                {outputVariables.map((variable: { id: string; name: string; value: string; }) => (
                    <Form.Item key={variable.id}>
                        <Space direction="horizontal">
                            <Input
                                style={{width: '130px'}}
                                placeholder="请输入key名称，如 context"
                                value={variable.name}
                                onChange={(e) => handleInputChange(variable.id, 'name', e)}
                            />
                            <Input
                                style={{width: '180px'}}
                                placeholder="解析规则，如: data.user.name"
                                value={variable.value}
                                onChange={(e) => handleInputChange(variable.id, 'value', e)}
                            />
                            <MinusCircleOutlined onClick={() => removeVariable(variable.id)} style={{color: 'red'}}/>
                        </Space>

                    </Form.Item>
                ))}
            </Space>
            <Form.Item>
                <Button type="dashed" onClick={addVariable} style={{width: '100%'}}>
                    {buttonName}
                </Button>
            </Form.Item>
        </Form>
    );
};
export default DynamicOutputVariable;
