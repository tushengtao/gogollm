import ChatTestIcon from '@/components/Icon/ChatTestIcon';
import {BranchNode} from '@/pages/Ggl/Flow/nodes/BranchNode';
import {ReactAgentNode} from '@/pages/Ggl/Flow/nodes/ReactAgentNode';
import services from '@/services/ggl/app';
import {LeftOutlined, PlusOutlined, SaveOutlined} from '@ant-design/icons';
import {ProChat} from '@ant-design/pro-chat';
import {
    CanvasLoading,
    FlowEditor,
    FlowPanel,
    Inspector,
    useFlowEditor,
} from '@ant-design/pro-flow';
import {uuid} from '@ant-design/pro-flow/es/FlowEditor/utils/uuid';
import {history} from '@umijs/max';
import {
    Alert,
    Button,
    Drawer,
    InputNumber,
    message,
    Popconfirm,
    Space,
    Switch,
    Tag,
} from 'antd';
import {useTheme} from 'antd-style';
import React, {useCallback, useEffect, useState} from 'react';
import './css/AppFlow.less';
import styles from './css/AppFlow.less';
import ErasableEdge from './edges/ErasableEdge';
import {ChatEntryNode} from './nodes/ChatEntryNode';
import {ChatModelNode} from './nodes/ChatModelNode';
import {CodeNode} from './nodes/CodeNode';
import {ElasticSearchAgentNode} from './nodes/ElasticSearchAgentNode';
import {HttpNode} from './nodes/HttpNode';
import Sidebar from './sidebar';
import {StructuredChatAgentNode} from "@/pages/Ggl/Flow/nodes/StructuredChatAgentNode";

