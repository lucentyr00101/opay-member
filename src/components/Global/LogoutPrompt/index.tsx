import type { FC } from 'react';
import { useEffect } from 'react';
import { Modal, Typography } from 'antd';
import { useState } from 'react';
import Cookies from 'universal-cookie';
import { outLogin } from '@/services/ant-design-pro/api';
import { history, useModel } from 'umi';
import { removeTokens } from '@/global';

interface Props {
  message: string;
  visible: boolean;
  close: () => void;
}

const { Title } = Typography;

const LogoutPrompt: FC<Props> = ({ visible, message, close }) => {
  const [remaining, setRemaining] = useState(5);
  const [intervalItem, setIntervalItem] = useState<any>();
  const cookies = new Cookies();
  const { setInitialState } = useModel('@@initialState');

  const runTimer = () => {
    setRemaining((prevValue) => prevValue - 1);
  };

  const loginOut = async () => {
    await outLogin();
    await removeTokens();
    const merchantNo = cookies.get('code') || '';
    const { query = {} } = history.location;
    const { redirect } = query;
    // Note: There may be security issues, please note
    if (window.location.pathname !== '/' && !redirect) {
      window.location.replace(`/${merchantNo}`);
    }
  };

  const logout = async () => {
    await loginOut();
    await setInitialState((s) => ({ ...s, currentUser: undefined }));
    close();
  };

  useEffect(() => {
    if (remaining === 0) {
      setIntervalItem(undefined);
      clearInterval(intervalItem);
      logout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining]);

  useEffect(() => {
    if (visible) {
      const timer = setInterval(() => {
        runTimer();
      }, 1000);
      setIntervalItem(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <Modal destroyOnClose visible={visible} onCancel={undefined} footer={null} closable={false}>
      <Title level={3}>
        {message} You will be logged out automatically in {remaining} second(s)
      </Title>
    </Modal>
  );
};

export default LogoutPrompt;
