import type { FC } from 'react';
import { useEffect, useState } from 'react';
import styles from '../index.less';
import Cookies from 'universal-cookie';
import { validateMerchant } from '@/services/ant-design-pro/login';
import { history } from 'umi';
import moment from 'moment';
import { useIntl, useModel } from 'umi';
import { Avatar } from 'antd';
import { getLogo, outLogin } from '@/services/ant-design-pro/api';
import { removeTokens } from '@/global';

const WelcomeMerchantNo: FC = ({ match }: any) => {
  const t = useIntl();
  const cookies = new Cookies();
  const { initialState, setInitialState } = useModel('@@initialState');
  const { currentUser } = (initialState as any) || {};

  const [hasError, setHasError] = useState(false);
  const merchantNo = match.params.merchantNo;
  const [logovalue, setLogo] = useState({
    id: '',
    logo: '',
  });

  const errorComponent = (
    <div>
      <div className={styles.invalidText}>{t.formatMessage({ id: 'invalidMerchant' })}</div>
      <p className={styles.errorMessage}>{t.formatMessage({ id: 'invalidMsg' })}</p>
    </div>
  );

  /**
   * 退出登录，并且将当前的 url 保存
   */
  const loginOut = async () => {
    await outLogin();
    await removeTokens();
  };

  const handleValidateMerchant = async () => {
    if (merchantNo) {
      cookies.set('code', merchantNo, { expires: moment().add('days', 2).toDate(), path: '/' });
      setHasError(false);
      try {
        const { data } = await validateMerchant(merchantNo as any);
        const { exist, isDisabled, customerServiceUrl } = data;
        if (exist && !isDisabled) {
          const authUserMerchantNo = currentUser?.merchant?.merchantNo;
          if (currentUser && merchantNo !== authUserMerchantNo) {
            await loginOut();
            await setInitialState((s) => ({ ...s, currentUser: undefined }));
          }
          cookies.set('customerServiceUrl', customerServiceUrl || '', { path: '/' });
          cookies.set('headerTitle', data.platformName || '', { path: '/' });
          cookies.set('validMerchant', true, { path: '/' });
          history.replace({ pathname: '/payment/options', query: { code: merchantNo } });
        } else {
          throw new Error();
        }
      } catch (error) {
        cookies.remove('code');
        cookies.set('validMerchant', false, { path: '/' });
        setHasError(true);
      }
    }
  };

  const getLogoDetail = async () => {
    const { data } = await getLogo();

    setLogo({
      ...logovalue,
      ...data,
    });
  };

  useEffect(() => {
    handleValidateMerchant();
    getLogoDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.welcomeContainer}>
      {logovalue?.logo && (
        <Avatar size={125} shape="square" src={logovalue?.logo || ''} className={styles.homeLogo} />
      )}
      {/* <img src={logoImg} alt="" className={styles.logo} /> */}
      {hasError && errorComponent}
    </div>
  );
};

export default WelcomeMerchantNo;
