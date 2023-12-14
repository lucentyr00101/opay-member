import type { FC } from 'react';
import Cookies from 'universal-cookie';
import { useState, useEffect, memo } from 'react';
import { useModel } from 'umi';
import { poll, pollNotif } from '@/services/ant-design-pro/notification';
import LogoutPrompt from '@/components/Global/LogoutPrompt';

const NotificationPoll: FC = () => {
  const cookies = new Cookies();
  const AUTH_TOKEN = cookies.get('auth_token');
  const [showLogout, setShowLogout] = useState(false);
  const [message, setMessage] = useState('');
  const { initialState } = useModel('@@initialState');
  const { currentUser }: any = initialState || {};

  const POLL_INTERVAL = 3000;

  const getMessage = (data: any) => {
    switch (true) {
      case data.isDisabled:
        return 'Your account has been disabled.';
      case data.isResetPassword:
        return 'Your password has been reset.';
      default:
        return '';
    }
  };

  const handlePollNotif = async () => {
    try {
      await poll({
        fn: () => pollNotif(currentUser?.id),
        validate: (data: any) => !!data,
        interval: POLL_INTERVAL,
        action: (result: any) => {
          const { isResetPassword, isDisabled } = result?.data?.data;
          setMessage(getMessage(result?.data?.data));
          return (isResetPassword || isDisabled) && setShowLogout(true);
        },
      });
    } catch (e: any) {
      console.log(e?.data?.message || 'Something went wrong');
    }
  };

  useEffect(() => {
    if (AUTH_TOKEN) {
      handlePollNotif();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <LogoutPrompt message={message} visible={showLogout} close={() => setShowLogout(false)} />
    </>
  );
};

export default memo(NotificationPoll);
