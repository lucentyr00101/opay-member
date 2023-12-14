// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 发送验证码 POST /api/login/captcha */
// export async function getFakeCaptcha(
//   params: {
//     // query
//     /** 手机号 */
//     phone?: string;
//   },
//   options?: { [key: string]: any },
// ) {
//   return request<API.FakeCaptcha>('/api/login/captcha', {
//     method: 'GET',
//     params: {
//       ...params,
//     },
//     ...(options || {}),
//   });
// }
/** 发送验证码 POST /api/login/captcha */
export async function getFakeCaptcha(data: any) {
  return request<API.FakeCaptcha>('member/loginOrSignup', {
    method: 'POST',
    data,
  });
}
export async function loginOrSignup(data: any) {
  return request('member/loginOrSignup', {
    method: 'POST',
    data,
    skipErrorHandler: true,
  });
}
export async function validateMerchant(merchantNo: string) {
  return request('merchant/exist', {
    method: 'GET',
    params: { merchantNo },
    skipErrorHandler: true,
  });
}

export async function fetchPaymentMethods() {
  return request('member/paymentTypes', {
    method: 'GET',
  });
}
export async function refreshToken(refreshToken: string) {
  return request('auth/refreshToken', {
    method: 'POST',
    data: { refreshToken },
    skipErrorHandler: true,
  });
}
