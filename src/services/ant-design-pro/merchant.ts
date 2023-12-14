import { request } from 'umi';

export async function getMerchantDetail(data: any) {
  return request('merchant/detailByMerchantNo', {
    method: 'GET',
    params: data,
    skipErrorHandler: true,
  });
}
