import { useEffect, useState } from 'react';
import useBATHFinance from '../useBATHFinance';
import useRefresh from '../useRefresh';
import { parseUnits } from 'ethers/lib/utils';

const useDepositInGenesis1 = (pId: Number, amount: string) => {
  const [stat, setStat] = useState<any>();
  const { fastRefresh } = useRefresh();
  const tombFinance = useBATHFinance();

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const amountBn = parseUnits(amount, 18);
        setStat(await tombFinance.depositInGenesis1(pId, amountBn));
      }
      catch (err) {
        console.error(err)
      }
    }
    fetchUserInfo();
  }, [setStat, tombFinance, fastRefresh]);

  return stat;
};

export default useDepositInGenesis1;