import type { FC } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import styles from './index.less';
import { useIntl } from 'umi';
import { getLogo } from '@/services/ant-design-pro/api';
import { Avatar } from 'antd';

const Welcome: FC = () => {
  const t = useIntl();
  const [logovalue, setLogo] = useState({
    id: '',
    logo: '',
  });

  const getLogoDetail = async () => {
    const { data } = await getLogo();

    setLogo({
      ...logovalue,
      ...data,
    });
  };

  useEffect(() => {
    getLogoDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.welcomeContainer}>
      {logovalue?.logo && (
        <Avatar size={125} shape="square" src={logovalue?.logo || ''} className={styles.homeLogo} />
      )}

      {/* <img src={logoImg} alt="" className={styles.logo} /> */}
      {t.formatMessage({ id: 'pages.welcome' })}
    </div>
  );
};

export default Welcome;
