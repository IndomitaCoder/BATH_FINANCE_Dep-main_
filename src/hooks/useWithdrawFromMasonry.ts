import { useCallback } from 'react';
import useBATHFinance from './useBATHFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useWithdrawFromMasonry = () => {
  const bathFinance = useBATHFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleWithdraw = useCallback(
    (amount: string) => {
      handleTransactionReceipt(
        bathFinance.withdrawShareFromMasonry(amount),
        `Withdraw ${amount} TSHARE from the masonry`,
      );
    },
    [bathFinance, handleTransactionReceipt],
  );
  return { onWithdraw: handleWithdraw };
};

export default useWithdrawFromMasonry;
