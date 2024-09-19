import React, {useState, useEffect} from 'react';
import {history} from '@umijs/max';
import {PageContainer, ProCard} from '@ant-design/pro-components';
import {Button, Flex, Modal, Tabs, TabsProps, message, Typography, Spin, Form, Input, Select} from 'antd';
import {CopyOutlined, DeleteOutlined, EditOutlined} from '@ant-design/icons';
import CreateAppForm from "./components/CreateAppForm";
import WorkFlowIcon from "@/components/Icon/WorkFlowIcon";
import VerticalLineIcon from "@/components/Icon/VerticalLineIcon";
import "./css/index.less"
import services from '@/services/ggl/app';
import DeptSelect from "@/pages/System/Dept/components/DeptSelect";

const {getUserAllApp, deleteApp, modifyAppBasicInfo, getAppShareDepts} = services.AppRequest;
const CenterPage: React.FC = () => {
    const {Paragraph} = Typography;
    const [userAllApp, setUserAllApp] = useState<API_App.UserAllApp>();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [currentApp, setCurrentApp] = useState<API_App.App | null>(null);
    const [isSpinning, setIsSpinning] = useState(true);
    const [form] = Form.useForm();

    const fetchApps = async () => {
        try {
            await getUserAllApp().then(resp => {
                setUserAllApp(resp.data)
                setIsSpinning(false)
            });
        } catch (error) {
            message.error('获取apps错误')
        }
    };

    const deleteAppById = async (e: any, id: number) => {
        deleteApp({id: id}).then(() => {
            message.success("删除成功")
            fetchApps();
        });
    }

    const handleFormSubmit = () => {
        try {
            message.success("添加成功")
            setIsModalVisible(false);
            fetchApps();
        } catch (error) {
            message.error('添加app错误')
        }
    };

    const handleEditFormSubmit = async (values: any) => {
        if (currentApp) {
            const {name, desc, type, dept_ids} = values;
            await modifyAppBasicInfo({
                app_id: currentApp.id,
                name,
                desc,
                type,
                dept_ids
            }).then(() => {
                message.success("修改成功");
                setIsEditModalVisible(false);
                fetchApps();
            }).catch(() => {
                message.error('修改app错误');
            });
        }
    };

    useEffect(() => {
        fetchApps();
    }, []);

    const jumpToAppFlow = (app: API_App.App) => {
        history.push('/app/flow', app.id);
    }

    const jumpToAppChat = (app: API_App.App) => {
        history.push('/app/chat',{id: app.id, name: app.name});
    }

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            message.success('复制成功');
        } catch (error) {
            message.error('复制失败');
        }
    };
    const renderAppCard = (app: API_App.App) => (
        <ProCard
            style={{maxWidth: 350, cursor: 'pointer', padding:0,paddingBlockEnd: 0}}
            key={app.id}
            title={<Paragraph>{app.name}</Paragraph>}
            tooltip={app.desc}
            boxShadow
            onClick={() => {
                jumpToAppChat(app)
            }}
            extra={<Button type="text" icon={<WorkFlowIcon/>} onClick={() => {
                jumpToAppFlow(app)
            }}></Button>}
            actions={[
                <div key={'actions'}
                     onClick={async (e) => {
                         e.stopPropagation();
                         setCurrentApp(app);
                         await getAppShareDepts({id: app.id}).then((res) => {
                             app.share_depts = res.data;
                         })
                         form.setFieldsValue({
                             name: app.name,
                             desc: app.desc,
                             type: app.type,
                             dept_ids: app.share_depts?.map(dept => dept.id)
                         });
                         setIsEditModalVisible(true);
                     }}
                >
                    <EditOutlined style={{height: 20}}
                                  key="EditOutlined"
                                  onMouseEnter={(e) => {
                                      e.currentTarget.style.color = '#1890ff';
                                  }}
                                  onMouseLeave={(e) => {
                                      e.currentTarget.style.color = '#5F5F5F';
                                  }}
                    />
                </div>
                ,
                <div key={"VerticalLineIcon"}
                     style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                    <VerticalLineIcon />
                </div>
                ,
                <div
                    key={'delete'}
                    onClick={(e) => {
                        e.stopPropagation();
                        deleteAppById(e, app.id);
                    }}
                >
                    <DeleteOutlined style={{height: 20}}
                                    key="delete"
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = 'red';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = '#5F5F5F';
                                    }}

                    />
                </div>

            ]}
        >
            <Paragraph
                style={{cursor: 'pointer'}}
            >
                {app.desc}
                <Button
                    type="text"
                    style={{color: '#a29e9e'}}
                    size={'small'}
                    icon={<CopyOutlined/>}
                    onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(app.desc);
                    }}
                >
                </Button>
            </Paragraph>

        </ProCard>
    );

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: '个人空间',
            children: <Flex wrap="wrap" gap="middle">
                {userAllApp?.owner_apps.map(renderAppCard)}
            </Flex>
        },
        {
            key: '2',
            label: '共享空间',
            children: <Flex wrap="wrap" gap="middle">
                {userAllApp?.share_apps.map(renderAppCard)}
            </Flex>,
        }
    ];

    return (
        <PageContainer
            ghost
            pageHeaderRender={false}
        >
            <div>
                <Flex justify="flex-end">
                    <Button type="primary" onClick={() => {
                        setIsModalVisible(true)
                    }}>
                        创建应用
                    </Button>
                </Flex>
                <Tabs
                    defaultActiveKey="1"
                    items={items}
                    centered
                />
            </div>
            {/* 创建应用的模态框 */}
            <Modal title="创建应用" open={isModalVisible} footer={null}
                   onCancel={() => {
                       setIsModalVisible(false)
                   }}
            >
                <CreateAppForm onFormSubmit={handleFormSubmit}/>
            </Modal>
            {/* 编辑应用的模态框 */}
            <Modal title="编辑应用" open={isEditModalVisible} footer={null}
                   onCancel={() => {
                       setIsEditModalVisible(false)
                   }}
            >
                <Form form={form} onFinish={handleEditFormSubmit}>
                    <Form.Item name="name" label="应用名称" rules={[{required: true}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name="desc" label="应用描述">
                        <Input.TextArea/>
                    </Form.Item>
                    <Form.Item name="type" label="应用类型" rules={[{ required: true }]}>
                        <Select
                            options={[
                                    { label: 'React Agent类型', value: 0 },
                                    { label: 'LLM With Tools类型', value: 1 },
                                    { label: 'Structured Chat Agent类型', value: 2 }]}
                        />
                    </Form.Item>
                    <Form.Item name="dept_ids" label="共享部门">
                        <DeptSelect
                            mode="multiple"
                            value={form.getFieldValue("dept_ids")}
                            onChange={(value: any) => form.setFieldsValue({dept_id: value})}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            提交
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh'}}>
                <Spin spinning={isSpinning} size="large"/>
            </div>
        </PageContainer>
    );
};

export default CenterPage;
