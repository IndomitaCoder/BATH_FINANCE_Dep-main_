import { useCallback } from 'react';
import useBATHFinance from './useBATHFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useStakeToMasonry = () => {
  const bathFinance = useBATHFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleStake = useCallback(
    (amount: string) => {
      handleTransactionReceipt(bathFinance.stakeShareToMasonry(amount), `Stake ${amount} TSHARE to the masonry`);
    },
    [bathFinance, handleTransactionReceipt],
  );
  return { onStake: handleStake };
};

export default useStakeToMasonry;
