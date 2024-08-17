import { useEffect, useState } from 'react';
import useBATHFinance from '../useBATHFinance';
import useRefresh from '../useRefresh';

const useTotalAllocPoint3 = () => {
  const [stat, setStat] = useState<Number>();
  const { fastRefresh } = useRefresh();
  const tombFinance = useBATHFinance();

  useEffect(() => {
    async function fetchPoolInfo() {
      try {
        setStat(await tombFinance.getTotalAllocPoint3());
      }
      catch (err) {
        console.error(err)
      }
    }
    fetchPoolInfo();
  }, [setStat, tombFinance, fastRefresh]);

  return stat;
};

export default useTotalAllocPoint3;