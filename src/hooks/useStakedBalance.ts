import { useCallback, useEffect, useState } from 'react';

import { BigNumber } from 'ethers';
import useBATHFinance from './useBATHFinance';
import { ContractName } from '../tomb-finance';
import config from '../config';

const useStakedBalance = (poolName: ContractName, poolId: Number) => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const bathFinance = useBATHFinance();
  const isUnlocked = bathFinance?.isUnlocked;

  const fetchBalance = useCallback(async () => {
    const balance = await bathFinance.stakedBalanceOnBank(poolName, poolId, bathFinance.myAccount);
    setBalance(balance);
  }, [poolName, poolId, bathFinance]);

  useEffect(() => {
    if (isUnlocked) {
      fetchBalance().catch((err) => console.error(err.stack));

      const refreshBalance = setInterval(fetchBalance, config.refreshInterval);
      return () => clearInterval(refreshBalance);
    }
  }, [isUnlocked, poolName, setBalance, bathFinance, fetchBalance]);

  return balance;
};

export default useStakedBalance;
