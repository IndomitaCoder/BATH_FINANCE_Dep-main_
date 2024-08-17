import { useEffect, useState } from 'react';
import useBATHFinance from './useBATHFinance';
import { TokenStat } from '../tomb-finance/types';
import useRefresh from './useRefresh';

const useTombStats = () => {
  const [stat, setStat] = useState<TokenStat>();
  const { fastRefresh } = useRefresh();
  const bathFinance = useBATHFinance();

  useEffect(() => {
    async function fetchTombPrice() {
      try {
        setStat(await bathFinance.getTombStat());
      }
      catch (err) {
        console.error(err)
      }
    }
    fetchTombPrice();
  }, [setStat, bathFinance, fastRefresh]);

  return stat;
};

export default useTombStats;
