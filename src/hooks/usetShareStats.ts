import { useEffect, useState } from 'react';
import useBATHFinance from './useBATHFinance';
import { TokenStat } from '../tomb-finance/types';
import useRefresh from './useRefresh';

const useShareStats = () => {
  const [stat, setStat] = useState<TokenStat>();
  const { slowRefresh } = useRefresh();
  const bathFinance = useBATHFinance();

  useEffect(() => {
    async function fetchSharePrice() {
      try {
        setStat(await bathFinance.getShareStat());
      } catch (err) {
        console.error(err)
      }
    }
    fetchSharePrice();
  }, [setStat, bathFinance, slowRefresh]);

  return stat;
};

export default useShareStats;
