import services from '@/services/system/menu';
import { TreeSelect } from 'antd';
import React from 'react';
const { useMenus } = services.MenuRequest;

interface MenuItem {
  id: number;
  title: string;
  children?: MenuItem[];
}

interface TreeSelectItem {
  value: string;
  title: string;
  children?: TreeSelectItem[];
}

const MenuSelect: React.FC<{
  value?: number;
  onChange?: (value: number) => void;
}> = ({ value, onChange }) => {
  const { data: menusResp } = useMenus();

  const convertToTreeSelectData = (menus: MenuItem[] | undefined): TreeSelectItem[] => {
    if (!menus) return [];
    return menus.map((menu) => ({
      value: menu.id.toString(),
      title: menu.title,
      children: menu.children
          ? convertToTreeSelectData(menu.children)
          : undefined,
    }));
  };

  const treeData = convertToTreeSelectData(menusResp?.data);

  return (
      <TreeSelect
          showSearch
          value={value}
          placeholder="请选择菜单"
          allowClear
          treeDefaultExpandAll
          onChange={onChange}
          treeData={treeData}
      />
  );
};

export default MenuSelect;