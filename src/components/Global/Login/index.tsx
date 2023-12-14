import type { FC } from 'react';
import { useLayoutEffect } from 'react';
import {
  loadCaptchaEnginge,
  LoadCanvasTemplateNoReload,
  validateCaptcha,
} from '@/components/Common/SimpleCaptcha';
// import MESSAGES from '@/constants/messages';
import styles from '@/pages/payment/options/index.less';
import { Button, Col, Form, Input, message, Modal, Row } from 'antd';
import Cookies from 'universal-cookie';
import { setTokens } from '@/global';
import { loginOrSignup } from '@/services/ant-design-pro/login';
import { history, useModel, useIntl } from 'umi';

interface Props {
  visible: boolean;
  close: () => void;
}

const LoginModal: FC<Props> = ({ visible, close }) => {
  const t = useIntl();
  const [form] = Form.useForm();
  const cookies = new Cookies();
  const merchantCode = history?.location?.query?.code || '';
  const { setInitialState } = useModel('@@initialState');

  useLayoutEffect(() => {
    loadCaptchaEnginge(6, 'white', 'black', 'lower');
  }, []);

  const captchaValidator = () => ({
    validator(_: any, value: any) {
      if (value) {
        if (!validateCaptcha(value))
          return Promise.reject(new Error(t.formatMessage({ id: 'invalidCaptcha' })));
        else return Promise.resolve();
      } else {
        return Promise.reject(new Error(t.formatMessage({ id: 'captchaRequired' })));
      }
    },
  });

  const captchaRules = [captchaValidator];

  const hasSelectedPaymentType = !!cookies.get('paymentType');

  const login = async (values: any) => {
    try {
      const merchantNo = cookies.get('code') || merchantCode;
      if (!cookies.get('code')) cookies.set('code', merchantNo, { path: '/' });
      let data = await loginOrSignup({ ...values, merchantNo });
      const { isNewMemberSignup } = data.data;
      if (isNewMemberSignup) {
        data = await loginOrSignup({ ...values, merchantNo });
      }
      cookies.set('username', values.username);
      await setInitialState((s) => ({
        ...s,
        currentUser: data.data,
      }));
      setTokens(data.data.accessToken, data.data.refreshToken);

      if (hasSelectedPaymentType) window.location.replace(`/payment/amount?code=${merchantCode}`);
      else window.location.replace(`/payment/options?code=${merchantCode}`);
      close();
    } catch (error: any) {
      message.error(error?.data?.message || 'Something went wrong');
    }
  };

  const handleCSRClick = async (evt: Event) => {
    evt.preventDefault();
    let url = cookies.get('customerServiceUrl');
    if (url) {
      if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
      }
      window.open(url, '_blank');
    } else {
      window.location.href = '/error/404';
    }
  };

  return (
    <Modal footer={false} width={550} centered visible={visible} closable={false} onCancel={close}>
      <h4 className={styles.formTitle}>{t.formatMessage({ id: 'inputUsername' })}</h4>

      <Form
        form={form}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={(values) => login(values)}
        autoComplete="off"
        validateTrigger="onSubmit"
      >
        <Form.Item style={{ color: 'red' }}>{t.formatMessage({ id: 'loginNotice' })}</Form.Item>
        <Form.Item
          name="username"
          rules={[{ required: true, message: t.formatMessage({ id: 'userRequired' }) }]}
        >
          <Input placeholder={t.formatMessage({ id: 'Username' })} name="username" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: t.formatMessage({ id: 'passwordRequired' }) }]}
        >
          <Input.Password name="password" placeholder={t.formatMessage({ id: 'Password' })} />
        </Form.Item>
        <Form.Item hasFeedback name="captcha" rules={captchaRules}>
          <Row>
            <Col md={14} xs={24}>
              <Input placeholder={t.formatMessage({ id: 'Captcha' })} name="captcha" />
            </Col>
            <Col className={styles.captchaWrapper}>
              <LoadCanvasTemplateNoReload />
            </Col>
          </Row>
        </Form.Item>
        <Row>
          <Col>
            <Form.Item>
              <a
                href="forgot-password"
                className={styles.forgotPassword}
                onClick={(e: any) => handleCSRClick(e)}
              >
                {t.formatMessage({ id: 'forgotPw' })}
              </a>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Row>
            <Col>
              <Button className={`${styles.mr19}`} type="primary" htmlType="submit">
                {t.formatMessage({ id: 'Login' })}
              </Button>
              <Button onClick={close}>{t.formatMessage({ id: 'Cancel' })}</Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default LoginModal;
