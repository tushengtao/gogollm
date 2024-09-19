import React, {useState} from 'react';
import {Button, Input, InputNumber, Modal, Space, Switch} from 'antd';
import {DownOutlined, UpOutlined} from '@ant-design/icons';
import FullScreenEditIcon from '@/components/Icon/FullScreenEditIcon';
import GoGoLLMSelect from '@/pages/Ggl/Flow/components/GoGoLLMSelect';
import CodeEditorModal from "@/pages/Ggl/Flow/components/CodeEditorModal";
import DynamicInputVariable from '@/pages/Ggl/Flow/components/DynamicInputVariable';
import DynamicOutputVariable from '@/pages/Ggl/Flow/components/DynamicOutputVariable';
import StructuredFieldRetrievalConfig from '@/pages/Ggl/Flow/components/StructuredFieldRetrievalConfig';
import {LLM_MODELS} from "@/pages/Ggl/constants";

export const ElasticSearchAgentNodeForm: React.FC<{
    nodeData: any;
    setNodeData: any;
}> = ({nodeData, setNodeData}) => {
    const [isAgentPromptModalVisible, setIsAgentPromptModalVisible] =
        useState(false);
    const [
        isSearchToolDescriptionModalVisible,
        setIsSearchToolDescriptionModalVisible,
    ] = useState(false);

    const [isRetrievalFieldModalVisible, setIsRetrievalFieldModalVisible] =
        useState(false);

    return (
        <div>
            <Space direction="vertical" size="middle">
                {/*可动态添加Input的自定义封装组件*/}
                <DynamicInputVariable
                    nodeData={nodeData}
                    setNodeData={setNodeData}
                    buttonName="添加输入变量"
                />
                <Space direction="horizontal">
                    Agent Temperature：
                    <InputNumber
                        value={nodeData.agent_temperature.toFixed(2)}
                        controls={{
                            upIcon: (
                                <UpOutlined
                                    onClick={() => {
                                        if (nodeData.agent_temperature >= 2) {
                                            return;
                                        }
                                        const newTemperature = parseFloat(
                                            (nodeData.agent_temperature + 0.05).toFixed(2),
                                        );
                                        const newNodeData = {
                                            ...nodeData,
                                            agent_temperature: newTemperature,
                                        };
                                        setNodeData(newNodeData);
                                    }}
                                    style={{fontSize: '12px', color: '#1677ff'}}
                                />
                            ),
                            downIcon: (
                                <DownOutlined
                                    onClick={() => {
                                        if (nodeData.agent_temperature <= 0.05) {
                                            return;
                                        }
                                        const newTemperature = parseFloat(
                                            (nodeData.agent_temperature - 0.05).toFixed(2),
                                        );
                                        const newNodeData = {
                                            ...nodeData,
                                            agent_temperature: newTemperature,
                                        };
                                        setNodeData(newNodeData);
                                    }}
                                    style={{fontSize: '12px', color: '#1677ff'}}
                                />
                            ),
                        }}
                        defaultValue={0.95}
                        min={0.05}
                        max={1}
                        stringMode
                        style={{width: 250, height: 35}}
                    />
                </Space>
                <Space direction="horizontal">
                    Agent Prompt：
                    <Input
                        name={'agent_prompt'}
                        style={{marginBottom: '10px', width: '250px', cursor: 'pointer'}}
                        suffix={
                            <span
                                onClick={() => {
                                    setIsAgentPromptModalVisible(true);
                                }}
                            >
                <FullScreenEditIcon/>
              </span>
                        }
                        value={nodeData.agent_prompt}
                        placeholder="输入Agent智能体的提示词"
                        onChange={(e) => {
                            setNodeData({
                                ...nodeData,
                                agent_prompt: e.target.value,
                            });
                        }}
                    />
                    <Modal
                        title="编辑Agent Prompt"
                        width={'55%'}
                        footer={[]}
                        open={isAgentPromptModalVisible}
                        okButtonProps={{style: {display: 'none'}}} // 隐藏确定按钮
                        onOk={() => {
                            setIsAgentPromptModalVisible(false);
                        }}
                        onCancel={() => {
                            setIsAgentPromptModalVisible(false);
                        }}
                    >
                        <Input.TextArea
                            style={{fontSize: '20px'}}
                            autoSize={true}
                            value={nodeData.agent_prompt}
                            onChange={(e) => {
                                setNodeData({
                                    ...nodeData,
                                    agent_prompt: e.target.value,
                                });
                            }}
                            rows={4}
                        />
                    </Modal>
                </Space>
                <Space direction="horizontal">
                    Agent Model：
                    <GoGoLLMSelect
                        width={300}
                        options={LLM_MODELS}
                        placeholder="选择Agent LLM"
                        defaultValue={nodeData.model_name || 'deepseek-chat'}
                        onChange={(label:any, value: any) => {
                            setNodeData({
                                ...nodeData,
                                model_label: label,
                                model_name: value,
                            });
                        }}
                    />
                </Space>
                <Space direction="horizontal">
                    使用LLM网关统一代理：
                    <Switch
                        onChange={(checked) => {
                            setNodeData({
                                ...nodeData,
                                use_unified_llm_gateway: checked
                            })
                        }}
                        checked={nodeData.use_unified_llm_gateway}
                        checkedChildren="是"
                        unCheckedChildren="否"
                    />
                </Space>
                <Space direction="horizontal">
                    检索参数表：
                    <Input
                        name={'structured_retrieval_table_name'}
                        style={{marginBottom: '10px', width: '250px'}}
                        value={nodeData.structured_retrieval_table_name}
                        placeholder="输入结构化向量检索表名称"
                        onChange={(e) => {
                            setNodeData({
                                ...nodeData,
                                structured_retrieval_table_name: e.target.value,
                            });
                        }}
                    />
                </Space>

                <Space direction="horizontal">
                    检索参数字段：
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
                        width={'80%'}
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
                            nodeData={nodeData}
                            setNodeData={setNodeData}
                            buttonName="添加 ElasticSearch 检索字段"
                        ></StructuredFieldRetrievalConfig>
                    </Modal>
                </Space>

                <Space direction="horizontal">
                    ElasticSearch Index：
                    <Input
                        name={'elasticsearch_index_name'}
                        style={{marginBottom: '10px', width: '250px'}}
                        value={nodeData.elasticsearch_index_name}
                        placeholder="输入检索的ElasticSearch Index"
                        onChange={(e) => {
                            setNodeData({
                                ...nodeData,
                                elasticsearch_index_name: e.target.value,
                            });
                        }}
                    />
                </Space>

                <Space direction="horizontal">
                    搜索工具描述：
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
                        value={nodeData.search_tool_description}
                        placeholder="输入搜索工具描述"
                        onChange={(e) => {
                            setNodeData({
                                ...nodeData,
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
                            value={nodeData.search_tool_description}
                            onChange={(e) => {
                                setNodeData({
                                    ...nodeData,
                                    search_tool_description: e.target.value,
                                });
                            }}
                            rows={4}
                        />
                    </Modal>
                </Space>
                <Space direction="horizontal">
                    搜索结果处理Code：
                    <CodeEditorModal
                        value={nodeData.elasticsearch_result_deal_code}
                        onChange={(codeValue: any) =>
                            setNodeData({
                                ...nodeData,
                                elasticsearch_result_deal_code: codeValue,
                            })
                        }
                    />
                </Space>
                <Space direction="horizontal">
                    搜索工具直接回答：
                    <Switch
                        onChange={(checked) => {
                            setNodeData({
                                ...nodeData,
                                return_direct: checked,
                            })
                        }}
                        checked={nodeData.return_direct}
                        checkedChildren="直接回答"
                        unCheckedChildren="Agent回答"
                    />
                </Space>
                <Space direction="horizontal">
                    节点携带历史消息：
                    <Switch
                        onChange={(checked) => {
                            setNodeData({
                                ...nodeData,
                                node_carry_history_msg: checked,
                            })
                        }}
                        checked={nodeData.node_carry_history_msg}
                        checkedChildren="是"
                        unCheckedChildren="否"
                    />
                </Space>
                {/*可动态添加Input的自定义封装组件*/}
                <DynamicOutputVariable nodeData={nodeData} setNodeData={setNodeData}/>
            </Space>
        </div>
    );
};
