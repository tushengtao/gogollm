import CreateRoleForm from '@/pages/System/Role/components/CreateRoleForm';
import UpdateRoleForm from '@/pages/System/Role/components/UpdateRoleForm';
import services from '@/services/system/role';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Divider, message } from 'antd';
import React, { useRef, useState } from 'react';

const { addRole, batchDeleteRoles, queryRoles, modifyRole } =
  services.RoleRequest;

/**
 * 添加角色
 * @param fields
 */
const handleAdd = async (fields: API_Role.RoleReq) => {
  const hide = message.loading('正在添加');
  try {
    await addRole({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

const TableList: React.FC<unknown> = () => {
  // 添加对话框状态
  const [createModalVisible, handleCreateModalVisible] =
    useState<boolean>(false);
  // 更新对话框状态
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [updateRowState, setUpdateRowState] = useState<API_Role.RoleInfo>();

  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<API_Role.RoleInfo[]>(
    [],
  );
  const handleRemove = async (selectedRows: API_Role.RoleInfo[]) => {
    const hide = message.loading('正在删除');
    if (!selectedRows) return true;
    // 确保 selectedRows 是一个数组
    const rows = Array.isArray(selectedRows) ? selectedRows : [selectedRows];
    try {
      await batchDeleteRoles({
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

  const columns: ProColumns<API_Role.RoleInfo>[] = [
    {
      title: '角色名称',
      dataIndex: 'name',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '名称必填项',
          },
        ],
      },
    },
    {
      title: '数据权限',
      dataIndex: 'data_scope',
      hideInSearch: true,
      valueEnum: {
        1: '全部数据权限',
        2: '自定义数据权限',
      },
    },

    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        0: '禁用',
        1: '启用',
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      hideInSearch: true,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text, record, _, action) => (
        <>
          <a
            key="editable"
            onClick={() => {
              action?.startEditable?.(record.id);
            }}
          >
            编辑
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              setUpdateRowState(record);
              handleUpdateModalVisible(true);
            }}
          >
            设置权限
          </a>
        </>
      ),
    },
  ];

  return (
    <PageContainer
      // 隐藏容器header
      pageHeaderRender={false}
    >
      <ProTable<API_Role.RoleInfo>
        headerTitle=""
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => [
          <Button
            key="1"
            type="primary"
            onClick={() => handleCreateModalVisible(true)}
          >
            添加
          </Button>,
        ]}
        request={async (params, sorter, filter) => {
          const { data, success } = await queryRoles({
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
        editable={{
          type: 'single',
          onSave: async (key, row) => {
            const { success, data } = await modifyRole(
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
          onDelete: async (key, row) => {
            await batchDeleteRoles({
              ids: [row.id],
            });
          },
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              项&nbsp;&nbsp;
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}

      <CreateRoleForm
        onCancel={() => handleCreateModalVisible(false)}
        modalVisible={createModalVisible}
      >
        <ProTable<API_Role.RoleInfo, API_Role.RoleReq>
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
          columns={columns}
        />
      </CreateRoleForm>
      <UpdateRoleForm
        onCancel={() => {
          handleUpdateModalVisible(false);
        }}
        modalVisible={updateModalVisible}
        updateRow={updateRowState}
        actionRef={actionRef}
      ></UpdateRoleForm>
    </PageContainer>
  );
};

export default TableList;
