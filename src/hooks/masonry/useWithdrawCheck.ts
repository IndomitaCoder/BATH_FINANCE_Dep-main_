import { useEffect, useState } from 'react';
import useBATHFinance from './../useBATHFinance';
import useRefresh from '../useRefresh';

const useWithdrawCheck = () => {
  const [canWithdraw, setCanWithdraw] = useState(false);
  const bathFinance = useBATHFinance();
  const { slowRefresh } = useRefresh();
  const isUnlocked = bathFinance?.isUnlocked;

  useEffect(() => {
    async function canUserWithdraw() {
      try {
        setCanWithdraw(await bathFinance.canUserUnstakeFromMasonry());
      } catch (err) {
        console.error(err);
      }
    }
    if (isUnlocked) {
      canUserWithdraw();
    }
  }, [isUnlocked, bathFinance, slowRefresh]);

  return canWithdraw;
};

export default useWithdrawCheck;
