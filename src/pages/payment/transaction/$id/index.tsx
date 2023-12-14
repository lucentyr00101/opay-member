import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, message } from 'antd';
import { history } from 'umi';
import styles from './index.less';
import { useIntl } from 'umi';
import { fetchDeposit } from '@/services/ant-design-pro/deposit';
import { Divider } from 'antd';
import Cookies from 'universal-cookie';
import { removeCookies } from '@/global';
import { uploadScreenshot } from '@/services/ant-design-pro/payment';
import UploadedImage from '@/components/TransactionDetails/UploadedImage';
import { cancelDeposit } from '@/services/ant-design-pro/deposit';
import type { RouteComponentProps } from 'react-router';
import type { RouteParams } from '@/global';
import TransactionColumns from '@/components/TransactionDetails/TransactionColumns';
import AccountColumns from '@/components/TransactionDetails/AccountColumns';
import CryptoAccountColumns from '@/components/TransactionDetails/CryptoAccountColumns';

export interface CountdownTimer {
  minutes: number;
  seconds: number;
  timer: string;
}

export interface TransactionDetailsShape {
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
  [key: string]: any;
}

const TransactionDetails: React.FC<RouteComponentProps<RouteParams>> = ({ match }) => {
  const t = useIntl();
  const cookies = new Cookies();
  const fileRef = useRef<any>();
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetailsShape | undefined>(
    undefined,
  );
  const [receipt, setReceipt] = useState<File | undefined>();
  const [image, setImage] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(false);

  const getDeposit = useCallback(async () => {
    try {
      const res = await fetchDeposit({ id: match.params.id as string });
      setTransactionDetails(res.data);
    } catch (e) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isCryptoTransaction =
    !!transactionDetails?.withdrawal?.cryptoAddress &&
    !!transactionDetails?.withdrawal?.cryptoPayment &&
    !!transactionDetails?.withdrawal?.exchangeRate;

  const uploadFile = async () => {
    setLoading(true);
    const file = receipt;
    const newForm = new FormData();
    const depositId = match.params.id;
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
      await uploadScreenshot(newForm);
      await getDeposit();
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => {
    getDeposit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const merchantNo = cookies.get('code') || '';

  const closePreview = () => {
    fileRef.current.value = '';
    setShowUpload(false);
  };

  const isFileValid = (file: File) => {
    const fileName = file.name;
    const invalidChars = ['@', '/'];
    if (invalidChars.some((char) => fileName.includes(char))) {
      message.error(t.formatMessage({ id: 'invalidFilename' }));
      fileRef.current.value = '';
      return false;
    }
    return true;
  };

  const handleReceipt = (e: any) => {
    if (isFileValid(e.target.files[0])) {
      setReceipt(e.target.files[0]);
      setImage(URL.createObjectURL(e.target.files[0]) as any);
      setShowUpload(true);
    }
  };

  const handleSubmit = async () => {
    await uploadFile();
    closePreview();
  };

  const moveToPaymentOptions = async () => {
    await removeCookies();
    history.replace({ pathname: '/payment/options', query: { code: merchantNo } });
  };

  const handleCancelDeposit = async () => {
    const newForm = new FormData();
    const depositId = match.params.id;
    newForm.set(
      'depositUpdateParam',
      new Blob(
        [
          JSON.stringify({
            id: depositId,
            receipt: '',
            status: 'Cancelled',
          }),
        ],
        { type: 'application/json' },
      ),
    );
    await cancelDeposit(newForm);
    await getDeposit();
  };

  return (
    <div className={styles.detailsContainer}>
      <input ref={fileRef} type="file" accept="image/*" onInput={handleReceipt} hidden />
      <UploadedImage
        visible={showUpload}
        image={image}
        handleSubmit={handleSubmit}
        loading={loading}
        close={closePreview}
      />
      <TransactionColumns
        transactionType={isCryptoTransaction ? 'crypto' : 'bank'}
        transactionDetails={transactionDetails}
        getDeposit={getDeposit}
      />
      <Divider className={styles.divider} dashed />
      {!isCryptoTransaction && <AccountColumns transactionDetails={transactionDetails} />}
      {isCryptoTransaction && <CryptoAccountColumns transactionDetails={transactionDetails} />}
      <div className={styles.actions}>
        {transactionDetails?.status === 'In Progress' ? (
          <Button
            className={`${styles.button} ${styles.mb25}`}
            block
            type="primary"
            onClick={async () => fileRef?.current?.click()}
          >
            {t.formatMessage({ id: 'uploadSS' })}
          </Button>
        ) : (
          <Button
            className={`${styles.button} ${styles.mb25}`}
            block
            type="primary"
            onClick={moveToPaymentOptions}
          >
            {t.formatMessage({ id: 'backHome' })}
          </Button>
        )}
        {transactionDetails?.status === 'In Progress' ? (
          <Button
            className={styles.button}
            block
            type="primary"
            danger
            onClick={handleCancelDeposit}
          >
            {t.formatMessage({ id: 'Cancel' })}
          </Button>
        ) : (
          <Button
            className={styles.button}
            block
            type="primary"
            ghost
            onClick={() => history.replace('/payment/order')}
          >
            {t.formatMessage({ id: 'viewHistory' })}
          </Button>
        )}
      </div>
    </div>
  );
};

export default TransactionDetails;
