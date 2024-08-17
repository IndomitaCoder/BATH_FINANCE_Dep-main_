import { useEffect, useState } from 'react';
import useBATHFinance from '../useBATHFinance';
import { AllocationTime } from '../../tomb-finance/types';

const useClaimRewardTimerMasonry = () => {
  const [time, setTime] = useState<AllocationTime>({
    from: new Date(),
    to: new Date(),
  });
  const bathFinance = useBATHFinance();

  useEffect(() => {
    if (bathFinance) {
      bathFinance.getUserClaimRewardTime().then(setTime);
    }
  }, [bathFinance]);
  return time;
};

export default useClaimRewardTimerMasonry;
