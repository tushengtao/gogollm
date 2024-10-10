import React, {useEffect, useState} from 'react';
import {Button, Form, Input, InputNumber, Modal, Select, Switch} from 'antd';
import StructuredFieldRetrievalConfig from "@/pages/Ggl/Flow/components/StructuredFieldRetrievalConfig";
import CodeEditorModal from "@/pages/Ggl/Flow/components/CodeEditorModal";
import FullScreenEditIcon from "@/components/Icon/FullScreenEditIcon";
import {DownOutlined, UpOutlined} from "@ant-design/icons";

// @ts-ignore
const ElasticsearchSearchForm = ({editingTool, onValuesChange, setEditingTool}) => {
    const [form] = Form.useForm();
    const [isRetrievalFieldModalVisible, setIsRetrievalFieldModalVisible] = useState(false);
    const [
        isSearchToolDescriptionModalVisible,
        setIsSearchToolDescriptionModalVisible,
    ] = useState(false);

    // 当 `tool` 变化时，更新表单字段的值
    useEffect(() => {
        form.setFieldsValue(editingTool);
    }, [editingTool, form]);

    return (
        <Form
            form={form}
            layout="horizontal"
            initialValues={editingTool}
            onValuesChange={onValuesChange}
            labelCol={{span: 6}}
            wrapperCol={{span: 18}}
            labelAlign="left"
        >
            <Form.Item label="名称" name="name">
                <Input disabled/>
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
                <Switch/>
            </Form.Item>
            <Form.Item label="工具描述词" name="search_tool_description">
                <Input
                    name={'search_tool_description'}
                    style={{marginBottom: '10px', width: '250px', cursor: 'pointer'}}
                    suffix={
                        <span
                            onClick={() => {
                                setIsSearchToolDescriptionModalVisible(true);
                            }}
                        >
                <FullScreenEditIcon/>
              </span>
                    }
                    value={editingTool.search_tool_description}
                    placeholder="输入搜索工具描述"
                    onChange={(e) => {
                        setEditingTool({
                            ...editingTool,
                            search_tool_description: e.target.value,
                        });
                    }}
                />

                <Modal
                    title="编辑搜索工具描述"
                    width={'55%'}
                    footer={[]}
                    open={isSearchToolDescriptionModalVisible}
                    okButtonProps={{style: {display: 'none'}}}
                    onOk={() => {
                        setIsSearchToolDescriptionModalVisible(false);
                    }}
                    onCancel={() => {
                        setIsSearchToolDescriptionModalVisible(false);
                    }}
                >
                    <Input.TextArea
                        style={{fontSize: '20px'}}
                        autoSize={true}
                        value={editingTool.search_tool_description}
                        onChange={(e) => {
                            setEditingTool({
                                ...editingTool,
                                search_tool_description: e.target.value,
                            });
                        }}
                        rows={4}
                    />
                </Modal>

            </Form.Item>


            <Form.Item label="检索参数表" name="structured_retrieval_table_name">
                <Input/>
            </Form.Item>
            <Form.Item label="检索Index" name="elasticsearch_index_name">
                <Input/>
            </Form.Item>

            <Form.Item label="检索条件字段" name="structuredFieldRetrievalConfig">
                <Button
                    type="dashed"
                    onClick={() => {
                        setIsRetrievalFieldModalVisible(true);
                    }}
                >
                    编辑
                </Button>
                <Modal
                    title="编辑检索条件字段"
                    width={'70%'}
                    footer={[]}
                    open={isRetrievalFieldModalVisible}
                    okButtonProps={{style: {display: 'none'}}}
                    onOk={() => {
                        setIsRetrievalFieldModalVisible(false);
                    }}
                    onCancel={() => {
                        setIsRetrievalFieldModalVisible(false);
                    }}
                >
                    <StructuredFieldRetrievalConfig
                        nodeData={editingTool}
                        setNodeData={setEditingTool}
                        buttonName="添加 ElasticSearch 检索字段"
                    ></StructuredFieldRetrievalConfig>
                </Modal>
            </Form.Item>

            <Form.Item label="ES检索数量" name="elasticsearch_retrieval_count">
                <InputNumber
                    value={editingTool.elasticsearch_retrieval_count}
                    controls={{
                        upIcon: (
                            <UpOutlined
                                onClick={() => {
                                    setEditingTool({
                                        ...editingTool,
                                        elasticsearch_retrieval_count: editingTool.elasticsearch_retrieval_count + 1,
                                    })
                                }}
                                style={{ fontSize: '12px', color: '#1677ff' }}
                            />
                        ),
                        downIcon: (
                            <DownOutlined
                                onClick={() => {
                                    setEditingTool({
                                        ...editingTool,
                                        elasticsearch_retrieval_count: editingTool.elasticsearch_retrieval_count - 1,
                                    })
                                }}
                                style={{ fontSize: '12px', color: '#1677ff' }}
                            />
                        ),
                    }}
                    defaultValue={3}
                    min={1}
                    max={100}
                    style={{ width: 80, height: 35 }}
                />
            </Form.Item>

            <Form.Item label="搜索结果处理" name="elasticsearch_result_deal_code">
                <CodeEditorModal
                    value={editingTool.elasticsearch_result_deal_code}
                    onChange={(codeValue: any) =>
                        setEditingTool({
                            ...editingTool,
                            elasticsearch_result_deal_code: codeValue,
                        })
                    }
                />
            </Form.Item>
        </Form>
    );
};

export default ElasticsearchSearchForm;
