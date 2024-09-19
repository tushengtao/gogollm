import React, { useEffect } from 'react';
import { Form, Input, Select, Switch, InputNumber } from 'antd';

// @ts-ignore
const DuckDuckGoSearchForm = ({ editingTool, onValuesChange }) => {
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
            <Form.Item label="描述"  name="description">
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
            <Form.Item label="最大结果数" name="max_results">
                <InputNumber min={6} max={50} />
            </Form.Item>
        </Form>
    );
};

export default DuckDuckGoSearchForm;
