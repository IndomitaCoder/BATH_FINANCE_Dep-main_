import { useCallback, useEffect, useState } from 'react';
import useBATHFinance from './useBATHFinance';
import useStakedBalanceOnMasonry from './useStakedBalanceOnMasonry';

const useMasonryVersion = () => {
  const [masonryVersion, setMasonryVersion] = useState('latest');
  const bathFinance = useBATHFinance();
  const stakedBalance = useStakedBalanceOnMasonry();

  const updateState = useCallback(async () => {
    setMasonryVersion(await bathFinance.fetchMasonryVersionOfUser());
  }, [bathFinance?.isUnlocked, stakedBalance]);

  useEffect(() => {
    if (bathFinance?.isUnlocked) {
      updateState().catch((err) => console.error(err.stack));
    }
  }, [bathFinance?.isUnlocked, stakedBalance]);

  return masonryVersion;
};

export default useMasonryVersion;
