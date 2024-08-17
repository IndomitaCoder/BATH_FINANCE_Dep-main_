import { useEffect, useState } from 'react';
import useBATHFinance from '../useBATHFinance';
import useRefresh from '../useRefresh';
import { PoolInfo } from '../../tomb-finance/types';

const usePoolInfoByPid2 = (pId: Number) => {
  const [stat, setStat] = useState<PoolInfo>();
  const { fastRefresh } = useRefresh();
  const tombFinance = useBATHFinance();

  useEffect(() => {
    async function fetchPoolInfo() {
      try {
        setStat(await tombFinance.getPoolInfoByPid2(pId));
      }
      catch (err) {
        console.error(err)
      }
    }
    fetchPoolInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setStat, tombFinance, fastRefresh]);

  return stat;
};

export default usePoolInfoByPid2;