import { useEffect, useState } from 'react';
import useBATHFinance from './useBATHFinance';
import { AllocationTime } from '../tomb-finance/types';
import useRefresh from './useRefresh';


const useTreasuryAllocationTimes = () => {
  const { slowRefresh } = useRefresh();
  const [time, setTime] = useState<AllocationTime>({
    from: new Date(),
    to: new Date(),
  });
  const bathFinance = useBATHFinance();
  useEffect(() => {
    if (bathFinance) {
      bathFinance.getTreasuryNextAllocationTime().then(setTime);
    }
  }, [bathFinance, slowRefresh]);
  return time;
};

export default useTreasuryAllocationTimes;
