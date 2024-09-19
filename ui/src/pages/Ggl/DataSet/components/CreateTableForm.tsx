import React, { useState } from 'react';
import { Form, Input, Select, Button, message } from 'antd';

// 定义不同数据库支持的字段类型
const fieldTypes = {
    'PostgreSQL': {
        'Integer': 'Integer',
        'Vector': 'Vector',
        'Text': 'Text',
        'JSON': 'JSON',
        'Boolean': 'Boolean',
        'Numeric': 'Numeric'
    },
    'MySQL': {
        'INT': 'INT',
        'VARCHAR': 'VARCHAR',
        'TEXT': 'TEXT',
        'JSON': 'JSON',
        'BOOLEAN': 'BOOLEAN',
        'DECIMAL': 'DECIMAL'
    }
};

export const CreateTableForm = () => {
    const [form] = Form.useForm();
    const [fields, setFields] = useState<Array<{ name: string; type: string }>>([]);
    const [selectedDbType, setSelectedDbType] = useState('PostgreSQL');
    const [tableName, setTableName] = useState('xxx');


    const handleDbTypeChange = (value: string) => {
        setSelectedDbType(value);
        // 清空已存在的字段，因为不同数据库的字段类型可能不兼容
        setFields([]);
    };

    const handleFieldTypeChange = (index: number, fieldType: string) => {
        const newFields = [...fields];
        newFields[index] = { ...newFields[index], type: fieldType };
        setFields(newFields);
    };

    const addField = () => {
        // @ts-ignore
        const defaultFieldType = Object.keys(fieldTypes[selectedDbType])[0];
        setFields([...fields, { name: '', type: defaultFieldType }]);
    };

    const removeField = (index: number) => {
        const newFields = [...fields];
        newFields.splice(index, 1);
        setFields(newFields);
    };

    const createTable = async () => {
        try {
            const values = await form.validateFields();
            message.success('表结构创建成功！');
        } catch (errorInfo) {
            console.log('验证失败:', errorInfo);
        }
    };

    return (
        <Form form={form} layout="vertical">
            <Form.Item
                name="tableName"
                label="表名"
                rules={[{ required: true, message: '请输入表名！' }]}
            >
                <Input value={tableName} onChange={(e) => setTableName(e.target.value)} placeholder="输入表名" />
            </Form.Item>
            <Form.Item
                name="dbType"
                label="数据库类型"
                rules={[{ required: true, message: '请选择数据库类型！' }]}
            >
                <Select
                    placeholder="选择数据库类型"
                    value={selectedDbType}
                    onChange={handleDbTypeChange}
                >
                    {Object.keys(fieldTypes).map((dbType) => (
                        <Select.Option key={dbType} value={dbType}>{dbType}</Select.Option>
                    ))}
                </Select>
            </Form.Item>
            {fields.map((field, index) => (
                <div key={index} style={{ display: 'flex', marginBottom: 8 }}>
                    <Form.Item
                        name={`fieldName${index}`}
                        rules={[{ required: true, message: '请输入字段名！' }]}
                    >
                        <Input placeholder="输入字段名" onChange={(e)=>{
                            const newFields = [...fields];
                            newFields[index] = { ...newFields[index], name: e.target.value };
                            setFields(newFields);

                        }}/>
                    </Form.Item>
                    <Form.Item
                        name={`fieldType${index}`}
                        rules={[{ required: true, message: '请选择字段类型！' }]}
                    >

                        <Select
                            placeholder="选择字段类型"
                            value={field.type}
                            onChange={(value) => handleFieldTypeChange(index, value)}
                        >
                            {/* @ts-ignore*/}
                            {Object.keys(fieldTypes[selectedDbType]).map((type) => (
                                <Select.Option key={type} value={type}>{type}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Button onClick={() => removeField(index)} style={{ marginLeft: 8 }}>删除</Button>
                </div>
            ))}
            <Button type="dashed" onClick={addField} style={{ width: '100%' }}>
                + 添加字段
            </Button>
            <Form.Item>
                <Button type="primary" onClick={createTable}>
                    创建表
                </Button>
            </Form.Item>
        </Form>
    );
};

