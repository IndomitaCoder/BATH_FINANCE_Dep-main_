import { useEffect, useState } from 'react';
import useBATHFinance from './useBATHFinance';
import { LPStat } from '../tomb-finance/types';
import useRefresh from './useRefresh';

const useLpStats = (lpTicker: string) => {
  const [stat, setStat] = useState<LPStat>();
  const { slowRefresh } = useRefresh();
  const bathFinance = useBATHFinance();

  useEffect(() => {
    async function fetchLpPrice() {
      try {
        setStat(await bathFinance.getLPStat(lpTicker));
      }
      catch (err) {
        console.error(err);
      }
    }
    fetchLpPrice();
  }, [setStat, bathFinance, slowRefresh, lpTicker]);

  return stat;
};

export default useLpStats;
