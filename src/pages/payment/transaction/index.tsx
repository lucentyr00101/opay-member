import React from 'react';
import styles from './index.less';
import TransactionDetails from '@/components/TransactionDetails';

const Transaction: React.FC = () => {
  return (
    <div className={styles.paymentContainer}>
      <TransactionDetails />
    </div>
  );
};

export default Transaction;
