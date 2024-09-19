import services from '@/services/system/role';
import { Select } from 'antd';
import React from "react";
const { useRoles } = services.RoleRequest;
const { Option } = Select;

const RoleMultipleSelect: React.FC<{
  value?: number[];
  onChange?: (value: number[]) => void;
}> = ({ value, onChange }) => {
  const {data:rolesResp} = useRoles();
  return (
    <Select
      mode="multiple"
      placeholder="请选择角色"
      value={value}
      onChange={onChange}
    >
      {rolesResp?.data?.map((role) => (
        <Option key={role.id} value={role.id}>
          {role.remark}
        </Option>
      ))}
    </Select>
  );
};

export default RoleMultipleSelect;
