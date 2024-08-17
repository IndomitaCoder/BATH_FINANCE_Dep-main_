import { useCallback, useEffect, useState } from 'react';
import useBATHFinance from './useBATHFinance';
import config from '../config';
import { BigNumber } from 'ethers';

const useCashPriceInLastTWAP = () => {
  const [price, setPrice] = useState<BigNumber>(BigNumber.from(0));
  const bathFinance = useBATHFinance();

  const fetchCashPrice = useCallback(async () => {
    setPrice(await bathFinance.getTombPriceInLastTWAP());
  }, [bathFinance]);

  useEffect(() => {
    fetchCashPrice().catch((err) => console.error(`Failed to fetch TOMB price: ${err.stack}`));
    const refreshInterval = setInterval(fetchCashPrice, config.refreshInterval);
    return () => clearInterval(refreshInterval);
  }, [setPrice, bathFinance, fetchCashPrice]);

  return price;
};

export default useCashPriceInLastTWAP;
