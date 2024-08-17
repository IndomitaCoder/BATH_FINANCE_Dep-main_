import { useEffect, useState } from 'react';
import useBATHFinance from '../useBATHFinance';
import useRefresh from '../useRefresh';

const useTotalAllocPoint1 = () => {
  const [stat, setStat] = useState<Number>();
  const { fastRefresh } = useRefresh();
  const bathFinance = useBATHFinance();

  useEffect(() => {
    async function fetchPoolInfo() {
      try {
        setStat(await bathFinance.getTotalAllocPoint1());
      }
      catch (err) {
        console.error(err)
      }
    }
    fetchPoolInfo();
  }, [setStat, bathFinance, fastRefresh]);

  return stat;
};

export default useTotalAllocPoint1;