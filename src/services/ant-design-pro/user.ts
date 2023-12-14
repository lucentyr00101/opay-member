import { request } from 'umi';

export async function getAuth() {
  return request('member/me', {
    method: 'GET',
    skipErrorHandler: true,
  });
}
