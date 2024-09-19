import { Modal } from 'antd';
import React, { PropsWithChildren } from 'react';

interface CreateDeptFormProps {
  modalVisible: boolean;
  onCancel: () => void;
}

const CreateDeptForm: React.FC<PropsWithChildren<CreateDeptFormProps>> = (
  props,
) => {
  const { modalVisible, onCancel } = props;

  return (
    <Modal
      destroyOnClose
      title="添加部门"
      width={420}
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      {props.children}
    </Modal>
  );
};

export default CreateDeptForm;
