import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import useBATHFinance from './useBATHFinance';
import useRefresh from './useRefresh';

const useStakedBalanceOnMasonry = () => {
  const { slowRefresh } = useRefresh();
  const [balance, setBalance] = useState(BigNumber.from(0));
  const bathFinance = useBATHFinance();
  const isUnlocked = bathFinance?.isUnlocked;
  useEffect(() => {
    async function fetchBalance() {
      try {
        setBalance(await bathFinance.getStakedSharesOnMasonry());
      } catch (e) {
        console.error(e);
      }
    }
    if (isUnlocked) {
      fetchBalance();
    }
  }, [slowRefresh, isUnlocked, bathFinance]);
  return balance;
};

export default useStakedBalanceOnMasonry;
