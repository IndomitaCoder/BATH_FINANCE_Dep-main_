import { useEffect, useState } from 'react';
import useBATHFinance from './useBATHFinance';
import { TokenStat } from '../tomb-finance/types';
import useRefresh from './useRefresh';

const useBondStats = () => {
  const [stat, setStat] = useState<TokenStat>();
  const { slowRefresh } = useRefresh();
  const bathFinance = useBATHFinance();

  useEffect(() => {
    async function fetchBondPrice() {
      try {
        setStat(await bathFinance.getBondStat());
      }
      catch (err) {
        console.error(err);
      }
    }
    fetchBondPrice();
  }, [setStat, bathFinance, slowRefresh]);

  return stat;
};

export default useBondStats;
