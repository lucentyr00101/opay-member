import React from 'react';
import { useIntl } from 'umi';
import styles from './index.less';
import Statuses from '@/components/TransactionDetails/Status';
import { history } from 'umi';

export interface OrderProps {
  id: number;
  orderNumber: string;
  creationTime: number;
  topup: string;
  status: string;
  recordId: string;
}

const Order: React.FC<OrderProps> = ({
  id,
  orderNumber,
  creationTime,
  status,
  topup,
  recordId,
}) => {
  const t = useIntl();

  return (
    <div className={styles.detailsContainer}>
      <div className={styles.details}>
        <span className={styles.detailsLabel}>#</span>
        <span className={styles.detailsValue}>{id}</span>
      </div>
      <div className={styles.details}>
        <span className={styles.detailsLabel}>{t.formatMessage({ id: 'orderNo' })}</span>
        <span className={styles.detailsValue}>{orderNumber}</span>
      </div>
      <div className={styles.details}>
        <span className={styles.detailsLabel}>{t.formatMessage({ id: 'creationTime' })}</span>
        <span className={styles.detailsValue}>{creationTime}</span>
      </div>
      <div className={styles.details}>
        <span className={styles.detailsLabel}>{t.formatMessage({ id: 'status' })}</span>
        <span className={styles.detailsValue}>
          <Statuses status={status} hasIcon={false} className={styles.smallFont} />
        </span>
      </div>
      <div className={styles.details}>
        <span className={styles.detailsLabel}>{t.formatMessage({ id: 'topupAmt' })}</span>
        <span className={styles.detailsValue}>{topup}</span>
      </div>
      <div className={styles.details}>
        <span className={styles.detailsLabel}>{t.formatMessage({ id: 'cert' })}</span>
        <span
          className={styles.detailsValue}
          style={{ color: '#1890FF', fontWeight: 500 }}
          onClick={() => history.replace(`/payment/transaction/${recordId}`)}
        >
          {t.formatMessage({ id: 'details' })}
        </span>
      </div>
    </div>
  );
};

export default Order;
