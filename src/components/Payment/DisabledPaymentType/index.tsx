import type { FC } from 'react';
import { Modal } from 'antd';

interface Props {
  visible: boolean;
  close: () => void;
}

const DisabledPaymentType: FC<Props> = ({ visible, close }) => {
  return (
    <Modal
      centered
      visible={visible}
      onCancel={close}
      cancelButtonProps={{ hidden: true }}
      onOk={close}
    >
      <span>You&apos;ve selected a disabled payment type.</span>
    </Modal>
  );
};

export default DisabledPaymentType;
