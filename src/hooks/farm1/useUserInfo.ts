import { useEffect, useState } from 'react';
import useBATHFinance from '../useBATHFinance';
import useRefresh from '../useRefresh';
import { PoolUserInfo } from '../../tomb-finance/types';

const useUserInfoByPidAndAccount1 = (pId: Number, account: string) => {
  const [stat, setStat] = useState<PoolUserInfo>();
  const { fastRefresh } = useRefresh();
  const tombFinance = useBATHFinance();

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        setStat(await tombFinance.getPoolUserInfoByPidAndAddress1(pId, account));
      }
      catch (err) {
        console.error(err)
      }
    }
    fetchUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setStat, tombFinance, fastRefresh]);

  return stat;
};

export default useUserInfoByPidAndAccount1;