import React ,{FC, useState} from 'react';
import {Input, Space, InputNumber, Modal, Switch, Button} from 'antd';
import {DownOutlined, UpOutlined} from "@ant-design/icons";
import DynamicInputVariable from "@/pages/Ggl/Flow/components/DynamicInputVariable"
import DynamicOutputVariable from "@/pages/Ggl/Flow/components/DynamicOutputVariable"
import FullScreenEditIcon from "@/components/Icon/FullScreenEditIcon";
import GoGoLLMSelect from "@/pages/Ggl/Flow/components/GoGoLLMSelect";
import ToolSelectDrawer from "@/pages/Ggl/Flow/tools/ToolSelectDrawer";

import {LLM_MODELS} from "@/pages/Ggl/constants";
export const ChatModelNodeForm: FC<{
    nodeData: any,
    setNodeData: any
}> = ({nodeData, setNodeData}) => {
    const [isPromptModalVisible, setIsPromptModalVisible] = useState(false);
    const [isToolDrawerVisible, setIsToolDrawerVisible] = useState(false);

    return (
        <div>
            <Space direction="vertical" size="middle">
                {/*可动态添加Input的自定义封装组件*/}
                <DynamicInputVariable nodeData={nodeData} setNodeData={setNodeData} buttonName="添加输入变量"/>
                <Space direction="horizontal">
                    Temperature：
                    <InputNumber
                        value={nodeData.temperature.toFixed(2)} // 使用toFixed(1)来确保小数点后有一位数字
                        controls={{
                            upIcon: <UpOutlined onClick={() => {
                                if (nodeData.temperature >= 2) {
                                    return;
                                }
                                // 使用parseFloat来确保在进行数学运算时是正确的数值类型
                                const newTemperature = parseFloat((nodeData.temperature + 0.05).toFixed(2));
                                const newNodeData = {
                                    ...nodeData,
                                    temperature: newTemperature,
                                };
                                setNodeData(newNodeData);
                            }} style={{fontSize: '12px', color: '#1677ff'}}/>,
                            downIcon: <DownOutlined onClick={() => {
                                if (nodeData.temperature <= 0.05) {
                                    return;
                                }
                                const newTemperature = parseFloat((nodeData.temperature - 0.05).toFixed(2));
                                const newNodeData = {
                                    ...nodeData,
                                    temperature: newTemperature,
                                };
                                setNodeData(newNodeData);
                            }} style={{fontSize: '12px', color: '#1677ff'}}/>,
                        }}
                        defaultValue={0.95}
                        min={0.05}
                        max={1}
                        stringMode
                        style={{width: 250, height: 35}}
                    />
                </Space>
                <Space direction="horizontal">
                    Prompt：
                    <Input name={'prompt'} style={{marginBottom: "10px", width: '250px', cursor: 'pointer'}}
                           suffix={<span onClick={() => {
                               setIsPromptModalVisible(true);
                           }}><FullScreenEditIcon/></span>}
                           value={nodeData.prompt}
                           placeholder="可自定义变量{{question}}"
                           onChange={e => {
                               setNodeData({
                                   ...nodeData,
                                   prompt: e.target.value,
                               });
                           }}/>
                    <Modal
                        title="编辑Prompt"
                        open={isPromptModalVisible}
                        onOk={() => {
                            setIsPromptModalVisible(false);
                        }}
                        onCancel={() => {
                            setIsPromptModalVisible(false);
                        }}
                    >
                        <Input.TextArea
                            autoSize={true}
                            value={nodeData.prompt}
                            onChange={e => {
                                setNodeData({
                                    ...nodeData,
                                    prompt: e.target.value,
                                });
                            }}
                            rows={4}
                        />
                    </Modal>
                </Space>
                <Space direction="horizontal">
                    Model：
                    <GoGoLLMSelect
                        width={300}
                        options={LLM_MODELS}
                        placeholder="选择LLM"
                        defaultValue={nodeData.model_name || 'gpt-4'}
                        onChange={(label:any, value: any) => {
                            setNodeData({
                                ...nodeData,
                                model_label:label,
                                model_name: value
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
                    工具：
                    <Button onClick={() => setIsToolDrawerVisible(true)}>选择/查看</Button>
                    <ToolSelectDrawer
                        nodeData={nodeData}
                        setNodeData={setNodeData}
                        visible={isToolDrawerVisible}
                        onClose={() => setIsToolDrawerVisible(false)}
                    />
                </Space>
                <Space direction="horizontal">
                    携带历史消息：
                    <Switch
                        onChange={(checked) => {
                            setNodeData({
                                ...nodeData,
                                node_carry_history_msg: checked,
                                only_carry_human_history_msg: false
                            })
                        }}
                        checked={nodeData.node_carry_history_msg}
                        checkedChildren="是"
                        unCheckedChildren="否"
                    />
                </Space>
                {nodeData.node_carry_history_msg && (
                    <Space direction="horizontal">
                        仅携带用户历史消息：
                        <Switch
                            onChange={(checked) => {
                                setNodeData({
                                    ...nodeData,
                                    only_carry_human_history_msg: checked,
                                })
                            }}
                            checked={nodeData.only_carry_human_history_msg}
                            checkedChildren="是"
                            unCheckedChildren="否"
                        />
                    </Space>
                )}
                <Space direction="horizontal">
                    保存当前消息：
                    <Switch
                        onChange={(checked) => {
                            setNodeData({
                                ...nodeData,
                                save_current_conversation: checked,
                            })
                        }}
                        checked={nodeData.save_current_conversation}
                        checkedChildren="是"
                        unCheckedChildren="否"
                    />
                </Space>
                {/*可动态添加Input的自定义封装组件*/}
                <DynamicOutputVariable nodeData={nodeData} setNodeData={setNodeData} buttonName="添加输出变量和解析"/>

            </Space>


        </div>
    )
};
