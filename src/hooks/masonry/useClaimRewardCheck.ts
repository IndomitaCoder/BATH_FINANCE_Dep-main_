import { useEffect, useState } from 'react';
import useRefresh from '../useRefresh';
import useBATHFinance from './../useBATHFinance';

const useClaimRewardCheck = () => {
  const { slowRefresh } = useRefresh();
  const [canClaimReward, setCanClaimReward] = useState(false);
  const bathFinance = useBATHFinance();
  const isUnlocked = bathFinance?.isUnlocked;

  useEffect(() => {
    async function canUserClaimReward() {
      try {
        setCanClaimReward(await bathFinance.canUserClaimRewardFromMasonry());
      } catch (err) {
        console.error(err);
      };
    }
    if (isUnlocked) {
      canUserClaimReward();
    }
  }, [isUnlocked, slowRefresh, bathFinance]);

  return canClaimReward;
};

export default useClaimRewardCheck;
