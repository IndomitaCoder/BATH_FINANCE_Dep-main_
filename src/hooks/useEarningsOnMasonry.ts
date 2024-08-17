import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import useBATHFinance from './useBATHFinance';
import useRefresh from './useRefresh';

const useEarningsOnMasonry = () => {
  const { slowRefresh } = useRefresh();
  const [balance, setBalance] = useState(BigNumber.from(0));
  const bathFinance = useBATHFinance();
  const isUnlocked = bathFinance?.isUnlocked;

  useEffect(() => {
    async function fetchBalance() {
      try {
        setBalance(await bathFinance.getEarningsOnMasonry());
      } catch (e) {
        console.error(e);
      }
    }
    if (isUnlocked) {
      fetchBalance();
    }
  }, [isUnlocked, bathFinance, slowRefresh]);

  return balance;
};

export default useEarningsOnMasonry;
