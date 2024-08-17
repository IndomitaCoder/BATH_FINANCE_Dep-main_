import { useCallback } from 'react';
import useBATHFinance from './useBATHFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useHarvestFromMasonry = () => {
  const bathFinance = useBATHFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleReward = useCallback(() => {
    handleTransactionReceipt(bathFinance.harvestCashFromMasonry(), 'Claim TOMB from Masonry');
  }, [bathFinance, handleTransactionReceipt]);

  return { onReward: handleReward };
};

export default useHarvestFromMasonry;
