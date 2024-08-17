import { useEffect, useState } from 'react';
import useBATHFinance from '../useBATHFinance';
import { TShareSwapperStat } from '../../tomb-finance/types';
import useRefresh from '../useRefresh';

const useTShareSwapperStats = (account: string) => {
  const [stat, setStat] = useState<TShareSwapperStat>();
  const { fastRefresh/*, slowRefresh*/ } = useRefresh();
  const bathFinance = useBATHFinance();

  useEffect(() => {
    async function fetchTShareSwapperStat() {
      try {
        if (bathFinance.myAccount) {
          setStat(await bathFinance.getTShareSwapperStat(account));
        }
      }
      catch (err) {
        console.error(err);
      }
    }
    fetchTShareSwapperStat();
  }, [setStat, bathFinance, fastRefresh, account]);

  return stat;
};

export default useTShareSwapperStats;