import { useCallback } from 'react';
import useBATHFinance from '../useBATHFinance';
import useHandleTransactionReceipt from '../useHandleTransactionReceipt';
// import { BigNumber } from "ethers";
import { parseUnits } from 'ethers/lib/utils';


const useSwapTBondToTShare = () => {
	const bathFinance = useBATHFinance();
	const handleTransactionReceipt = useHandleTransactionReceipt();

	const handleSwapTShare = useCallback(
		(tbondAmount: string) => {
			const tbondAmountBn = parseUnits(tbondAmount, 18);
			handleTransactionReceipt(
				bathFinance.swapTBondToTShare(tbondAmountBn),
				`Swap ${tbondAmount} TBond to TShare`
			);
		},
		[bathFinance, handleTransactionReceipt]
	);
	return { onSwapTShare: handleSwapTShare };
};

export default useSwapTBondToTShare;