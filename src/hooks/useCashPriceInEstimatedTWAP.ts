import { useEffect, useState } from 'react';
import useBATHFinance from './useBATHFinance';
import { TokenStat } from '../tomb-finance/types';
import useRefresh from './useRefresh';

const useCashPriceInEstimatedTWAP = () => {
  const [stat, setStat] = useState<TokenStat>();
  const bathFinance = useBATHFinance();
  const { slowRefresh } = useRefresh();

  useEffect(() => {
    async function fetchCashPrice() {
      try {
        setStat(await bathFinance.getTombStatInEstimatedTWAP());
      } catch (err) {
        console.error(err);
      }
    }
    fetchCashPrice();
  }, [setStat, bathFinance, slowRefresh]);

  return stat;
};

export default useCashPriceInEstimatedTWAP;
