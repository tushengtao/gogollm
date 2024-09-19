import CreateDeptForm from '@/pages/System/Dept/components/CreateDeptForm';
import services from '@/services/system/dept';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import React, { useRef, useState } from 'react';

const { addDept, modifyDept, useDepts, getDepts, deleteDept } =
  services.DeptRequest;

/**
 * 添加部门
 * @param fields
 */
const handleAdd = async (fields: API_Dept.DeptReq) => {
  const hide = message.loading('正在添加');
  try {
    await addDept({ ...fields });
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
 *  删除部门
 * @param id
 */
const handleRemove = async (id: number) => {
  const hide = message.loading('正在删除');
  try {
    // 调用删除
    await deleteDept({ id: id });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};
export default () => {
  // 添加对话框状态
  const [createModalVisible, handleCreateModalVisible] =
    useState<boolean>(false);
  const { data: departmentsResp } = useDepts();
  // 将 treeData 打平为一维列表
  const flattenDepartments = (departments: any[]) => {
    let flatDepartments: any[] = [];
    departments.forEach((department) => {
      flatDepartments.push(department);

      if (department.children && department.children.length > 0) {
        flatDepartments = flatDepartments.concat(
          flattenDepartments(department.children),
        );
        delete department.children;
      }
    });
    return flatDepartments;
  };
  // 查找父级并返回其名称
  const findParentName = (
    depts: API_Dept.DeptInfo[],
    parentId: number | undefined,
  ): string => {
    for (const department of depts) {
      if (department.id === parentId) {
        return department.name;
      }
    }
    return '未找到';
  };
  const columns: ProColumns<API_Dept.DeptInfo>[] = [
    {
      title: '部门名称',
      dataIndex: 'name',
      key: 'name',
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
      title: '层级',
      dataIndex: 'level',
      key: 'level',
      hideInForm: true,
      hideInTable: true,
      hideInSearch: true,
    },

    {
      title: '负责人',
      dataIndex: 'leader',
      key: 'leader',
    },
    {
      title: '联系方式',
      dataIndex: 'phone',
      key: 'phone',
      hideInSearch: true,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      hideInSearch: true,
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
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      valueType: 'digit',
      hideInSearch: true,
      sorter: true,
      initialValue: 0,
    },
    {
      title: '上级',
      dataIndex: 'parent_id',
      hideInSearch: true,
      key: 'parent_id',
      width: 200,
      valueType: 'treeSelect',
      fieldProps: {
        treeData: departmentsResp?.data,
        treeNodeFilterProp: 'name',
        fieldNames: {
          label: 'name',
          value: 'id',
          children: 'children',
        },
      },
      render: (text, record) => {
        if (record.parent_id === null || record.parent_id === undefined) {
          return '无';
        } else {
          if (departmentsResp?.data === undefined) {
            return '未知';
          }
          const flattenDepts = flattenDepartments(
            JSON.parse(JSON.stringify(departmentsResp.data)),
          );
          return findParentName(flattenDepts, record.parent_id);
        }
      },
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
          编辑
        </a>,
      ],
    },
  ];
  const actionRef = useRef<ActionType>();
  return (
    <PageContainer
      // 隐藏容器header
      pageHeaderRender={false}
    >
      <ProTable<API_Dept.DeptInfo>
        columns={columns}
        actionRef={actionRef}
        request={async (params, sorter, filter) => {
          const { data, success } = await getDepts({
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
            const { success, data } = await modifyDept(
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
            await handleRemove(row.id);
          },
        }}
        rowKey="id"
        headerTitle=""
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => handleCreateModalVisible(true)}
            type="primary"
          >
            新建
          </Button>,
        ]}
      />
      <CreateDeptForm
        onCancel={() => handleCreateModalVisible(false)}
        modalVisible={createModalVisible}
      >
        <ProTable<API_Dept.DeptInfo, API_Dept.DeptReq>
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
      </CreateDeptForm>
    </PageContainer>
  );
};
