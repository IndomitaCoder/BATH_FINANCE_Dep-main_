import { useCallback } from 'react';
import useBATHFinance from './useBATHFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useRedeemOnMasonry = (description?: string) => {
  const bathFinance = useBATHFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleRedeem = useCallback(() => {
    const alertDesc = description || 'Redeem TSHARE from Masonry';
    handleTransactionReceipt(bathFinance.exitFromMasonry(), alertDesc);
  }, [bathFinance, description, handleTransactionReceipt]);
  return { onRedeem: handleRedeem };
};

export default useRedeemOnMasonry;
