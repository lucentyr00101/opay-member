import ProDescriptions from '@ant-design/pro-descriptions';
import type { FC } from 'react';
import type { TransactionDetailsShape } from '@/pages/payment/transaction/$id';
import { useIntl } from 'umi';

interface Props {
  transactionDetails: TransactionDetailsShape | undefined;
}

const TransactionAccountColumns: FC<Props> = ({ transactionDetails }) => {
  const t = useIntl();
  const bankColumns = [
    {
      title: t.formatMessage({ id: 'bankName' }),
      dataIndex: ['withdrawal', 'bankName'],
      copyable: true,
      ellipsis: true,
    },
    {
      title: t.formatMessage({ id: 'accName' }),
      dataIndex: ['withdrawal', 'accountName'],
      copyable: true,
      ellipsis: true,
    },
    {
      title: t.formatMessage({ id: 'bankNo' }),
      dataIndex: ['withdrawal', 'accountNo'],
      copyable: true,
      ellipsis: true,
    },
    {
      title: t.formatMessage({ id: 'topUpAmt' }),
      dataIndex: ['withdrawal', 'amount'],
      copyable: true,
      ellipsis: true,
    },
  ];

  return (
    <ProDescriptions
      column={1}
      dataSource={transactionDetails}
      columns={bankColumns}
      labelStyle={{ color: '#000', fontSize: '18px', fontWeight: '700', width: 230 }}
      contentStyle={{ color: '#000', fontSize: '15px', fontWeight: '700', alignItems: 'center' }}
    />
  );
};

export default TransactionAccountColumns;
