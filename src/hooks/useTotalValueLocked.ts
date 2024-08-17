import { useEffect, useState } from 'react';
import useBATHFinance from './useBATHFinance';
import useRefresh from './useRefresh';

const useTotalValueLocked = () => {
  const [totalValueLocked, setTotalValueLocked] = useState<Number>(0);
  const { slowRefresh } = useRefresh();
  const bathFinance = useBATHFinance();

  useEffect(() => {
    async function fetchTVL() {
      try {
        setTotalValueLocked(await bathFinance.getTotalValueLocked());
      }
      catch (err) {
        console.error(err);
      }
    }
    fetchTVL();
  }, [setTotalValueLocked, bathFinance, slowRefresh]);

  return totalValueLocked;
};

export default useTotalValueLocked;
