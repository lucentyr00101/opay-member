import React, { useEffect, useState } from 'react';
import { useModel, SelectLang } from 'umi';
import Avatar from './AvatarDropdown';
import NavIconLink from '../NavIconLink';
import styles from './index.less';
import homeIcon from '../../assets/home.svg';
import languageIcon from '../../assets/language.svg';
import Cookies from 'universal-cookie';
import { history } from 'umi';
import NotificationPoll from '@/components/Global/NotificationPoll';

export type SiderTheme = 'light' | 'dark';

const GlobalHeaderRight: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const cookies = new Cookies();
  const pathname = history?.location?.pathname;
  const isHome = pathname === '/';
  const [, setRenderCount] = useState(0);

  const postLocalesData = () => [
    {
      lang: 'en-US',
      label: 'English',
      icon: '🇺🇸',
      title: 'Language',
    },
    {
      lang: 'zh-CN',
      label: '简体中文',
      icon: '🇨🇳',
      title: '语言',
    },
  ];

  const validMerchant = cookies.get('validMerchant');

  useEffect(() => {
    setTimeout(() => {
      setRenderCount((v) => v + 1);
    }, 100);
  }, [validMerchant]);

  const image = <img src={languageIcon} alt="" />;

  const showAvatar = cookies.get('validMerchant') === 'true';

  const showTitle = !isHome && showAvatar;

  if (!initialState || !initialState.settings) {
    return null;
  }

  return (
    <div className={styles.headerContainer}>
      {validMerchant === 'true' && <NavIconLink image={homeIcon} />}
      <NotificationPoll />
      <h2 className={styles.headerTitle}>{showTitle && cookies.get('headerTitle')}</h2>
      <div>
        {showAvatar && <Avatar />}
        <SelectLang postLocalesData={postLocalesData} icon={image} className={styles.action} />
      </div>
    </div>
  );
};
export default GlobalHeaderRight;
