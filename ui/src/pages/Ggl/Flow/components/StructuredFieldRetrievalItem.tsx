
import CodeEditorModal from '@/pages/Ggl/Flow/components/CodeEditorModal';
import GoGoLLMSelect from '@/pages/Ggl/Flow/components/GoGoLLMSelect';
import {
    DownOutlined,
    MinusCircleOutlined,
    UpOutlined,
} from '@ant-design/icons';
import { Form, Input, InputNumber, Space } from 'antd';
import React from 'react';

const StructuredFieldRetrievalItem: React.FC<{
    variable: {
        id: string;
        name: string;
        field_preprocess_code: string;
        genertate_field_dsl_code: string;
        retrieval_method: string;
        retrieval_count: number;
        similarity_threshold_min: number;
    };
    handleInputChange: (cid: string, field: string, event: any) => void;
    retrieval_methods: { label: string; value: string }[];
    remove: () => void;
}> = ({ variable, handleInputChange, retrieval_methods, remove }) => {
    return (
        <Form.Item key={variable.id}>
            <Space size="middle" direction="horizontal">
                <Input
                    placeholder="检索字段名称"
                    value={variable.name}
                    onChange={(e) => handleInputChange(variable.id, 'name', e)}
                />
                <Space>
                    检索字段预处理：
                    <CodeEditorModal
                        value={variable.field_preprocess_code}
                        onChange={(codeValue: any) =>
                            handleInputChange(variable.id, 'field_preprocess_code', {
                                target: {
                                    value: codeValue,
                                },
                            })
                        }
                    />
                </Space>
                <Space>
                    检索字段DSL生成：
                    <CodeEditorModal
                        value={variable.genertate_field_dsl_code}
                        onChange={(codeValue: any) =>
                            handleInputChange(variable.id, 'genertate_field_dsl_code', {
                                target: {
                                    value: codeValue,
                                },
                            })
                        }
                    />
                </Space>
                <GoGoLLMSelect
                    width={250}
                    options={retrieval_methods}
                    placeholder="检索方式"
                    defaultValue={variable.retrieval_method || 'vector'}
                    onChange={(label:any, value: any) =>
                        handleInputChange(variable.id, 'retrieval_method', {
                            target: {
                                value: value,
                            },
                        })
                    }
                />
                <Space direction="horizontal">
                    count:
                    <InputNumber
                        value={variable.retrieval_count}
                        controls={{
                            upIcon: (
                                <UpOutlined
                                    onClick={() =>
                                        handleInputChange(variable.id, 'retrieval_count', {
                                            target: {
                                                value: variable.retrieval_count + 1,
                                            },
                                        })
                                    }
                                    style={{ fontSize: '12px', color: '#1677ff' }}
                                />
                            ),
                            downIcon: (
                                <DownOutlined
                                    onClick={() =>
                                        handleInputChange(variable.id, 'retrieval_count', {
                                            target: {
                                                value: variable.retrieval_count - 1,
                                            },
                                        })
                                    }
                                    style={{ fontSize: '12px', color: '#1677ff' }}
                                />
                            ),
                        }}
                        defaultValue={12}
                        min={1}
                        max={100}
                        style={{ width: 80, height: 35 }}
                    />
                </Space>
                <Space direction="horizontal">
                    相似度阈值:
                    <InputNumber
                        value={variable.similarity_threshold_min}
                        controls={{
                            upIcon: (
                                <UpOutlined
                                    onClick={() => {
                                        const new_value = parseFloat(
                                            (variable.similarity_threshold_min + 0.01).toFixed(2),
                                        );
                                        handleInputChange(variable.id, 'similarity_threshold_min', {
                                            target: {
                                                value: new_value,
                                            },
                                        });
                                    }}
                                    style={{ fontSize: '12px', color: '#1677ff' }}
                                />
                            ),
                            downIcon: (
                                <DownOutlined
                                    onClick={() => {
                                        const new_value = parseFloat(
                                            (variable.similarity_threshold_min - 0.01).toFixed(2),
                                        );
                                        handleInputChange(variable.id, 'similarity_threshold_min', {
                                            target: {
                                                value: new_value,
                                            },
                                        });
                                    }}
                                    style={{ fontSize: '12px', color: '#1677ff' }}
                                />
                            ),
                        }}
                        defaultValue={0.3}
                        min={0.01}
                        max={0.95}
                        style={{ width: 80, height: 35 }}
                    />
                </Space>
                <MinusCircleOutlined onClick={remove} style={{ color: 'red' }} />
            </Space>
        </Form.Item>
    );
};
export default StructuredFieldRetrievalItem;