const {modifyAppFlowData, getAppById, chatTest} = services.AppRequest;
// 节点类型
const nodeTypes = {
    HttpNode: HttpNode,
    ChatEntryNode: ChatEntryNode,
    ChatModelNode: ChatModelNode,
    CodeNode: CodeNode,
    ElasticSearchAgentNode: ElasticSearchAgentNode,
    BranchNode: BranchNode,
    ReactAgentNode: ReactAgentNode,
    StructuredChatAgentNode: StructuredChatAgentNode
};
// 边类型
const edgeTypes = {
    ErasableEdge: ErasableEdge,
};
const AppFlow: React.FC<{ appId: any }> = ({appId}) => {
    const editor = useFlowEditor();
    const theme = useTheme();
    const [openInspector, setOpenInspector] = useState(false);
    const [openFlowTestDrawer, setOpenFlowTestDrawer] = useState(false);
    const [appName, setAppName] = useState('');
    // 流式和非流式
    const [isStreaming, setIsStreaming] = useState(true);
    const [messageHistoryCount, setMessageHistoryCount] = useState(3);
    const [loading, setLoading] = useState(true);

    // 初始化节点数据
    useEffect(() => {
        getAppById({id: appId}).then((res: any) => {
            const flowData = res.data.flow_data;
            flowData.nodes.forEach((node: any) => {
                editor.addNode(node);
            });
            const initEdges: any = {};
            flowData.edges.forEach((edge: any) => {
                initEdges[edge.id] = edge;
            });
            // 注意：不能直接传入 边的数组
            editor.addEdges(initEdges);
            editor.screenToFlowPosition(flowData.viewport);
            setAppName(res.data.name);
            setLoading(false);
        });
    }, []);
    const onDragOver = useCallback(
        (event: {
            preventDefault: () => void;
            dataTransfer: { dropEffect: string };
        }) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'move';
        },
        [],
    );
    // 节点和节点连接之后的事件
    const afterConnectHandle = useCallback((edge: any) => {
        const modifiedEdge = {...edge, type: 'ErasableEdge'};
        editor.updateEdge(edge.id, modifiedEdge);
    }, []);
    const onDrop = useCallback(
        (event: {
            preventDefault: () => void;
            dataTransfer: { getData: (arg0: string) => any };
            clientX: any;
            clientY: any;
        }) => {
            event.preventDefault();
            if (!editor) return;
            let nodeData = event.dataTransfer.getData('application/reactflow');
            nodeData = JSON.parse(nodeData);
            if (typeof nodeData === 'undefined' || !nodeData) {
                return;
            }
            const position = editor.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });
            let newNode = {
                id: uuid(),
                type: nodeData.type,
                position,
                data: {
                    title: nodeData.title,
                },
            };
            editor.addNode(newNode);
        },
        [],
    );
    // 持久化flow data
    const saveFlowDataEnvent = async () => {
        const flow = editor.reactflow?.toObject();
        //  更新app接口
        await modifyAppFlowData({id: appId}, {flow_data: flow});
        message.success('保存成功');
    };
    const returnAppCenter = () => {
        history.back();
    };
    // 初始化完毕
    const onInited = () => {
    };
    return (
        <div className={styles.container}>
            {loading && (
                <CanvasLoading tip={'loading...'}>
                    <Alert showIcon message={'welcome'} description={'welcome'}/>
                    <Alert
                        showIcon
                        type={'error'}
                        message={'error'}
                        description={'error'}
                    />
                    <Alert
                        showIcon
                        type={'success'}
                        message={'success'}
                        description={'success'}
                    />
                    <Alert
                        showIcon
                        type={'warning'}
                        message={'warning'}
                        description={'warning'}
                    />
                </CanvasLoading>
            )}

            <FlowEditor
                nodeTypes={nodeTypes}
                afterConnect={afterConnectHandle}
                contextMenuEnabled={false}
                onNodesInit={onInited}
                flowProps={{
                    edgeTypes: edgeTypes,
                    onDrop,
                    onDragOver,
                    panOnDrag: true,
                    zoomActivationKeyCode: 'Control',
                    panOnScroll: false,
                    connectionLineStyle: {stroke: 'skyblue'},
                }}
                defaultViewport={{x: 0, y: 0, zoom: 0.9}}
                miniMap={true}
            >
                <FlowPanel position={'top-center'}>
                    <Tag bordered={false}>
                        <span style={{fontSize: '14px'}}>应用：{appName}</span>
                    </Tag>
                </FlowPanel>
                <FlowPanel position={'top-left'}>
                    {/* 返回应用中心页面 */}
                    <Popconfirm
                        autoAdjustOverflow={true}
                        placement="right"
                        title="提示："
                        description="保存了吗"
                        okText="保存"
                        cancelText="继续返回"
                        onConfirm={async () => {
                            await saveFlowDataEnvent().then(() => {
                                returnAppCenter();
                            });
                        }}
                        onCancel={returnAppCenter}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Button shape="circle" icon={<LeftOutlined/>} type="primary"/>
                    </Popconfirm>
                    {/* save 编排保存按钮*/}
                    <Button
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: '10px',
                        }}
                        onClick={saveFlowDataEnvent}
                        shape="circle"
                        type="primary"
                        icon={<SaveOutlined/>}
                    />
                </FlowPanel>
                <FlowPanel position="top-right" style={{display: 'flex'}}>
                    {/* 打开flow对话测试按钮 */}
                    <Button
                        onClick={() => {
                            setOpenFlowTestDrawer(true);
                        }}
                        type="text"
                        icon={<ChatTestIcon/>}
                    />
                    <Button
                        style={{
                            textAlign: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        onClick={() => setOpenInspector(true)}
                        shape="circle"
                        type="primary"
                        icon={<PlusOutlined/>}
                    />
                </FlowPanel>
                {/* 节点列表侧边栏 */}
                <Inspector
                    open={openInspector}
                    mask={false}
                    // onMouseLeave={() => setOpenInspector(false)}
                    onClose={() => setOpenInspector(false)}
                    width={300}
                >
                    <Sidebar/>
                </Inspector>

                {/* flow对话测试侧边栏 */}
                <Drawer
                    title={appName}
                    width={1000}
                    // size="large"
                    onClose={() => setOpenFlowTestDrawer(false)}
                    open={openFlowTestDrawer}
                    styles={{
                        body: {
                            padding: 0,
                        },
                    }}
                    extra={
                        <Space>
                            上下文对话轮数：
                            <InputNumber
                                min={1}
                                max={1000}
                                defaultValue={6}
                                step={1}
                                onChange={(value) => {
                                    if (value !== null) setMessageHistoryCount(value);
                                }}
                            />
                            <Switch
                                defaultChecked
                                onChange={(checked) => {
                                    setIsStreaming(checked);
                                }}
                                checkedChildren="流式"
                                unCheckedChildren="流式"
                            />
                        </Space>
                    }
                >
                    {/* flow 测试 对话 */}
                    <ProChat
                        style={{background: theme.colorBgLayout}}
                        request={async (messages) => {
                            const response = await chatTest(
                                messages,
                                appId,
                                editor.reactflow?.toObject(),
                                messageHistoryCount,
                                isStreaming,
                            );
                            if (response.body === null) {
                                return new Response('response.body is null');
                            }
                            const reader = response.body.getReader();
                            const decoder = new TextDecoder('utf-8');
                            const encoder = new TextEncoder();
                            const readableStream = new ReadableStream({
                                async start(controller) {
                                    function push() {
                                        reader
                                            .read()
                                            .then(({done, value}) => {
                                                if (done) {
                                                    controller.close();
                                                    return;
                                                }
                                                const chunk = decoder.decode(value, {stream: true});
                                                const message = chunk.replace('data: ', '');
                                                controller.enqueue(encoder.encode(message));
                                                push();
                                            })
                                            .catch((err) => {
                                                console.error('读取流中的数据时发生错误', err);
                                                controller.error(err);
                                            });
                                    }

                                    push();
                                },
                            });
                            return new Response(readableStream);
                        }}
                    />
                </Drawer>
            </FlowEditor>
        </div>
    );
};

export default AppFlow;
