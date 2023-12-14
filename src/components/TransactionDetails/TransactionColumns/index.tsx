import type { FC } from 'react';
import type { TransactionDetailsShape } from '@/pages/payment/transaction/$id';
import { useIntl } from 'umi';
import styles from '@/pages/payment/transaction/$id/index.less';
import Statuses from '@/components/TransactionDetails/Status';
import Timer from '@/components/Global/Timer';
import ProDescriptions from '@ant-design/pro-descriptions';

interface Props {
  transactionDetails: TransactionDetailsShape | undefined;
  getDeposit: () => void;
  transactionType: 'bank' | 'crypto';
}

const TransactionColumns: FC<Props> = ({ transactionDetails, getDeposit, transactionType }) => {
  const t = useIntl();

  const columns = [
    { title: t.formatMessage({ id: 'orderNo' }), dataIndex: ['withdrawal', 'orderId'] },
    {
      title: t.formatMessage({ id: 'paymentstatus' }),
      dataIndex: ['status'],
      render: (value: any) => <Statuses status={value} />,
      className: 'test',
    },
    { title: t.formatMessage({ id: 'creationTime' }), dataIndex: 'createdTime' },
  ];

  if (transactionDetails?.status === 'Rejected') {
    const item = {
      title: t.formatMessage({ id: 'reason' }),
      dataIndex: 'remark',
      render: (v: any) => <span style={{ color: '#E12727' }}>{v || '-'}</span>,
    };
    columns.splice(2, 0, item as any);
  }

  const inProgCols = [
    { title: t.formatMessage({ id: 'expiryTime' }), dataIndex: 'paymentExpiryTime' },
    {
      title: t.formatMessage({ id: 'paymentcountdown' }),
      render: (_: any, record: any) => (
        <Timer
          createdTime={record.createdTime}
          expiryTime={record.paymentExpiryTime}
          action={() => getDeposit()}
        />
      ),
    },
  ];

  const cancelledCols = [
    { title: t.formatMessage({ id: 'cancelTime' }), dataIndex: 'updatedTime' },
  ];

  const reviewSuccessRejectedCols = [
    { title: t.formatMessage({ id: 'paymenttime' }), dataIndex: 'updatedTime' },
  ];

  const columnsMapping = {
    'In Progress': inProgCols,
    'Under Review': reviewSuccessRejectedCols,
    Successful: reviewSuccessRejectedCols,
    Cancelled: cancelledCols,
    Rejected: reviewSuccessRejectedCols,
    Completed: reviewSuccessRejectedCols,
  };

  return (
    <>
      <ProDescriptions
        title={
          <span className={styles['detail-header']}>{t.formatMessage({ id: 'tranDetail' })}</span>
        }
        column={1}
        dataSource={transactionDetails}
        columns={columns}
        labelStyle={{ color: '#000', fontSize: '18px', fontWeight: '700', width: 230 }}
        contentStyle={{ color: '#000', fontSize: '15px', fontWeight: '700', alignItems: 'center' }}
      />
      {
        <>
          <ProDescriptions
            column={1}
            dataSource={transactionDetails}
            columns={columnsMapping[transactionDetails?.status as string]}
            labelStyle={{ color: '#000', fontSize: '18px', fontWeight: '700', width: 230 }}
            contentStyle={{
              color: '#000',
              fontSize: '15px',
              fontWeight: '700',
              alignItems: 'center',
            }}
          />
          {transactionDetails?.status === 'In Progress' && (
            <>
              <p className={styles.notice} style={{ textAlign: 'left', fontSize: '18px' }}>
                {t.formatMessage({ id: 'inProgres1' })}
                {transactionDetails?.withdrawal.paymentTimeLimit}
                {t.formatMessage({ id: 'inProgress1.1' })}
              </p>
              <p className={styles.notice} style={{ textAlign: 'left', fontSize: '18px' }}>
                {transactionType === 'bank'
                  ? t.formatMessage({ id: 'inProgress2bank' })
                  : t.formatMessage({ id: 'inProgress2crypto' })}
                {t.formatMessage({ id: 'inProgress3' })}
              </p>
            </>
          )}
          {transactionDetails?.status === 'Under Review' && (
            <p className={styles.notice} style={{ textAlign: 'left', fontSize: '16px' }}>
              {t.formatMessage({ id: 'inProgress4' })}
              <span className={styles['notice-highlight']}>{t.formatMessage({ id: 'cs' })}</span>
            </p>
          )}
          {['Cancelled', 'Rejected'].includes(transactionDetails?.status as string) && (
            <p className={styles.notice}>
              {t.formatMessage({ id: 'pleaseContact' })}
              <span className={styles['notice-highlight']}>{t.formatMessage({ id: 'cs' })}</span>
            </p>
          )}
        </>
      }
    </>
  );
};

export default TransactionColumns;
