import React, { useCallback, useState } from 'react';
import { Avatar, Menu, Spin } from 'antd';
import { history, useModel } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import { outLogin } from '@/services/ant-design-pro/api';
import type { MenuInfo } from 'rc-menu/lib/interface';
import avatarImg from '@/assets/avatar.svg';
import { removeTokens } from '@/global';
import Login from '@/components/Global/Login';
import { useIntl } from 'umi';
import Cookies from 'universal-cookie';
export type GlobalHeaderRightProps = {
  menu?: boolean;
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = () => {
  const t = useIntl();
  const { initialState, setInitialState } = useModel('@@initialState');
  const [showLogin, setShowLogin] = useState(false);
  const cookies = new Cookies();

  const { currentUser } = initialState || {};

  /**
   * 退出登录，并且将当前的 url 保存
   */
  const loginOut = async () => {
    await outLogin();
    await removeTokens();
    const merchantNo = cookies.get('code') || '';
    const { query = {} } = history.location;
    const { redirect } = query;
    // Note: There may be security issues, please note
    if (window.location.pathname !== '/' && !redirect) {
      history.replace({ pathname: `/${merchantNo}` });
    }
  };

  const loggedIn = !!currentUser;

  const onMenuClick = useCallback((event: MenuInfo) => {
    const { key } = event;
    const funcs = {
      user: () => {},
      logout: async () => {
        await loginOut();
        await setInitialState((s) => ({ ...s, currentUser: undefined }));
        return;
      },
      order: () => history.replace('/payment/order'),
      login: () => setShowLogin(true),
    };
    funcs[key]();
    // history.replace(`/account/${key}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const authMenu = (
    <>
      <Menu.Item key="user">
        <span className={styles.menuText}>{currentUser?.username}</span>
      </Menu.Item>
      <Menu.Item key="order">
        <span className={styles.menuText}>{t.formatMessage({ id: 'orderHistory' })}</span>
      </Menu.Item>
      <Menu.Item key="logout">
        <span className={`${styles.menuText} ${styles.signOut}`}>
          {t.formatMessage({ id: 'signout' })}
        </span>
      </Menu.Item>
    </>
  );

  const guestMenu = (
    <Menu.Item key="login">
      <span className={styles.menuText}>{t.formatMessage({ id: 'Login' })}</span>
    </Menu.Item>
  );

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {loggedIn ? authMenu : guestMenu}
    </Menu>
  );

  const isNotHomePage = window.location.pathname !== '/';

  return (
    <>
      {isNotHomePage && (
        <HeaderDropdown
          overlayClassName={styles.dropdownContent}
          overlay={menuHeaderDropdown}
          placement="bottomRight"
        >
          <span className={`${styles.action} ${styles.account}`}>
            <Avatar
              src={<img className={styles.avatarImage} src={avatarImg} alt="" />}
              alt="avatar"
              className="responsiveAvatar"
            />
          </span>
        </HeaderDropdown>
      )}
      {showLogin && <Login visible={showLogin} close={() => setShowLogin(false)} />}
    </>
  );
};

export default AvatarDropdown;
