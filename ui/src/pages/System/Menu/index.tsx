import CreateMenuForm from '@/pages/System/Menu/components/CreateMenuForm';
import services from '@/services/system/menu';
import {DeleteOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons';
import type {ActionType, ProColumns} from '@ant-design/pro-components';
import {PageContainer, ProTable} from '@ant-design/pro-components';
import {Button, message, Modal, Tag} from 'antd';
import React, {useRef, useState} from 'react';

const {getMenus, deleteMenu, addMenu, useMenus, modifyMenu} = services.MenuRequest;

/**
 * 添加菜单
 * @param fields
 */
const handleAdd = async (fields: API_Menu.MenuReq) => {
    const hide = message.loading('正在添加');
    try {
        await addMenu({...fields});
        hide();
        message.success('添加成功');
        return true;
    } catch (error) {
        hide();
        message.error('添加失败请重试！');
        return false;
    }
};


export default () => {
    const {data: menusResp} = useMenus();
    // 添加对话框状态
    const [createModalVisible, handleCreateModalVisible] =
        useState<boolean>(false);
    const actionRef = useRef<ActionType>();


    const handleRemove = async (id: number) => {
        const hide = message.loading('正在删除');
        try {
            // 调用删除
            await deleteMenu({id: id});
            hide();
            message.success('删除成功');
            actionRef.current?.reload();

            return true;
        } catch (error) {
            hide();
            message.error('删除失败，请重试');
            return false;
        }
    };

    const columns: ProColumns<API_Menu.MenuInfo>[] = [
        {
            title: '父级',
            dataIndex: 'parent_id',
            hideInSearch: true,
            hideInTable: true,
            key: 'parent_id',
            valueType: 'treeSelect',
            formItemProps: {
                initialValue: null
            },
            fieldProps: {
                treeData: menusResp?.data,
                treeNodeFilterProp: 'name',
                fieldNames: {
                    label: 'title',
                    value: 'id',
                    children: 'children',
                },
            },
        },
        {
            title: '菜单标题',
            dataIndex: 'title',
            key: 'title',
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: '标题必填项',
                    },
                ],
            },
        },
        {
            title: '菜单名称',
            dataIndex: 'name',
            hideInSearch: true,
            key: 'name',
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: '名称必填项',
                    },
                ],
            }
        },
        {
            title: '菜单类型',
            dataIndex: 'menu_type',
            key: 'menu_type',
            hideInSearch: true,
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: '菜单类型必填项',
                    },
                ],
            },
            valueEnum: {
                0: '目录',
                1: '菜单',
                2: '按钮',
            },
            render: (text, record) => {
                let color;
                switch (record.menu_type) {
                    case 0:
                        color = 'purple';
                        break;
                    case 1:
                        color = 'cyan';
                        break;
                    case 2:
                        color = 'blue';
                        break;
                    default:
                        color = 'default';
                }
                return <Tag color={color}>{text}</Tag>;
            },
        },

        {
            title: '路由路径',
            dataIndex: 'path',
            hideInSearch: true,
            key: 'path',
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: '路由路径必填项',
                    },
                ],
            },
        },
        {
            title: '组件路径',
            dataIndex: 'component',
            hideInSearch: true,
            key: 'component',
        },

        {
            title: '权限标识',
            dataIndex: 'perms',
            key: 'perms',
            hideInSearch: true,
        },
        {
            title: '备注',
            dataIndex: 'remark',
            hideInSearch: true,
            hideInTable: true,
            hideInForm: true,
            valueType: 'text',
            key: 'remark',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: '状态必填项',
                    },
                ],
            },
            valueEnum: {
                0: '禁用',
                1: '启用',
            },
        },
        {
            title: '是否缓存',
            dataIndex: 'cache',
            key: 'cache',
            hideInSearch: true,
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: '是否缓存必填项',
                    },
                ],
            },
            valueEnum: {
                0: '否',
                1: '是',
            },
        },
        {
            title: '是否显示',
            dataIndex: 'show',
            key: 'show',
            hideInSearch: true,
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: '是否缓存必填项',
                    },
                ],
            },
            valueEnum: {
                0: '否',
                1: '是',
            },
        },
        {
            title: '排序',
            dataIndex: 'sort',
            key: 'sort',
            valueType: 'digit',
            hideInSearch: true,
            sorter: true,
            initialValue: 0,
        },
        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            render: (text, record, _, action) => [
                <a
                    key="editable"
                    onClick={() => {
                        action?.startEditable?.(record.id);
                    }}
                >
                    <EditOutlined/>
                </a>,
                <a
                    key="editable"
                    style={{color: 'red'}}
                    onClick={async () => {
                        Modal.confirm({
                            title: '确认删除',
                            content: '您确定要删除吗？',
                            okText: '确认',
                            cancelText: '取消',
                            onOk: async ()=> {
                                await handleRemove(record.id);
                            }
                        });
                    }}
                >
                    <DeleteOutlined/>
                </a>,
            ],
        },
    ];
    return (
        <PageContainer
            // 隐藏容器header
            pageHeaderRender={false}
        >
            <ProTable<API_Menu.MenuInfo>
                columns={columns}
                actionRef={actionRef}
                request={async (params, sorter, filter) => {
                    const {data, success} = await getMenus({
                        ...params,
                        sorter,
                        filter,
                    });
                    return {
                        data: data || [],
                        success: success,
                    };
                }}
                editable={{
                    type: 'single',
                    onSave: async (key, row) => {
                        const {success, data} = await modifyMenu(
                            {
                                id: row.id,
                            },
                            row,
                        );
                        if (success) {
                            actionRef.current?.reload();
                        }
                        return data;
                    },
                    onCancel: async (key, row) => {
                        actionRef.current?.cancelEditable(key);
                        actionRef.current?.reload();
                    },
                    actionRender: (row, config, dom) => [dom.save, dom.cancel],
                }}

                rowKey="id"
                headerTitle=""
                toolBarRender={() => [
                    <Button
                        key="button"
                        icon={<PlusOutlined/>}
                        onClick={() => handleCreateModalVisible(true)}
                        type="primary"
                    >
                        新建
                    </Button>,
                ]}
            />
            <CreateMenuForm
                onCancel={() => handleCreateModalVisible(false)}
                modalVisible={createModalVisible}
            >
                <ProTable<API_Menu.MenuInfo, API_Menu.MenuReq>
                    onSubmit={async (value) => {
                        const success = await handleAdd(value);
                        if (success) {
                            handleCreateModalVisible(false);
                            if (actionRef.current) {
                                actionRef.current.reload();
                            }
                        }
                    }}
                    rowKey="id"
                    type="form"
                    form={{
                        layout: 'horizontal',
                    }}
                    columns={columns}
                />
            </CreateMenuForm>
        </PageContainer>
    );
};
