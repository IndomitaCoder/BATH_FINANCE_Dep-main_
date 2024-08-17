import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import useBATHFinance from './useBATHFinance';

const useTreasuryAmount = () => {
  const [amount, setAmount] = useState(BigNumber.from(0));
  const bathFinance = useBATHFinance();

  useEffect(() => {
    if (bathFinance) {
      const { Treasury } = bathFinance.contracts;
      bathFinance.TOMB.balanceOf(Treasury.address).then(setAmount);
    }
  }, [bathFinance]);
  return amount;
};

export default useTreasuryAmount;
