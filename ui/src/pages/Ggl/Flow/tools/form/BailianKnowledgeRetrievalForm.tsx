import React, { useEffect } from 'react';
import { Form, Input, Select, Switch } from 'antd';
// @ts-ignore
const BailianKnowledgeRetrievalForm = ({ editingTool, onValuesChange }) => {
    const [form] = Form.useForm();

    // 当 `tool` 变化时，更新表单字段的值
    useEffect(() => {
        form.setFieldsValue(editingTool);
    }, [editingTool, form]);

    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={editingTool}
            onValuesChange={onValuesChange}
        >
            <Form.Item label="名称" name="name">
                <Input disabled />
            </Form.Item>
            <Form.Item label="描述" name="description">
                <Input.TextArea/>
            </Form.Item>
            <Form.Item label="类型" name="type">
                <Select disabled>
                    <Select.Option value="builtin">内置</Select.Option>
                    <Select.Option value="custom">自定义</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item label="直接返回" name="return_direct" valuePropName="checked">
                <Switch />
            </Form.Item>

            <Form.Item label="workspaceId" name="workspaceId">
                <Input />
            </Form.Item>
            <Form.Item label="indexId" name="indexId">
                <Input />
            </Form.Item>
            <Form.Item label="model_name" name="model_name">
                <Input />
            </Form.Item>
            <Form.Item label="rerank_min_score" name="rerank_min_score">
                <Input />
            </Form.Item>
            <Form.Item label="save_retriever_history" name="save_retriever_history" valuePropName="checked">
                <Switch />
            </Form.Item>


        </Form>
    );
};

export default BailianKnowledgeRetrievalForm;
