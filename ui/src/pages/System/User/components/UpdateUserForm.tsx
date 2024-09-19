import DeptSelect from '@/pages/System/Dept/components/DeptSelect';
import services from '@/services/system/user';
import {Button, Form, Input, message, Modal, Select} from 'antd';
import React, { PropsWithChildren, useEffect } from 'react';
import {ProFormSelect} from "@ant-design/pro-components";
const { modifyUser } = services.UserRequest;

interface UpdateUserFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  initialValues?: API_User.UserInfo;
  oldUserName?: string;
  actionRef: any;
}

const UpdateUserForm: React.FC<PropsWithChildren<UpdateUserFormProps>> = (
  props,
) => {
  const { modalVisible, onCancel, initialValues, oldUserName, actionRef } =
    props;
  const [form] = Form.useForm();
  const handleSubmit = async () => {
    const result = await form.validateFields();
    const hide = message.loading('正在修改');
    try {
      await modifyUser({ username: oldUserName }, result);
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
    form.resetFields();
  };
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues]);

  return (
    <Modal
      destroyOnClose
      title="更新用户"
      width={420}
      open={modalVisible}
      onCancel={handleCancel}
      footer={null}
    >
      <Form form={form} initialValues={initialValues} layout="vertical">
        <Form.Item
          name="username"
          label="用户名"
          rules={[{ required: true, message: '用户名是必填项' }]}
        >
          <Input placeholder="请输入用户名" />
        </Form.Item>
        <Form.Item name="nickname" label="昵称">
          <Input placeholder="请输入昵称" />
        </Form.Item>
        <Form.Item name="email" label="邮箱">
          <Input placeholder="请输入邮箱" />
        </Form.Item>
        <Form.Item name="is_staff" label="后台登录">
          <Select
              options={[
                {
                  value: true,
                  label: '是',
                },
                {
                  value: false,
                  label: '否',
                },
              ]}
          />
        </Form.Item>
        <Form.Item name="dept_id" label="部门">
          <DeptSelect
            value={initialValues?.dept_id}
            onChange={(value: any) => form.setFieldsValue({ dept_id: value })}
          />
        </Form.Item>
        <Form.Item name="phone" label="手机号">
          <Input placeholder="请输入手机号" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleSubmit}>
            提交
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateUserForm;
