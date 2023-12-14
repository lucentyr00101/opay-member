import React, { useEffect, useState, useRef } from 'react';
import { Button, Modal, Row, Progress, notification, Tooltip } from 'antd';
import { history } from 'umi';
import styles from './index.less';
import Status from './Status';
import copyImage from '@/assets/copy.svg';
import Cookies from 'universal-cookie';
import { uploadScreenshot } from '@/services/ant-design-pro/payment';
import { useIntl } from 'umi';

export interface CountdownTimer {
  minutes: number;
  seconds: number;
  timer: string;
}

interface TransactionDetailsShape {
  orderId: string;
  status: string;
  accountName: string;
  accountNo: string;
  amount: number;
  bankAddress: string;
  bankName: string;
  createdTime: string;
  id: string;
  paymentTimeLimit: number;
  expiryTime: string;
}

const TransactionDetails: React.FC = () => {
  const t = useIntl();
  const cookies = new Cookies();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [interval, setProgressInterval] = useState(setInterval(() => {}));
  const [hasUploaded, setHasUploaded] = useState(false);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const [receipt, setReceipt] = useState<File | undefined>();
  // const [receiptInput, setReceiptInput] = useState(null);
  const [image, setImage] = useState({ image: '' });
  const fileRef = useRef<any>();
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetailsShape>({
    orderId: '',
    status: '',
    accountName: '',
    accountNo: '',
    amount: 0,
    bankAddress: '',
    bankName: '',
    createdTime: '',
    id: '',
    paymentTimeLimit: 0,
    expiryTime: '',
  });

  useEffect(() => {
    if (isModalVisible) {
      const increase = 20;
      const newInterval: NodeJS.Timer = setInterval(() => {
        setProgress((p) => p + increase);
      }, 1000);
      setProgressInterval(newInterval);
    }
  }, [isModalVisible]);

  useEffect(() => {
    if (progress >= 100) clearInterval(interval);
  }, [progress, interval]);

  const uploadFile = async () => {
    const file = receipt;
    const newForm = new FormData();
    const depositId = cookies.get('withdrawalData').depositId;
    console.log(depositId);
    newForm.set('file', file as unknown as string);
    newForm.set(
      'depositUpdateParam',
      new Blob(
        [
          JSON.stringify({
            id: depositId,
            receipt: '',
          }),
        ],
        { type: 'application/json' },
      ),
    );
    try {
      const res = await uploadScreenshot(newForm);
      history.replace(`/payment/transaction/${res.data.id}`);
    } catch (e) {}
  };

  const handleDoneModal = async () => {
    setHasUploaded(true);
    await uploadFile();
    setIsModalVisible(false);
  };

  const triggerInput = () => {
    fileRef?.current?.click();
  };

  const handleCancelModal = () => {
    fileRef.current.value = '';
    setProgress(0);
    setIsModalVisible(false);
    setReceipt(undefined);
  };

  const handleSecondaryButton = () => {
    if (hasUploaded) {
      history.replace('/order');
    } else {
      setIsConfirmationVisible(true);
    }
  };

  const handlePrimaryButton = () => {
    if (hasUploaded) {
      history.replace('/');
    } else {
      triggerInput();
    }
  };

  // const handleOk = () => {
  //   setIsModalVisible(false);
  // };

  // const handleCancel = () => {
  //   setIsModalVisible(false);
  // };

  const handleReceipt = (e: any) => {
    console.log(e.target);
    setReceipt(e.target.files[0]);
    setImage(URL.createObjectURL(e.target.files[0]) as any);
    setIsModalVisible(true);
    // const reader = new FileReader();
    // // reader.onload = (event: any) => {
    // //   console.log(event.target.result);
    // //   setImage({ image: event.target.result } as any);
    // //   showModal();
    // // };
    // // reader.readAsDataURL(e.target.files[0]);
  };

  const timer = (length: number) => {
    let minutes = 0;
    let seconds = length;

    if (length > 0) {
      if (length > 60) {
        minutes = Math.floor(length / 60);
        seconds = Math.abs(minutes * 60 - length);
      }

      if (seconds === 0) {
        minutes -= 1;
        seconds = 59;
      }

      const minuteTxt = minutes.toString().length === 2 ? minutes : `0${minutes}`;
      const secondTxt = seconds.toString().length === 2 ? seconds : `0${seconds}`;

      return {
        minutes,
        seconds: seconds - 1,
        timer: `00:${minuteTxt}:${secondTxt}`,
      } as CountdownTimer;
    }
  };

  const [timeLeft, setTimeLeft] = useState<any>(timer(0));

  const transformData = () => {
    const withdrawalData: TransactionDetailsShape = cookies.get('withdrawalData');
    console.log(withdrawalData);
    setTransactionDetails(withdrawalData);
  };

  useEffect(() => {
    setTimeout(() => {
      setTimeLeft(
        timer(
          timeLeft !== undefined
            ? timeLeft.minutes * 60 + timeLeft.seconds
            : transactionDetails.paymentTimeLimit * 60,
        ),
      );
    }, 1000);
  });

  useEffect(() => {
    transformData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openNotification = () => {
    notification.success({
      message: `Copied to clipboard!`,
      description: '',
      placement: 'bottom',
    });
  };

  const handleCopy = (value: any) => {
    navigator.clipboard.writeText(value);
    openNotification();
  };

  return (
    <div className={styles.detailsContainer}>
      <h3 className={styles.detailsTitle}>{t.formatMessage({ id: 'tranDetail' })}</h3>

      <div className={styles.detailsWrapper}>
        <div className={styles.details}>
          <span className={styles.detailsLabel}>{t.formatMessage({ id: 'orderNum' })}</span>
          <span className={styles.detailsValue}>{transactionDetails.orderId}</span>
        </div>
        <div className={styles.details}>
          <span className={styles.detailsLabel}>{t.formatMessage({ id: 'paymentStatus' })}</span>
          <span className={styles.detailsValue}>
            <Status status={transactionDetails.status} />
          </span>
        </div>
        <div className={styles.details}>
          <span className={styles.detailsLabel}>{t.formatMessage({ id: 'createTime' })}</span>
          <span className={styles.detailsValue}>{transactionDetails.createdTime}</span>
        </div>
        <div className={styles.details}>
          <span className={styles.detailsLabel}>{t.formatMessage({ id: 'paymentTime' })}</span>
          <span className={styles.detailsValue}>{transactionDetails.expiryTime}</span>
        </div>

        {!hasUploaded && (
          <div className={styles.details}>
            <span className={styles.detailsLabel}>
              {t.formatMessage({ id: 'paymentCountdown' })}
            </span>
            <span className={styles.detailsValue}>
              {timeLeft !== undefined ? timeLeft.timer : '00:00:00'}
            </span>
          </div>
        )}
      </div>

      <p className={styles.detailsNote}>
        Your recharge order will be reviewed and processed within 10 minutes. Please check
        carefully. If there is a problem, please contact the customer service
      </p>
      <div className={styles.detailsDivider} />

      <div className={styles.detailsWrapper}>
        <h3 className={styles.detailsBankLabel}>Please Transfer To This Bank Card:</h3>
        <div className={styles.details}>
          <span className={styles.detailsLabel}>{t.formatMessage({ id: 'bankName' })}</span>
          <span className={styles.detailsValue}>{transactionDetails.bankName}</span>
          <Tooltip placement="topLeft" title="Copy Text" arrowPointAtCenter={true}>
            <button onClick={() => handleCopy('Banco del Bajio')} className={styles.copyBtn}>
              <img src={copyImage} alt="copy" />
            </button>
          </Tooltip>
        </div>

        <div className={styles.details}>
          <span className={styles.detailsLabel}>{t.formatMessage({ id: 'accName' })}</span>
          <span className={styles.detailsValue}>{transactionDetails.accountName}</span>
          <Tooltip placement="topLeft" title="Copy Text" arrowPointAtCenter={true}>
            <button onClick={() => handleCopy('Paul Theroux')} className={styles.copyBtn}>
              <img src={copyImage} alt="copy" />
            </button>
          </Tooltip>
        </div>

        <div className={styles.details}>
          <span className={styles.detailsLabel}>{t.formatMessage({ id: 'bankNo' })}</span>
          <span className={styles.detailsValue}>{transactionDetails.accountNo}</span>
          <Tooltip placement="topLeft" title="Copy Text" arrowPointAtCenter={true}>
            <button onClick={() => handleCopy(12345678954321)} className={styles.copyBtn}>
              <img src={copyImage} alt="copy" />
            </button>
          </Tooltip>
        </div>

        <div className={styles.details}>
          <span className={styles.detailsLabel}>{t.formatMessage({ id: 'amt' })}</span>
          <span className={`${styles.detailsValue} ${styles.detailsValuePrice}`}>
            {transactionDetails.amount.toFixed(2)}
          </span>
          <Tooltip placement="topLeft" title="Copy Text" arrowPointAtCenter={true}>
            <button onClick={() => handleCopy('500.00')} className={styles.copyBtn}>
              <img src={copyImage} alt="copy" />
            </button>
          </Tooltip>
        </div>
      </div>

      <div className={styles.actions}>
        <Button
          className={`${styles.button} ${styles.mb25}`}
          block
          type="primary"
          onClick={() => handlePrimaryButton()}
        >
          {hasUploaded ? t.formatMessage({ id: 'backHome' }) : t.formatMessage({ id: 'uploadSS' })}
        </Button>
        <Button
          className={styles.button}
          block
          type="primary"
          ghost={hasUploaded}
          danger={!hasUploaded}
          onClick={() => handleSecondaryButton()}
        >
          {hasUploaded ? t.formatMessage({ id: 'viewHistory' }) : t.formatMessage({ id: 'Cancel' })}
        </Button>
        <input ref={fileRef} type="file" accept="image/*" onInput={handleReceipt} hidden />
      </div>
      <Modal footer={false} width={685} centered visible={isModalVisible} closable={false}>
        <img src={image as any} height="100%" width="100%" alt="" />
        <Progress percent={progress} status={progress >= 100 ? 'success' : 'active'} />
        <Row justify="space-between">
          <Button
            className={styles.buttonActions}
            type="primary"
            onClick={() => handleDoneModal()}
            disabled={progress < 100}
          >
            {t.formatMessage({ id: 'Done' })}
          </Button>
          <Button
            className={styles.buttonActions}
            danger
            type="primary"
            onClick={() => handleCancelModal()}
          >
            {t.formatMessage({ id: 'Cancel' })}
          </Button>
        </Row>
      </Modal>
      <Modal footer={false} width={300} centered visible={isConfirmationVisible} closable={false}>
        <Row justify="space-between">
          <p>Are you sure you want to cancel this transaction?</p>
        </Row>
        <Row justify="end">
          <Button
            className={styles.mr}
            type="default"
            onClick={() => setIsConfirmationVisible(false)}
            size="middle"
          >
            {t.formatMessage({ id: 'No' })}
          </Button>
          <Button type="primary" size="middle" onClick={() => history.replace('/')}>
            {t.formatMessage({ id: 'Yes' })}
          </Button>
        </Row>
      </Modal>
    </div>
  );
};

export default TransactionDetails;
