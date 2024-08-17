import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import useBATHFinance from './useBATHFinance';
import useRefresh from './useRefresh';

const useTotalStakedOnMasonry = () => {
  const [totalStaked, setTotalStaked] = useState(BigNumber.from(0));
  const bathFinance = useBATHFinance();
  const { slowRefresh } = useRefresh();
  const isUnlocked = bathFinance?.isUnlocked;

  useEffect(() => {
    async function fetchTotalStaked() {
      try {
        setTotalStaked(await bathFinance.getTotalStakedInMasonry());
      } catch (err) {
        console.error(err);
      }
    }
    if (isUnlocked) {
      fetchTotalStaked();
    }
  }, [isUnlocked, slowRefresh, bathFinance]);

  return totalStaked;
};

export default useTotalStakedOnMasonry;
