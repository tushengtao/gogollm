import { Modal } from 'antd';
import React, { PropsWithChildren } from 'react';

interface CreateUserFormProps {
  modalVisible: boolean;
  onCancel: () => void;
}

const CreateUserForm: React.FC<PropsWithChildren<CreateUserFormProps>> = (
  props,
) => {
  const { modalVisible, onCancel } = props;

  return (
    <Modal
      destroyOnClose
      title="添加用户"
      width={420}
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      {props.children}
    </Modal>
  );
};

export default CreateUserForm;
