import {ProCard} from '@ant-design/pro-components';
import React, {DragEvent} from 'react';
import {Avatar} from "antd";
import HttpNodeIcon from "@/components/Icon/HttpNodeIcon";
import ChatEntryNodeIcon from "@/components/Icon/ChatEntryNodeIcon";
import ChatModelNodeIcon from "@/components/Icon/ChatModelNodeIcon";
import CodeNodeIcon from "@/components/Icon/CodeNodeIcon";
import ElasticSearchIcon from "@/components/Icon/ElasticSearchIcon";
import BranchNodeIcon from "@/components/Icon/BranchNodeIcon";
import ReactAgentNodeIcon from "@/components/Icon/ReactAgentNodeIcon";
import StructuredChatAgentNode from "@/components/Icon/StructuredChatAgentNodeIcon";

export default () => {
    const onDragStart = (event: DragEvent<HTMLDivElement>, nodeData: string) => {
        event.dataTransfer.setData('application/reactflow', nodeData);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div>
            <ProCard
                title="基础节点"
                ghost
                gutter={[10, 10]}
                wrap
                collapsible
                style={{maxWidth: 250}}
            >

                <ProCard
                    size="small"
                    style={{maxWidth: 230}}
                    bordered
                    boxShadow
                    draggable
                    onDragStart={(event) =>
                        onDragStart(
                            event,
                            JSON.stringify({
                                type: 'ChatEntryNode',
                                title: '问题入口',
                            }),
                        )
                    }
                >
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <ChatEntryNodeIcon/>
                        <span style={{marginLeft: 10, fontSize: 15}}>入口节点</span>
                    </div>

                </ProCard>
                <ProCard
                    size="small"
                    style={{maxWidth: 230}}
                    bordered
                    boxShadow
                    draggable
                    onDragStart={(event) =>
                        onDragStart(
                            event,
                            JSON.stringify({
                                type: 'HttpNode',
                                title: 'HTTP',
                            }),
                        )
                    }
                >
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <HttpNodeIcon/>
                        <span style={{marginLeft: 10, fontSize: 15}}>Http节点</span>
                    </div>
                </ProCard>


                <ProCard
                    size="small"
                    style={{maxWidth: 230}}
                    bordered
                    boxShadow
                    draggable
                    onDragStart={(event) =>
                        onDragStart(
                            event,
                            JSON.stringify({
                                type: 'ChatModelNode',
                                title: 'Chat模型',
                            }),
                        )
                    }
                >
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <ChatModelNodeIcon/>
                        <span style={{marginLeft: 10, fontSize: 15}}>Chat模型节点</span>
                    </div>
                </ProCard>

                <ProCard
                    size="small"
                    style={{maxWidth: 230}}
                    bordered
                    boxShadow
                    draggable
                    onDragStart={(event) =>
                        onDragStart(
                            event,
                            JSON.stringify({
                                type: 'CodeNode',
                                title: 'Code节点',
                            }),
                        )
                    }
                >
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <CodeNodeIcon/>
                        <span style={{marginLeft: 10, fontSize: 15}}>代码节点</span>
                    </div>

                </ProCard>

                <ProCard
                    size="small"
                    style={{maxWidth: 230}}
                    bordered
                    boxShadow
                    draggable
                    onDragStart={(event) =>
                        onDragStart(
                            event,
                            JSON.stringify({
                                type: 'ElasticSearchAgentNode',
                                title: 'ElasticSearch Agent',
                            }),
                        )
                    }
                >
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <ElasticSearchIcon/>
                        <span style={{marginLeft: 6, fontSize: 15}}>ElasticSearch智能体</span>
                    </div>

                </ProCard>

                <ProCard
                    size="small"
                    style={{maxWidth: 230}}
                    bordered
                    boxShadow
                    draggable
                    onDragStart={(event) =>
                        onDragStart(
                            event,
                            JSON.stringify({
                                type: 'BranchNode',
                                title: '条件节点',
                            }),
                        )
                    }
                >
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <BranchNodeIcon/>
                        <span style={{marginLeft: 6, fontSize: 15}}>条件节点</span>
                    </div>

                </ProCard>

                <ProCard
                    size="small"
                    style={{maxWidth: 230}}
                    bordered
                    boxShadow
                    draggable
                    onDragStart={(event) =>
                        onDragStart(
                            event,
                            JSON.stringify({
                                type: 'ReactAgentNode',
                                title: 'React Agent',
                            }),
                        )
                    }
                >

                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <ReactAgentNodeIcon/>
                        <span style={{marginLeft: 6, fontSize: 15}}>React智能体</span>
                    </div>

                </ProCard>

                <ProCard
                    size="small"
                    style={{maxWidth: 230}}
                    bordered
                    boxShadow
                    draggable
                    onDragStart={(event) =>
                        onDragStart(
                            event,
                            JSON.stringify({
                                type: 'StructuredChatAgentNode',
                                title: 'Structured Chat Agent',
                            }),
                        )
                    }
                >
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <StructuredChatAgentNode/>
                        <span style={{marginLeft: 6, fontSize: 15}}>Structured智能体</span>
                    </div>
                </ProCard>
            </ProCard>
        </div>
    );
};
