import { Button, Modal, Progress, Row } from 'antd';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import styles from '@/pages/payment/transaction/index.less';

interface Props {
  image: any;
  visible: boolean;
  handleSubmit: () => void;
  loading: boolean;
  close: () => void;
}

const UploadedImage: FC<Props> = ({ image, visible, handleSubmit, loading, close }) => {
  const t = useIntl();
  const [progress, setProgress] = useState(0);
  const [interval, setProgressInterval] = useState(setInterval(() => {}));

  useEffect(() => {
    if (visible) {
      const increase = 20;
      const newInterval: NodeJS.Timer = setInterval(() => {
        setProgress((p) => p + increase);
      }, 1000);
      setProgressInterval(newInterval);
    } else {
      setProgress(0);
      clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  useEffect(() => {
    if (progress >= 100) clearInterval(interval);
  }, [progress, interval]);

  return (
    <Modal
      footer={false}
      width={685}
      centered
      visible={visible}
      closable={false}
      destroyOnClose
      onCancel={close}
    >
      <img src={image as any} height="100%" width="100%" alt="" />
      <Progress percent={progress} status={progress >= 100 ? 'success' : 'active'} />
      <Row justify="space-between">
        <Button
          className={styles.buttonActions}
          type="primary"
          onClick={() => handleSubmit()}
          disabled={progress < 100}
          loading={loading}
        >
          {t.formatMessage({ id: 'Done' })}
        </Button>
        <Button
          className={styles.buttonActions}
          danger
          type="primary"
          loading={loading}
          onClick={close}
        >
          {t.formatMessage({ id: 'Cancel' })}
        </Button>
      </Row>
    </Modal>
  );
};

export default UploadedImage;
