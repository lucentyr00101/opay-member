import React, { useEffect, useState } from 'react';
import { Button, Empty, Row } from 'antd';
import styles from './index.less';
import Order from '@/components/Order';
import OrderTable from '@/components/Order/table';
import cardIcon from '@/assets/cardIcon.svg';
import cardIconActive from '@/assets/cardIconActive.svg';
import tableIcon from '@/assets/tableIcon.svg';
import tableIconActive from '@/assets/tableIconActive.svg';
import { fetchDeposits } from '@/services/ant-design-pro/deposit';
import Cookies from 'universal-cookie';
import type { TablePaginationConfig } from 'antd/lib/table';

const Payment: React.FC = () => {
  const cookies = new Cookies();
  const [viewAs, setViewAs] = useState('card');

  const [loading, setLoading] = useState(false);
  const [deposits, setDeposits] = useState<API.DepositItem[]>([]);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
  });

  const handleSetViewAs = (value: string) => {
    setViewAs(value);
  };

  const containerClassName = () => {
    let className = styles.paymentContainer;
    className += viewAs === 'table' ? ` ${styles.ordersTable}` : '';
    return className;
  };

  const fetchDepositList = async (values: any) => {
    setLoading(true);
    const { pageSize: size, current: page } = values;
    const filter: any = {
      size,
      page: page - 1,
      memberUsername: cookies.get('username'),
    };
    const res = await fetchDeposits(filter);
    setDeposits(res.data);
    setPagination({
      pageSize: size,
      total: res.total,
      current: page,
    });
    setLoading(false);
    return res;
  };

  useEffect(() => {
    fetchDepositList({ pageSize: 10, current: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={containerClassName()}>
      <Row justify="end" className={styles.maxWidth}>
        <Button
          className={`${styles.buttonIcon} ${styles.mr5}`}
          onClick={() => handleSetViewAs('card')}
        >
          <img src={viewAs === 'card' ? cardIconActive : cardIcon} alt="" />
        </Button>
        <Button className={styles.buttonIcon} onClick={() => handleSetViewAs('table')}>
          <img src={viewAs === 'table' ? tableIconActive : tableIcon} alt="" />
        </Button>
      </Row>
      {viewAs === 'card' ? (
        deposits.length ? (
          deposits.map((deposit, index) => {
            return (
              <Order
                id={index + 1}
                recordId={deposit.id}
                key={deposit.id}
                orderNumber={deposit.withdrawal.orderId}
                creationTime={deposit.createdTime}
                topup={deposit.withdrawal.amount}
                status={deposit.status}
              />
            );
          })
        ) : (
          <Empty className={styles.empty} image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )
      ) : (
        <OrderTable loading={loading} deposits={deposits} pagination={pagination} />
      )}
    </div>
  );
};

export default Payment;
