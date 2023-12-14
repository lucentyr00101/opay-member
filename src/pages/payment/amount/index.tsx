import React, { useEffect, useState } from 'react';
import { Button, message } from 'antd';
import { history } from 'umi';
import Amounts from '@/components/Payment/Amounts';
import styles from './index.less';
// import alipayImg from '../../assets/alipay.png';
import { getMemberAmounts, getMemberDetails, addDeposit } from '@/services/ant-design-pro/payment';
import Cookies from 'universal-cookie';
import type { RouteComponentProps } from 'react-router';
import type { RouteParams } from '@/global';
import { useIntl } from 'umi';

const Payment: React.FC<RouteComponentProps<RouteParams>> = () => {
  const t = useIntl();
  const cookies = new Cookies();

  const [amountsList, setAmountsList] = useState<(string | number)[]>([]);

  const [amount, setAmount] = useState<any>();

  const merchantNo = cookies.get('code');

  const back = () => history.replace({ pathname: '/payment/options', query: { code: merchantNo } });

  const selectAmount = (selectedAmount: any) => {
    cookies.set('withdrawalId', selectedAmount.id, { path: '/' });
    setAmount(selectedAmount);
  };

  const goToTransaction = async () => {
    const data = {
      withdrawalId: amount.id,
      merchantId: cookies.get('merchantId'),
      memberId: cookies.get('memberId'),
      receipt: null,
      remark: null,
    };
    try {
      const res = await addDeposit(data);
      cookies.set('amount', amount.amount.toFixed(2), { path: '/' });
      cookies.set(
        'withdrawalData',
        {
          ...res.data.withdrawal,
          createdTime: res.data.createdTime,
          expiryTime: res.data.expiryTime,
          depositId: res.data.id,
        },
        { path: '/' },
      );
      history.replace({ pathname: `/payment/transaction/${res.data.id}` });
    } catch (e: any) {
      message.error(e?.data?.message || 'Something went wrong.');
    }
  };

  const handleGetAmounts = async () => {
    // const { data: authUser } = await getAuth();
    const username = cookies.get('username');
    const { data: details } = await getMemberDetails(username);
    cookies.set('merchantId', details.merchant.id, { path: '/' });
    cookies.set('memberId', details.id, { path: '/' });
    const merchantId = details.merchant.id;
    const memberId = details.id;
    const paymentTypeTag = cookies.get('paymentType').tag;
    const { data: amounts } = await getMemberAmounts({ merchantId, memberId, paymentTypeTag });

    setAmountsList([...amounts]);
  };

  useEffect(() => {
    handleGetAmounts();
    const fetchAmountInterval = setInterval(() => handleGetAmounts(), 5000);
    return () => clearInterval(fetchAmountInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const paymentTypeUrl = (cookies.get('paymentType') && cookies.get('paymentType').logo) || '';

  return (
    <div className={styles.paymentContainer}>
      <div className={styles.paymentSelected}>
        <span className={styles.paymentLabel}>{t.formatMessage({ id: 'selectedMethod' })}:</span>
        <img src={paymentTypeUrl} style={{ width: '80px' }} alt="" />
      </div>

      <div className={styles.amountWrapper}>
        <span className={styles.paymentLabel}>{t.formatMessage({ id: 'selectAmount' })}:</span>

        <Amounts amounts={amountsList} selectAmount={selectAmount} selectedAmount={amount} />
      </div>

      <div className={styles.actions}>
        <Button
          disabled={!amount}
          className={`${styles.button} ${styles.mb25}`}
          block
          type="primary"
          onClick={goToTransaction}
        >
          {t.formatMessage({ id: 'Confirm' })}
        </Button>
        <Button className={styles.button} block danger type="primary" onClick={back}>
          {t.formatMessage({ id: 'Back' })}
        </Button>
      </div>
    </div>
  );
};

export default Payment;
