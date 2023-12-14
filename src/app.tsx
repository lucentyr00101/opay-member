import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
// import { SettingDrawer } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig, RequestConfig } from 'umi';
import { Link, history } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';

const isDev = process.env.NODE_ENV === 'development';
// const loginPath = '/home';
import Cookies from 'universal-cookie';
import { refreshToken } from './services/ant-design-pro/login';
import { setTokens } from './global';
const cookies = new Cookies();

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};
const loginPath = '/';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const authToken = cookies.get('auth_token');
  const authTokenRefresh = cookies.get('auth_token_refresh');

  const fetchUserInfo = async () => {
    if (cookies.get('auth_token')) {
      try {
        const msg = await queryCurrentUser();
        return msg.data;
      } catch (error) {
        history.replace(loginPath);
      }
    }
    return undefined;
  };

  if (!authToken && authTokenRefresh) {
    const { data } = await refreshToken(authTokenRefresh);
    setTokens(data.accessToken, data.refreshToken);
  } else if (!authToken && !authTokenRefresh) {
    return {
      fetchUserInfo,
      settings: {},
    };
  }

  // 如果是登录页面，不执行
  // if (history.location.pathname !== loginPath) {
  const currentUser = await fetchUserInfo();
  return {
    fetchUserInfo,
    currentUser,
    settings: {},
  };
  // }
  // return {
  //   fetchUserInfo,
  //   settings: {},
  // };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    headerContentRender: () => <RightContent />,
    footerRender: () => <Footer />,
    headerTitleRender: false,
    rightContentRender: false,
    disableContentMargin: false,
    siderWidth: 0,
    logo: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    onPageChange: () => {
      // const { location } = history;
      // 如果没有登录，重定向到 login
      // if (!initialState?.currentUser && location.pathname !== loginPath) {
      //   history.replace(loginPath);
      // }
    },
    links: isDev
      ? [
          <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
          <Link to="/~docs" key="docs">
            <BookOutlined />
            <span>业务组件文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: false,
    hasSiderMenu: false,
    subMenuItemRender: false,
    forceSubMenuRender: undefined,
    menuRender: false,
    collapsedButtonRender: false,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    ...initialState?.settings,
  };
};

export const request: RequestConfig = {
  prefix: API_URL,
  requestInterceptors: [
    async (url: any, options: any) => {
      const authToken = cookies.get('auth_token');
      const authTokenRefresh = cookies.get('auth_token_refresh');
      const isLogout = url.includes('logout');

      if (!authToken && authTokenRefresh && !url.includes('refreshToken') && !isLogout) {
        const { data } = await refreshToken(authTokenRefresh);
        setTokens(data.accessToken, data.refreshToken);
      } else if (!authToken) {
        return {
          url,
          options,
        };
      }

      options.headers.Authorization = `Bearer ${cookies.get('auth_token')}`;
      return {
        url,
        options,
      };
    },
  ],
};
