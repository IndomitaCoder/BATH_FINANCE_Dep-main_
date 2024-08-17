import { useCallback } from 'react';
import useBATHFinance from './useBATHFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import { Bank } from '../tomb-finance';

const useHarvest = (bank: Bank) => {
  const bathFinance = useBATHFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleReward = useCallback(() => {
    handleTransactionReceipt(
      bathFinance.harvest(bank.contract, bank.poolId),
      `Claim ${bank.earnTokenName} from ${bank.contract}`,
    );
  }, [bank, bathFinance, handleTransactionReceipt]);

  return { onReward: handleReward };
};

export default useHarvest;
