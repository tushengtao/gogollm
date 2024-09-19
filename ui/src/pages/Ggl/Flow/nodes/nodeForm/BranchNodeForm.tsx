import React from 'react';
import {Button, Input, Form, Row, Col} from 'antd';
import {MinusCircleOutlined} from "@ant-design/icons";
import {uuid} from '@ant-design/pro-flow/es/FlowEditor/utils/uuid';
import GoGoLLMSelect from '@/pages/Ggl/Flow/components/GoGoLLMSelect';


export const BranchNodeForm: React.FC<{
    nodeData: any,
    setNodeData: any
}> = ({nodeData, setNodeData}) => {

    const conditionOperatorOption = [
        {
            "label": "等于",
            "value": "equals"
        },
        {
            "label": "包含",
            "value": "contains"
        },
        {
            "label": "长度等于",
            "value": "lengthEquals"
        }
    ];

    const addCondition = () => {
        setNodeData({
            ...nodeData,
            conditions: [...nodeData.conditions, {id:uuid(), variables: [{varName: '', operator: 'equals', value: ''}], target_node: ''}]
        })
    };

    const removeCondition = (delete_index: number) => {
        setNodeData({
            ...nodeData,
            conditions: nodeData.conditions.filter((_: any, index: number) => index !== delete_index)
        })
    };

    const addVariable = (index: number) => {
        const newConditions = nodeData.conditions.map((condition: any, i: number) => {
            if (i === index) {
                return {
                    ...condition,
                    variables: [...condition.variables, {varName: '', operator: '', value: ''}]
                };
            }
            return condition;
        });
        setNodeData({
            ...nodeData,
            conditions: newConditions
        });
    };

    const removeVariable = (variableIndex: number, conditionIndex: number) => {
        const newConditions = nodeData.conditions.map((condition:any, i:number) => {
            if (i === conditionIndex) {
                return {
                    ...condition,
                    variables: condition.variables.filter((v:any, idx:number) => idx !== variableIndex)
                };
            }
            return condition;
        });
        setNodeData({
            ...nodeData,
            conditions: newConditions
        });
    };
    const handleInputChange = (conditionIndex: number, variableIndex: number, field: string, value: string) => {
        const newConditions = nodeData.conditions.map((condition:any, i:number) => {
            if (i === conditionIndex) {
                const newVariables = condition.variables.map((variable:any, j:number) => {
                    if (j === variableIndex) {
                        return {
                            ...variable,
                            [field]: value
                        };
                    }
                    return variable;
                });
                return {
                    ...condition,
                    variables: newVariables
                };
            }
            return condition;
        });
        setNodeData({
            ...nodeData,
            conditions: newConditions
        });
    };

    return (
        <div>
            <Form layout="vertical">
                {nodeData.conditions.map((condition: { variables: any[]; }, conditionIndex: number) => (
                    <Form.Item key={conditionIndex} style={{ border: '1px dashed #ccc', padding: '10px' }}>
                        <div style={{marginBottom: "5px"}}>
                            <Row gutter={4}>
                                <Col>
                                    <span style={{}}>条件 {conditionIndex + 1}：</span>
                                    <Button type="dashed"
                                            onClick={() => removeCondition(conditionIndex)}>移除条件</Button>
                                </Col>
                                <Col>
                                    <Button type="dashed" onClick={() => addVariable(conditionIndex)}>添加变量</Button>
                                </Col>
                            </Row>
                        </div>
                        {condition.variables.map((variable, variableIndex) => (
                            <Row key={variableIndex} gutter={6}>
                                <Col>
                                    <Form.Item>
                                        <Input
                                            placeholder="变量名"
                                            value={variable.varName}
                                            onChange={(e) => handleInputChange(conditionIndex, variableIndex, 'varName', e.target.value)}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col>
                                    <Form.Item>
                                        {/* @ts-ignore */}
                                        <GoGoLLMSelect options={conditionOperatorOption}
                                                       isMultifun={false}
                                                       width={110}
                                                       placeholder="请选择操作符"
                                                       defaultValue={variable.operator}
                                                       onChange={(label:any,value: string) => handleInputChange(conditionIndex, variableIndex, 'operator', value)}>

                                        </GoGoLLMSelect>
                                    </Form.Item>
                                </Col>
                                <Col>
                                    <Form.Item>
                                        <Input
                                            placeholder="值"
                                            value={variable.value}
                                            onChange={(e) => handleInputChange(conditionIndex, variableIndex, 'value', e.target.value)}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col>
                                    <MinusCircleOutlined style={{color: 'red', marginTop: '60%'}}
                                                         onClick={() => removeVariable(variableIndex, conditionIndex)}/>
                                </Col>
                            </Row>
                        ))}
                    </Form.Item>
                ))}
                <Button style={{marginRight: "1%"}} type="dashed" onClick={addCondition}>添加条件</Button>
            </Form>
        </div>
    );
};
