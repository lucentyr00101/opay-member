import ProDescriptions from '@ant-design/pro-descriptions';
import type { FC } from 'react';
import type { TransactionDetailsShape } from '@/pages/payment/transaction/$id';
import styles from './index.less';
import { useIntl } from 'umi';

interface Props {
  transactionDetails: TransactionDetailsShape | undefined;
}

const CryptoAccountColumns: FC<Props> = ({ transactionDetails }) => {
  const t = useIntl();
  const bankColumns = [
    {
      title: t.formatMessage({ id: 'cryptoPayment' }),
      dataIndex: ['withdrawal', 'cryptoName'],
      copyable: true,
      ellipsis: true,
    },
    {
      title: t.formatMessage({ id: 'cryptoNetwork' }),
      dataIndex: ['withdrawal', 'cryptoNetwork'],
      copyable: true,
      ellipsis: true,
    },
    {
      title: t.formatMessage({ id: 'cryptoAddress' }),
      dataIndex: ['withdrawal', 'cryptoAddress'],
      copyable: true,
      ellipsis: true,
    },
    {
      title: t.formatMessage({ id: 'qrCode' }),
      dataIndex: ['withdrawal', 'cryptoAddressQrCode'],
      valueType: 'image',
      fieldProps: {
        width: 100,
        height: 100,
      },
    },
    {
      title: t.formatMessage({ id: 'topUpAmt' }),
      dataIndex: ['withdrawal', 'amount'],
      copyable: true,
      ellipsis: true,
      render: (dom: any) => {
        const { children: amount } = dom?.props;
        return amount.toFixed(2);
      },
    },
  ];

  const usdtAmount = (
    transactionDetails?.withdrawal?.amount * transactionDetails?.withdrawal?.exchangeRate
  ).toFixed(2);

  return (
    <>
      <ProDescriptions
        column={1}
        dataSource={transactionDetails}
        columns={bankColumns}
        labelStyle={{ color: '#000', fontSize: '18px', fontWeight: '700', width: 230 }}
        contentStyle={{ color: '#000', fontSize: '15px', fontWeight: '700', alignItems: 'center' }}
      />
      <div className={styles['amount-label']}>
        USDT {t.formatMessage({ id: 'amount' })}: {usdtAmount}
      </div>
      <div className={styles['crypto-notice']}>{t.formatMessage({ id: 'usdtNotice' })}</div>
    </>
  );
};

export default CryptoAccountColumns;
