import { request } from 'umi';

export async function fetchDeposits(
  params: {
    // query
    size: number;
    page: number;
    merchantUsername?: string;
  },
  options?: Record<string, any>,
) {
  const requestOptions = {
    method: 'POST',
    data: params,
    ...(options || {}),
  };

  const res = await request<{
    data: API.DepositItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
    totalElements?: number;
  }>('deposit/search', requestOptions);

  res.total = res.totalElements;

  return res;
}

export async function fetchDeposit(
  params: {
    id: string;
  },
  options?: Record<string, any>,
) {
  const requestOptions = {
    method: 'GET',
    params,
    ...(options || {}),
    skipErrorHandler: true,
  };

  const res = await request('deposit/detail', requestOptions);

  return res;
}

export async function cancelDeposit(data: any, options?: Record<string, any>) {
  const requestOptions = {
    method: 'PUT',
    data,
    ...(options || {}),
    skipErrorHandler: true,
  };

  const res = await request('deposit/update', requestOptions);

  return res;
}
