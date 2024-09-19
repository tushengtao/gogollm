import services from '@/services/ggl/app';
import {
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import React from 'react';

const { addApp } = services.AppRequest;
const CreateAppForm: React.FC<{ onFormSubmit: () => void }> = ({
  onFormSubmit,
}) => {
  const [form] = ProForm.useForm<API_App.AppReq>();

  return (
    <ProForm
      form={form}
      onFinish={async (values) => {
        await addApp(values);
        form.resetFields();
        onFormSubmit(); // 调用回调函数通知父组件 去刷新应用列表
        return true;
      }}
    >
      <ProFormText
        name="name"
        label="应用名称"
        rules={[{ required: true, message: '请输入应用名称!' }]}
      />
      <ProFormTextArea
        name="desc"
        label="应用描述"
        rules={[{ required: true, message: '请输入应用描述!' }]}
      />
      <ProFormSelect
        name="type"
        label="应用类型"
        rules={[{ required: true, message: '请选择应用类型!' }]}
        options={[
          { label: 'React Agent类型', value: 0 },
          { label: 'LLM With Tools类型', value: 1 },
          { label: 'Structured Chat Agent类型', value: 2 },

            // { label: '多智能体编排-TODO', value: 3 }
        ]}
      />
    </ProForm>
  );
};
export default CreateAppForm;
