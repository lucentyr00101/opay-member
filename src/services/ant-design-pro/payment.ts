import { request } from 'umi';

export async function getMemberAmounts(data: any) {
  return request('withdrawal/memberAmounts', {
    method: 'POST',
    data,
    skipErrorHandler: true,
  });
}

export async function getMemberDetails(username: string) {
  return request('member/detailByUsername', {
    method: 'GET',
    params: {
      username,
    },
    skipErrorHandler: true,
  });
}

export async function addDeposit(data: any) {
  return request('deposit/add', {
    method: 'POST',
    data,
    skipErrorHandler: true,
  });
}

export async function uploadScreenshot(data: any) {
  return request('deposit/update', {
    method: 'PUT',
    data,
    skipErrorHandler: true,
  });
}

export async function getPaymentType(params: any) {
  return request('paymentType/detail', {
    method: 'GET',
    params,
    skipErrorHandler: true,
  });
}
