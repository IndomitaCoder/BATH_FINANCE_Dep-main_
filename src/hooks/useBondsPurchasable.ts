import { useCallback, useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import ERC20 from '../tomb-finance/ERC20';
import useBATHFinance from './useBATHFinance';
import config from '../config';

const useBondsPurchasable = () => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const bathFinance = useBATHFinance();

  useEffect(() => {
    async function fetchBondsPurchasable() {
      try {
        setBalance(await bathFinance.getBondsPurchasable());
      }
      catch (err) {
        console.error(err);
      }
    }
    fetchBondsPurchasable();
  }, [setBalance, bathFinance]);

  return balance;
};

export default useBondsPurchasable;
