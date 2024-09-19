import React from "react";
import { TreeSelect } from "antd";
import services from '@/services/system/dept';

const { useDepts } = services.DeptRequest;

interface DeptSelectProps {
    value?: number | number[] | any;
    onChange?: (value: number | undefined) => void;
    mode?: 'single' | 'multiple'; // 新增 mode 属性
}

const DeptSelect: React.FC<DeptSelectProps> = ({ value, onChange, mode = 'single' }) => {
    const { data: departmentsResp } = useDepts();

    // 将原始数据转换为TreeSelect所需的格式
    // @ts-ignore
    const convertToTreeSelectData = (departments: any[] | undefined) => {
        return departments?.map((dept) => ({
            value: dept.id.toString(),
            title: dept.name,
            children: dept.children ? convertToTreeSelectData(dept.children) : undefined,
        })) || [];
    };

    const treeData = convertToTreeSelectData(departmentsResp?.data);

    return (
        <TreeSelect
            showSearch
            value={typeof value === 'number' ? value.toString() : value?.map((id: { toString: () => any; }) => id.toString())}
            placeholder="请选择部门"
            allowClear
            treeDefaultExpandAll
            onChange={(selectedValues) => {
                if (onChange) {
                    if (mode === 'multiple') {
                        // @ts-ignore
                        onChange(selectedValues.map((id: string) => parseInt(id, 10)));
                    } else {
                        // @ts-ignore
                        onChange(selectedValues ? parseInt(selectedValues, 10) : undefined);
                    }
                }
            }}
            treeData={treeData}
            multiple={mode === 'multiple'}
        />
    );
};

export default DeptSelect;