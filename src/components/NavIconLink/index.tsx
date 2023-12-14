import React from 'react';
import styles from './index.less';
import { history } from 'umi';
import Cookies from 'universal-cookie';
import { removeCookies } from '@/global';

export type NavLinkIconProps = {
  image: any;
};

const NavIconLink: React.FC<NavLinkIconProps> = ({ image }) => {
  const cookies = new Cookies();
  const merchantNo = cookies.get('code') || '';
  const pathname = history?.location?.pathname;
  const isHome = pathname === '/';

  const goHome = async () => {
    if (!isHome) {
      await removeCookies();
      history.replace({ pathname: '/payment/options', query: { code: merchantNo } });
    }
  };

  return (
    <a className={styles.homeLink} onClick={() => goHome()}>
      <img src={image} alt="" />
    </a>
  );
};

export default NavIconLink;
