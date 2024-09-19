import { Modal } from 'antd';
import React, { PropsWithChildren } from 'react';

interface CreateRoleFormProps {
  modalVisible: boolean;
  onCancel: () => void;
}

const CreateRoleForm: React.FC<PropsWithChildren<CreateRoleFormProps>> = (
  props,
) => {
  const { modalVisible, onCancel } = props;

  return (
    <Modal
      destroyOnClose
      title="添加角色"
      width={420}
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      {props.children}
    </Modal>
  );
};

export default CreateRoleForm;
