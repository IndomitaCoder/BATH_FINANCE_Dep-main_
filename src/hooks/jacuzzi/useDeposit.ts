import { useEffect, useState } from 'react';
import useBATHFinance from '../useBATHFinance';
import useRefresh from '../useRefresh';
import { parseUnits } from 'ethers/lib/utils';

const useDepositInGenesis2 = (pId: Number, amount: string) => {
  const [stat, setStat] = useState<any>();
  const { fastRefresh } = useRefresh();
  const bathFinance = useBATHFinance();

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const amountBn = parseUnits(amount, 18);
        setStat(await bathFinance.depositInGenesis2(pId, amountBn));
      }
      catch (err) {
        console.error(err)
      }
    }
    fetchUserInfo();
  }, [setStat, bathFinance, fastRefresh]);

  return stat;
};

export default useDepositInGenesis2;