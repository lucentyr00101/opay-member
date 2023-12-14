import React from 'react';
import { useIntl, history } from 'umi';
import { Table } from 'antd';
import styles from './index.less';
import Statuses from '@/components/TransactionDetails/Status';

interface Props {
  deposits: API.DepositItem[];
  pagination: any;
  loading: boolean;
}

const OrderTable: React.FC<Props> = ({ deposits, pagination, loading }) => {
  const t = useIntl();

  const viewDetails = (item: any) => {
    history.replace(`/payment/transaction/${item.id}`);
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      render: (text: any, record: any, index: any) => index + 1,
    },
    {
      title: t.formatMessage({ id: 'orderNo' }),
      dataIndex: ['withdrawal', 'orderId'],
    },
    {
      title: t.formatMessage({ id: 'creationTime' }),
      dataIndex: 'createdTime',
      valueType: 'date',
    },
    {
      title: t.formatMessage({ id: 'status' }),
      dataIndex: 'status',
      key: 'status',
      render: (value: string) => (
        <Statuses status={value} hasIcon={false} className={styles.noMargin} />
      ),
    },
    {
      title: t.formatMessage({ id: 'topupAmt' }),
      dataIndex: ['withdrawal', 'amount'],
    },
    {
      title: t.formatMessage({ id: 'cert' }),
      dataIndex: 'certificates',
      key: 'certificates',
      render: (_: string, item: object) => (
        <div>
          <span onClick={() => viewDetails(item)} className={styles.details}>
            {t.formatMessage({ id: 'details' })}
          </span>
        </div>
      ),
    },
  ];

  return (
    <>
      <Table loading={loading} columns={columns} dataSource={deposits} pagination={pagination} />
    </>
  );
};

export default OrderTable;
