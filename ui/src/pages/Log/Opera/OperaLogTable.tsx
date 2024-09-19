import React, { useRef, useState } from 'react';
import {ProColumns, ProTable, ActionType} from '@ant-design/pro-components';
import {Button, message, Popconfirm, Tooltip} from 'antd';
import services from '@/services/log/opera';
import {formatDate} from "@/utils/format";
import {DeleteOutlined} from "@ant-design/icons";
const { queryOperaLogList, deleteOperaLog, deleteAllOperaLog } = services.OperaRequest;

const OperaLogTable = () => {
    const actionRef = useRef<ActionType>();
    const [selectedRowsState, setSelectedRowsState] = useState<API_Opera.OperaInfo[]>([]);

    const columns: ProColumns<API_Opera.OperaInfo>[] = [
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: '请求类型',
            dataIndex: 'method',
            key: 'method',
        },
        // {
        //     title: '操作模块',
        //     dataIndex: 'title',
        //     key: 'title',
        // },
        {
            title: '请求路径',
            dataIndex: 'path',
            key: 'path',
        },
        {
            title: 'IP',
            dataIndex: 'ip',
            key: 'ip',
        },
        {
            title: '城市',
            dataIndex: 'city',
            key: 'city',
        },
        {
            title: 'User Agent',
            dataIndex: 'user_agent',
            key: 'user_agent',
            render: (_, entity) => (
                <Tooltip title={JSON.stringify(entity.user_agent, null, 2)}>
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {JSON.stringify(entity.user_agent)}
                    </div>
                </Tooltip>
            ),
            ellipsis: true,
            copyable: true,
        },
        {
            title: '操作系统',
            dataIndex: 'os',
            key: 'os',
        },
        {
            title: '浏览器',
            dataIndex: 'browser',
            key: 'browser',
        },
        {
            title: '请求参数',
            dataIndex: 'args',
            key: 'args',
            render: (_, entity) => (
                <Tooltip title={JSON.stringify(entity.args, null, 4)}>
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {JSON.stringify(entity.args)}
                    </div>
                </Tooltip>
            ),
            ellipsis: true,
            copyable: true,
        },
        {
            title: '操作状态',
            dataIndex: 'status',
            key: 'status',
            render: (_, entity) => (entity.status === 1 ? '正常' : '异常'),
        },
        {
            title: '状态码',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: '消息',
            dataIndex: 'msg',
            key: 'msg',
        },
        {
            title: '耗时',
            dataIndex: 'cost_time',
            key: 'cost_time',
            render: (_, entity) => `${entity.cost_time.toFixed(2)} ms`,
        },
        {
            title: '操作时间',
            dataIndex: 'opera_time',
            key: 'opera_time',
            render: (_, entity) => formatDate(new Date(entity.opera_time)),
        },
        {
            title: '操作',
            key: 'action',
            render: (_: any, record: { id: any; }) => (
                <Popconfirm
                    title="确定删除这条日志吗？"
                    onConfirm={() => handleRowDelete(record.id)}
                    okText="是"
                    cancelText="否"
                >
                    <a style={{color: 'red'}}><DeleteOutlined /></a>
                </Popconfirm>
            ),
        },
    ];
    const handleRowDelete = async (id: number) => {
            await deleteOperaLog({
                ids: [id],
            }).then(()=>{
                actionRef.current?.reload();
            })
    };

    const handleDelete = async (selectedRows: API_Role.RoleInfo[]) => {
        const hide = message.loading('正在删除');
        if (!selectedRows) return true;
        // 确保 selectedRows 是一个数组
        const rows = Array.isArray(selectedRows) ? selectedRows : [selectedRows];
        try {
            await deleteOperaLog({
                ids: rows.map((row) => row.id),
            });
            hide();
            actionRef.current?.reload();
            return true;
        } catch (error) {
            hide();
            message.error('删除失败，请重试');
            actionRef.current?.reload();
            return false;
        }
    };

    const handleDeleteAll = async () => {
        try {
            await deleteAllOperaLog().then(() => {
                    message.success('清空成功');
                    actionRef.current?.reload();
                }
            )
        } catch (error) {
            message.error('清空失败');
        }
    };

    const handleBatchDelete = async () => {
        if (selectedRowsState.length === 0) {
            message.warning('请选择要删除的日志');
            return;
        }
        await handleDelete(selectedRowsState);
        setSelectedRowsState([]);
    };

    return (
        <ProTable<API_Opera.OperaInfo>
            columns={columns}
            actionRef={actionRef}
            rowKey="id"
            request={async (params, sorter, filter) => {
                const { current, pageSize, ...queryParams } = params;
                const { data, success } = await queryOperaLogList({
                    ...params,
                    sorter,
                    filter,
                });
                return {
                    data: data?.items || [],
                    success: success,
                    total: data?.total,
                };
            }}
            rowSelection={{
                onChange: (_, selectedRows) => setSelectedRowsState(selectedRows),
            }}
            toolBarRender={() => [
                <Button key="delete" danger onClick={handleBatchDelete}>
                    批量删除
                </Button>,
                <Popconfirm
                    key="deleteAll"
                    title="确定清空所有日志吗？"
                    onConfirm={handleDeleteAll}
                    okText="是"
                    cancelText="否"
                >
                    <Button danger>清空日志</Button>
                </Popconfirm>,
            ]}
            search={{
                labelWidth: 'auto',
            }}
            options={{
                setting: {
                    listsHeight: 400,
                },
            }}
        />
    );
};

export default OperaLogTable;
