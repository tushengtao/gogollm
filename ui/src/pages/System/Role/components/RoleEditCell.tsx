import React, { useState } from "react";
import RoleMultipleSelect from './RoleMultipleSelect';
import services from '@/services/system/user';
import {Button, Popconfirm, Space} from "antd";
import {CloseCircleTwoTone, EditTwoTone} from '@ant-design/icons';

const { modifyUserRole } = services.UserRequest;

interface RoleEditCellProps {
    username: any;
    roles: any;
    actionRef: any;
}
// 表格内部格式化展示、 修改角色功能集成
const RoleEditCell: React.FC<RoleEditCellProps> = ({ username, roles,actionRef }) => {
    const [editing, setEditing] = useState(false);
    const [selectedRoles, setSelectedRoles] = useState<number[]>(roles.map((role: any) => role.id) || []);

    const startEdit = () => {
        setEditing(true);
    };

    const saveEdit = async () => {
        await modifyUserRole({ username }, { roles: selectedRoles });
        setEditing(false); // 完成编辑后关闭编辑模式
        // 重新加载
        if (actionRef.current) {
            actionRef.current?.reloadAndRest?.();
        }
    };
    const cancelEdit = () => {
        setEditing(false);
    };

    return editing ? (
        <div>
            <RoleMultipleSelect
                value={selectedRoles}
                onChange={setSelectedRoles}
            />
            <Space>
                <Popconfirm
                    title="确认修改?"
                    onConfirm={saveEdit}
                    okText="确定"
                    onCancel={cancelEdit}
                    cancelText="取消"
                >
                    <Button style={{marginLeft:"3px"}} size="small" type="primary">修改</Button>
                </Popconfirm>
                <CloseCircleTwoTone onClick={cancelEdit}/>
            </Space>
        </div>
    ) : (
        <div>
            {roles.map((role: { remark: any; }) => role.remark).join(', ')}
            <EditTwoTone style={{marginLeft:"5px"}} onClick={startEdit} />
        </div>
    );
};

export default RoleEditCell;
