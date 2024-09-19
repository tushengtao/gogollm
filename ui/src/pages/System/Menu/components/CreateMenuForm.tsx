import { Modal } from 'antd';
import React, { PropsWithChildren } from 'react';

interface CreateMenuFormProps {
  modalVisible: boolean;
  onCancel: () => void;
}

const CreateMenuForm: React.FC<PropsWithChildren<CreateMenuFormProps>> = (
  props,
) => {
  const { modalVisible, onCancel } = props;

  return (
    <Modal
      destroyOnClose
      title="添加菜单"
      width={420}
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      {props.children}
    </Modal>
  );
};

export default CreateMenuForm;
