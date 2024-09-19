import DeptSelect from '@/pages/System/Dept/components/DeptSelect';
import RoleEditCell from '@/pages/System/Role/components/RoleEditCell';
import RoleMultipleSelect from '@/pages/System/Role/components/RoleMultipleSelect';
import deptServices from '@/services/system/dept';
import services from '@/services/system/user';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Divider, message } from 'antd';
import React, { useRef, useState } from 'react';
import CreateUserForm from './components/CreateUserForm';
import UpdateUserForm from './components/UpdateUserForm';

const { useDepts } = deptServices.DeptRequest;
const { addUser, queryUserList, deleteUser } = services.UserRequest;

/**
 * 添加用户
 * @param fields
 */
const handleAdd = async (fields: API_User.UserReq) => {
  const hide = message.loading('正在添加');
  try {
    await addUser({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 *  删除用户
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API_User.UserInfo[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  // 确保 selectedRows 是一个数组
  const rows = Array.isArray(selectedRows) ? selectedRows : [selectedRows];
  try {
    // 调用删除
    await Promise.all(
      rows.map((row) =>
        deleteUser({
          username: row.username,
        }),
      ),
    );
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

// 获取 更新表单列配置的函数，过滤掉角色和 密码

const TableList: React.FC<unknown> = () => {
  // 添加对话框状态
  const [createModalVisible, handleCreateModalVisible] =
    useState<boolean>(false);
  // 更新对话框状态
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<API_User.UserInfo[]>(
    [],
  );
  // 部门数据
  const { data: departmentsResp } = useDepts();

  const [updateRowState, setUpdateRowState] = useState<API_User.UserInfo>();

  const columns: ProColumns<API_User.UserInfo>[] = [
    {
      title: '用户名',
      dataIndex: 'username',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '用户名必填项',
          },
        ],
      },
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '部门名称',
      dataIndex: ['dept', 'id'],
      key: 'dept_id',
      valueType: 'treeSelect',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '部门必填项',
          },
        ],
      },
      fieldProps: {
        treeData: departmentsResp?.data,
        treeNodeFilterProp: 'name',
        fieldNames: {
          label: 'name',
          value: 'id',
          children: 'children',
        },
      },
      renderFormItem: (_, { type, defaultRender }, form) => {
        if (type === 'form') {
          return (
            <DeptSelect
                mode="single" // 或者 mode="multiple"
                value={form.getFieldValue('dept_id')}
                onChange={(value) => form.setFieldsValue({ dept_id: value })}
            />
          );
        }
        return defaultRender(_);
      },
      render: (text, record) => {
        return record.dept && record.dept.name ? record.dept.name : '未知';
      },
    },
    {
      title: '角色',
      dataIndex: 'roles',
      key: 'roles',
      hideInSearch: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '角色必填项',
          },
        ],
      },
      renderFormItem: (_, { type, defaultRender }) => {
        if (type === 'form') {
          return <RoleMultipleSelect />;
        }
        return defaultRender(_);
      },
      render: (text, record) => {
        return (
          <RoleEditCell
            username={record.username}
            roles={record.roles}
            actionRef={actionRef}
          />
        );
      },
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      valueType: 'text',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      valueType: 'text',
      hideInSearch: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '邮箱必填项',
          },
        ],
      },
    },
    {
      title: '后台登录',
      dataIndex: 'is_staff',
      key: 'is_staff',
      hideInSearch: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '是否后台登录必填项',
          },
        ],
      },
      valueEnum: {
        false: '否',
        true: '是',
      },
    },
    {
      title: '密码',
      dataIndex: 'password',
      valueType: 'text',
      hideInTable: true,
      hideInSearch: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '密码必填项',
          },
          {
            pattern: /^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]{6,18}$/,
            message: '密码长度为6-18位，必须由字母、数字组成',
          },
        ],
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              setUpdateRowState(record);
              handleUpdateModalVisible(true);
            }}
          >
            编辑
          </a>
          <Divider type="vertical" />
          <a
            onClick={async () => {
              const success = await handleRemove([record]);
              if (success) {
                if (actionRef.current) {
                  actionRef.current?.reloadAndRest?.();
                }
              }
            }}
          >
            删除
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
      <ProTable<API_User.UserInfo>
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
          const { data, success } = await queryUserList({
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

      <CreateUserForm
        onCancel={() => handleCreateModalVisible(false)}
        modalVisible={createModalVisible}
      >
        <ProTable<API_User.UserInfo, API_User.UserReq>
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
      </CreateUserForm>

      <UpdateUserForm
        onCancel={() => {
          handleUpdateModalVisible(false);
        }}
        modalVisible={updateModalVisible}
        initialValues={updateRowState}
        oldUserName={updateRowState?.username}
        actionRef={actionRef}
      ></UpdateUserForm>
    </PageContainer>
  );
};

export default TableList;
