import React, { useEffect, useState } from 'react';
import { Card, Image } from 'antd';
import styles from './index.less';
import { history, useModel } from 'umi';
import { fetchPaymentMethods } from '@/services/ant-design-pro/login';
import Cookies from 'universal-cookie';
import Login from '@/components/Global/Login';
import { useIntl } from 'umi';
import { removeCookies } from '@/global';
import DisabledPaymentType from '@/components/Payment/DisabledPaymentType';

const Options: React.FC = () => {
  const t = useIntl();
  const merchantCode: any = history.location?.query?.code;
  const cookies = new Cookies();

  const [showLogin, setShowLogin] = useState(false);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [showDisabled, setShowDisabled] = useState(false);

  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const loggedIn = !!currentUser;

  const handleFetchPaymentMethods = async () => {
    const { data: _data } = await fetchPaymentMethods();
    setPaymentTypes(_data);
    return Promise.resolve(_data);
  };

  useEffect(() => {
    if (!merchantCode) {
      history.replace('/index');
      return;
    }
    handleFetchPaymentMethods();
  }, [merchantCode]);

  const handleSelectPayment = async (id: string) => {
    const _paymentTypes = await handleFetchPaymentMethods();
    const paymentType: any = _paymentTypes.find((_paymentType: any) => _paymentType.id === id);
    if (!paymentType) {
      setShowDisabled(true);
    } else {
      cookies.set('paymentType', paymentType, { path: '/' });
      if (loggedIn) history.replace({ pathname: '/payment/amount', query: { code: merchantCode } });
      else setShowLogin(true);
    }
  };

  useEffect(() => {
    removeCookies();
  }, []);

  return (
    <div className={styles.paymentContainer}>
      <span className={styles.paymentLabel}>{t.formatMessage({ id: 'pleaseSelect' })}</span>
      {paymentTypes.map((type: { id: string; logo: string; tag: string; name: string }) => (
        <Card
          key={type.id}
          onClick={() => handleSelectPayment(type.id)}
          className={styles.paymentCard}
          bodyStyle={{ padding: 0 }}
        >
          <Image
            preview={false}
            src={type.logo || ''}
            alt={type.tag}
            className={styles.paymentTypeLogo}
          />
          <h3>{type.name}</h3>
        </Card>
      ))}
      {showLogin && <Login visible={showLogin} close={() => setShowLogin(false)} />}
      <DisabledPaymentType visible={showDisabled} close={() => setShowDisabled(false)} />
    </div>
  );
};

export default Options;
