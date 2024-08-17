import { useCallback } from 'react';
import useBATHFinance from './useBATHFinance';
import { Bank } from '../tomb-finance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useRedeem = (bank: Bank) => {
  const bathFinance = useBATHFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleRedeem = useCallback(() => {
    handleTransactionReceipt(bathFinance.exit(bank.contract, bank.poolId), `Redeem ${bank.contract}`);
  }, [bank, bathFinance, handleTransactionReceipt]);

  return { onRedeem: handleRedeem };
};

export default useRedeem;
