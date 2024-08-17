import { useEffect, useState } from 'react';
import useBATHFinance from './../useBATHFinance';
import { AllocationTime } from '../../tomb-finance/types';

const useUnstakeTimerMasonry = () => {
  const [time, setTime] = useState<AllocationTime>({
    from: new Date(),
    to: new Date(),
  });
  const bathFinance = useBATHFinance();

  useEffect(() => {
    if (bathFinance) {
      bathFinance.getUserUnstakeTime().then(setTime);
    }
  }, [bathFinance]);
  return time;
};

export default useUnstakeTimerMasonry;
