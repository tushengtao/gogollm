import menuServices from '@/services/system/menu';
import services from '@/services/system/role';
import { Button, Drawer, message, Space, TreeSelect, Typography } from 'antd';
import React, { PropsWithChildren, useEffect, useState } from 'react';
const { modifyRoleMenus, getRoleMenus } = services.RoleRequest;
const { useMenus } = menuServices.MenuRequest;

const { Text } = Typography;
interface UpdateRoleFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  updateRow?: API_Role.RoleInfo;
  actionRef: any;
}

// 辅助函数：格式化菜单数据为 TreeSelect 组件所需格式
const formatMenuData = (menus: Array<API_Menu.MenuInfo>): any => {
  return menus.map((menu) => ({
    title: menu.title,
    value: menu.id,
    key: menu.id,
    children: menu.children ? formatMenuData(menu.children) : null,
  }));
};

const UpdateRoleForm: React.FC<PropsWithChildren<UpdateRoleFormProps>> = (
  props,
) => {
  const { data: allMenusResp } = useMenus();
  const { modalVisible, onCancel, updateRow, actionRef } = props;
  const [treeData, setTreeData] = useState([]);

  const [value, setValue] = useState(Array<any>());

  const handleSubmit = async () => {
    const hide = message.loading('正在修改');
    try {
      const menus = value.map((item) => item.value);
      await modifyRoleMenus(
        {
          id: updateRow?.id,
        },
        {
          menus: menus,
        },
      );
      hide();
      message.success('修改成功');
      onCancel();

      if (actionRef.current) {
        actionRef.current?.reloadAndRest?.();
      }
      return true;
    } catch (error) {
      hide();
      message.error('修改失败请重试！');
      return false;
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  // roleMenus 是包含嵌套子菜单的菜单数据
  const getAllChildIds = (menu: { id: any; children: any[] }): any => {
    // 使用 reduce 来累加所有子节点的 ID，包括当前节点的 ID
    return [
      menu.id,
      ...(menu.children?.reduce(
        (acc, child) => [...acc, ...getAllChildIds(child)],
        [],
      ) || []),
    ];
  };

  const addAllChildIds = (roleMenus: any[]) => {
    // 使用 reduce 来累加所有菜单及其子菜单的 ID
    return roleMenus.reduce(
      (acc, menu) => [...acc, ...getAllChildIds(menu)],
      [],
    );
  };

  useEffect(() => {
    if (updateRow?.id && allMenusResp?.data) {
      getRoleMenus({ id: updateRow.id }).then((resp) => {
        // 提取已有权限的菜单id
        const roleMenus = resp.data;
        const selectedKeys = addAllChildIds(roleMenus);
        setValue(selectedKeys);
      });
      const formattedMenus = formatMenuData(allMenusResp.data);
      setTreeData(formattedMenus);
    }
  }, [updateRow?.id]);

  // 当选择项变化时触发
  const onChange = (selectedKeys: any) => {
    setValue(selectedKeys);
  };

  return (
    <Drawer
      maskClosable={false}
      title="更新角色菜单"
      placement="right"
      width={700}
      onClose={handleCancel}
      open={modalVisible}
      extra={
        <Space>
          <Button onClick={handleCancel}>取消</Button>
          <Button type="primary" onClick={handleSubmit}>
            保存
          </Button>
        </Space>
      }
    >
      <Text type="danger" mark style={{ marginBottom: 40 }}>
        勾选 子选项 后，请务必将其所有关联的 父选项 也勾选上！
        <br />
        <br />
      </Text>
      <TreeSelect
        treeDefaultExpandAll={true}
        treeData={treeData}
        allowClear={true}
        value={value}
        listHeight={650}
        onChange={onChange}
        treeCheckable={true}
        treeCheckStrictly={true}
        labelInValue={false}
        showCheckedStrategy={TreeSelect.SHOW_ALL}
        placeholder="请选择角色权限"
        style={{ width: '100%' }}
      />
    </Drawer>
  );
};

export default UpdateRoleForm;
