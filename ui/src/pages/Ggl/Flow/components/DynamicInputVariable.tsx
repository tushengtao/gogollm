import React from 'react';
import {Input, Button, Form, Space} from 'antd';
import {MinusCircleOutlined} from "@ant-design/icons";
import {uuid} from "@ant-design/pro-flow/es/FlowEditor/utils/uuid";


const DynamicInputVariable: React.FC<{
    nodeData: any,
    setNodeData: any,
    buttonName: string }> = ({nodeData, setNodeData, buttonName}) => {

    const {inputVariables} = nodeData;
    const removeVariable = (id: string) => {
        const newVariables = inputVariables.filter((variable: { id: string; }) => variable.id !== id);
        setNodeData({
            ...nodeData,
            inputVariables: newVariables,
        });
    };
    const addVariable = () => {
        setNodeData({
            ...nodeData,
            inputVariables: [...inputVariables, {id: uuid(), name: '', value: ''}],
        });
    };
    const handleInputChange = (id: string, field: string, event: React.ChangeEvent<HTMLInputElement>) => {
        setNodeData({
            ...nodeData,
            inputVariables: inputVariables.map((variable: { id: string; }) =>
                (variable.id === id ? {...variable, [field]: event.target.value} : variable)
            ),
        });
    };
    return (
        <Form>
            <Space direction="vertical">
                {inputVariables.map((variable: { id: string; name: string; value: string; }) => (
                    <Form.Item key={variable.id}>
                        <Space direction="horizontal">
                            <Input
                                style={{width: '130px'}}
                                placeholder="请输入变量名称"
                                value={variable.name}
                                onChange={(e) => handleInputChange(variable.id, 'name', e)}
                            />
                            <Input
                                style={{width: '180px'}}
                                placeholder="请输入值"
                                value={variable.value}
                                onChange={(e) => handleInputChange(variable.id, 'value', e)}
                            />
                            <MinusCircleOutlined onClick={() => removeVariable(variable.id)}
                                                 style={{color: 'red'}}/>
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
export default DynamicInputVariable;
