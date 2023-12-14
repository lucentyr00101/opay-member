import { Button, message, notification } from 'antd';
import { useIntl } from 'umi';
import defaultSettings from '../config/defaultSettings';

const { pwa } = defaultSettings;
const isHttps = document.location.protocol === 'https:';
import moment from 'moment';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

export const setTokens = (accessToken: string, refreshToken: string) => {
  const authTokenExp = moment().add(1, 'minutes').add(30, 'seconds').format('YYYY-MM-DD HH:mm:ss');
  const authTokenRefreshExp = moment().add(12, 'hours').format('YYYY-MM-DD HH:mm:ss');
  const _refreshToken = cookies.get('auth_token_refresh');
  if (_refreshToken) cookies.remove('auth_token_refresh');
  cookies.set('auth_token', accessToken, {
    expires: new Date(authTokenExp),
    path: '/',
  });
  cookies.set('auth_token_refresh', refreshToken, {
    expires: new Date(authTokenRefreshExp),
    path: '/',
  });
};

export interface RouteParams {
  merchantNo?: string;
  id?: string;
}

export const removeTokens = () => {
  return new Promise((resolve) => {
    const ignoreCookies = ['code'];
    const allCookies = cookies.getAll();
    Object.keys(allCookies).forEach((cookieName: string) => {
      if (!ignoreCookies.includes(cookieName)) {
        cookies.remove(cookieName, { path: '/' });
      }
    });
    setTimeout(() => resolve(true), 800);
  });
};

export const removeCookies = () => {
  return new Promise((resolve) => {
    const arr = [
      'merchantId',
      'memberId',
      'paymentType',
      'amount',
      'withdrawalData',
      'withdrawalId',
    ];
    arr.forEach((cookie) => cookies.remove(cookie, { path: '/' }));
    setTimeout(() => resolve(true), 800);
  });
};

const clearCache = () => {
  // remove all caches
  if (window.caches) {
    caches
      .keys()
      .then((keys) => {
        keys.forEach((key) => {
          caches.delete(key);
        });
      })
      .catch((e) => console.log(e));
  }
};

// if pwa is true
if (pwa) {
  // Notify user if offline now
  window.addEventListener('sw.offline', () => {
    message.warning(useIntl().formatMessage({ id: 'app.pwa.offline' }));
  });

  // Pop up a prompt on the page asking the user if they want to use the latest version
  window.addEventListener('sw.updated', (event: Event) => {
    const e = event as CustomEvent;
    const reloadSW = async () => {
      // Check if there is sw whose state is waiting in ServiceWorkerRegistration
      // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration
      const worker = e.detail && e.detail.waiting;
      if (!worker) {
        return true;
      }
      // Send skip-waiting event to waiting SW with MessageChannel
      await new Promise((resolve, reject) => {
        const channel = new MessageChannel();
        channel.port1.onmessage = (msgEvent) => {
          if (msgEvent.data.error) {
            reject(msgEvent.data.error);
          } else {
            resolve(msgEvent.data);
          }
        };
        worker.postMessage({ type: 'skip-waiting' }, [channel.port2]);
      });

      clearCache();
      window.location.reload();
      return true;
    };
    const key = `open${Date.now()}`;
    const btn = (
      <Button
        type="primary"
        onClick={() => {
          notification.close(key);
          reloadSW();
        }}
      >
        {useIntl().formatMessage({ id: 'app.pwa.serviceworker.updated.ok' })}
      </Button>
    );
    notification.open({
      message: useIntl().formatMessage({ id: 'app.pwa.serviceworker.updated' }),
      description: useIntl().formatMessage({ id: 'app.pwa.serviceworker.updated.hint' }),
      btn,
      key,
      onClose: async () => null,
    });
  });
} else if ('serviceWorker' in navigator && isHttps) {
  // unregister service worker
  const { serviceWorker } = navigator;
  if (serviceWorker.getRegistrations) {
    serviceWorker.getRegistrations().then((sws) => {
      sws.forEach((sw) => {
        sw.unregister();
      });
    });
  }
  serviceWorker.getRegistration().then((sw) => {
    if (sw) sw.unregister();
  });

  clearCache();
}
