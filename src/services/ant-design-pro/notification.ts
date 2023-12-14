import { request } from 'umi';

export async function pollNotif(id: string) {
  return await request<{
    data: any;
    /** 列表的内容总数 */
    // total?: number;
    success?: boolean;
  }>('member/notification', {
    method: 'GET',
    params: {
      id,
    },
    skipErrorHandler: true,
  });
}

export const poll = async ({ fn, validate, interval, maxAttempts = 1000, action }: any) => {
  let attempts = 0;

  const executePoll = async (resolve: any, reject: any) => {
    const result = await fn();
    attempts++;

    // const actionDict = {
    //   Withdrawal: () => action(result.data.data),
    //   SysUser: () => result.data.data.isResetOtp && action()
    // }

    if (validate(result)) {
      if (action) action(result);
      setTimeout(executePoll, interval, resolve, reject);
      return resolve(result);
    } else if (maxAttempts && attempts === maxAttempts) {
      return reject(new Error('Exceeded max attempts'));
    } else {
      return reject(new Error('Something went wrong!'));
    }
  };

  return new Promise(executePoll);
};
