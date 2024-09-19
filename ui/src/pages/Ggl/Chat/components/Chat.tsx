import React, { useEffect, useState } from 'react';
import { Layout, Button, List, message, Empty, Tag, Divider } from 'antd';
import { ProChat } from '@ant-design/pro-chat';
import chatbotImg from '@/assets/imgs/chatbot.png';
import { nanoid } from 'nanoid';
import { history } from '@umijs/max';
import rehypeRaw from "rehype-raw";
import services from '@/services/ggl/app';
import { formatDate } from "@/utils/format";
import { DeleteOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import GoBackIcon from "@/components/Icon/GoBackIcon";

const { chat, getUserAppSession, getUserChathistory, deleteAppSession } = services.AppRequest;
const { Sider, Content } = Layout;

export const Chat: React.FC<{ appId: number; name: string }> = ({ appId, name }) => {
    const [sessions, setSessions] = useState<API_App.ChatSession[]>([]);
    const [activeSessionId, setActiveSessionId] = useState('');
    const [initialChats, setInitialChats] = useState<any>(null);
    const [isSessionLoading, setIsSessionLoading] = useState(true);
    const [collapsed, setCollapsed] = useState(false);

    const createNewSession = async () => {
        try {
            const new_session_id = nanoid();
            setSessions([
                {
                    session_id: new_session_id,
                    session_name: '',
                    created_time: formatDate(new Date())
                },
                ...sessions,
            ]);
            setActiveSessionId(new_session_id);
            setInitialChats([]); // Reset initialChats to an empty array for new session
        } catch (error) {
            message.error('Failed to create a new session');
            console.error('Error creating new session:', error);
        }
    };

    const setNewSessionName = async (sessionId: string, newName: string) => {
        try {
            setSessions(prevSessions =>
                prevSessions.map(session =>
                    session.session_id === sessionId && session.session_name === ''
                        ? { ...session, session_name: newName }
                        : session
                )
            );
        } catch (error) {
            message.error('Failed to set new session name');
            console.error('Error setting new session name:', error)
        }
    }

    const truncateSessionNameString = (str: any, num: number) => {
        return str.length > num ? str.slice(0, num) + '...' : str;
    };

    const convertToSessionList = (dataList: API_App.ChatSession[]): API_App.ChatSession[] => {
        return dataList.map(item => ({
            session_id: item.session_id,
            session_name: item.session_name,
            created_time: formatDate(new Date(item.created_time))
        }));
    };

    const deleteSession = async (sessionId: string) => {
        try {
            await deleteAppSession({ session_id: sessionId });
            setSessions(prevSessions => prevSessions.filter(session => session.session_id !== sessionId));
            if (sessionId === activeSessionId) {
                setActiveSessionId('');
                setInitialChats(null); // Reset initialChats when deleting the active session
            }
        } catch (error) {
            message.error('Failed to delete session');
            console.error('Error deleting session:', error);
        }
    };

    useEffect(() => {
        getUserAppSession({ app_id: appId, user_id: "" }).then(resp => {
            setSessions(convertToSessionList(resp.data))
            setIsSessionLoading(false)
        })
    }, []);

    useEffect(() => {
        if (activeSessionId) {
            getUserChathistory({ app_id: appId, user_id: "", session_id: activeSessionId }).then(resp => {
                setInitialChats(resp.data);
            });
        }
    }, [activeSessionId]);

    return (
        <Layout>
            <Sider
                width={220}
                collapsed={collapsed}
                collapsedWidth={0}
                style={{
                    background: '#fff',
                    borderRight: '1px solid #e8e8e8',
                    transition: 'width 0.3s',
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginLeft: "30%", marginRight: "5%", marginTop: "10px", marginBottom: "10px" }}>
                    <Button type="primary" onClick={createNewSession} style={{ width: '60%' }}>
                        新建对话
                    </Button>
                    <Button icon={<GoBackIcon />} onClick={() => history.back()} />
                </div>
                <Divider style={{ marginBottom: 5, marginTop: 10 }}></Divider>

                <Tag bordered={false} color='blue' style={{ marginLeft: "5%" }}>
                    {name}
                </Tag>
                <Divider style={{ marginBottom: 0, marginTop: 10 }}></Divider>

                <List
                    dataSource={sessions}
                    loading={isSessionLoading}
                    renderItem={item => (
                        <List.Item
                            key={item.session_id}
                            onClick={() => {
                                if (item.session_id !== activeSessionId) {
                                    setActiveSessionId(item.session_id);
                                    setInitialChats(null);
                                }
                            }}
                            style={{
                                cursor: 'pointer',
                                padding: '10px 16px',
                                position: 'relative',
                                boxShadow: item.session_id === activeSessionId ? '0 4px 8px rgba(0, 0, 0, 0.1)' : 'none',
                                transition: 'box-shadow 0.3s',
                            }}
                        >
                            <List.Item.Meta
                                title={
                                    <span style={{ color: item.session_id === activeSessionId ? '#1890ff' : 'rgba(0, 0, 0, 0.85)' }}>
                                        {truncateSessionNameString(item.session_name, 15) || '|'}
                                    </span>
                                }
                                description={
                                    <span style={{ fontSize: '11px' }}>
                                        {item.created_time}
                                        <DeleteOutlined
                                            style={{
                                                position: 'absolute',
                                                right: 8,
                                                bottom: 8,
                                                fontSize: '14px',
                                                color: '#8e8f91',
                                                transition: 'color 0.3s',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.color = 'red';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.color = '#8e8f91';
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteSession(item.session_id);
                                            }}
                                        />
                                    </span>
                                }
                            />
                        </List.Item>
                    )}
                />
            </Sider>
            <Content style={{ padding: 0, minHeight: '100vh' }}>
                <Button
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={() => setCollapsed(!collapsed)}
                    style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000 }}
                />
                {activeSessionId ? (
                    initialChats ? (
                        <ProChat
                            markdownProps={{
                                rehypePlugins:[rehypeRaw as any]
                            }}
                            key={activeSessionId}
                            initialChats={initialChats}
                            request={async (messages) => {
                                setNewSessionName(activeSessionId, truncateSessionNameString(messages[messages.length - 1].content, 15))
                                const response = await chat(
                                    messages,
                                    appId,
                                    activeSessionId
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
                                                .then(({ done, value }) => {
                                                    if (done) {
                                                        controller.close();
                                                        return;
                                                    }
                                                    const chunk = decoder.decode(value, { stream: true });
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
                    ) : (
                        <ProChat loading={initialChats === null} />
                    )
                ) : (
                    <Empty
                        image={chatbotImg}
                        description="选择历史对话 or 新建对话"
                        style={{ color: 'rgba(0, 0, 0, 0.45)', marginTop: '22%' }}
                    />
                )}
            </Content>
        </Layout>
    );
};
