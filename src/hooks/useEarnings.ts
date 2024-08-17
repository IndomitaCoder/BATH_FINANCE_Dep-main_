import { useCallback, useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import useBATHFinance from './useBATHFinance';
import { ContractName } from '../tomb-finance';
import config from '../config';

const useEarnings = (poolName: ContractName, earnTokenName: String, poolId: Number) => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const bathFinance = useBATHFinance();
  const isUnlocked = bathFinance?.isUnlocked;

  const fetchBalance = useCallback(async () => {
    const balance = await bathFinance.earnedFromBank(poolName, earnTokenName, poolId, bathFinance.myAccount);
    setBalance(balance);
  }, [poolName, earnTokenName, poolId, bathFinance]);

  useEffect(() => {
    if (isUnlocked) {
      fetchBalance().catch((err) => console.error(err.stack));

      const refreshBalance = setInterval(fetchBalance, config.refreshInterval);
      return () => clearInterval(refreshBalance);
    }
  }, [isUnlocked, poolName, bathFinance, fetchBalance]);

  return balance;
};

export default useEarnings;
