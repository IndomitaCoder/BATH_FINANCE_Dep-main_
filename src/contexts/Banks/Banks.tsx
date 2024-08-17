import React, { useCallback, useEffect, useState } from 'react';
import Context from './context';
import useBATHFinance from '../../hooks/useBATHFinance';
import { Bank } from '../../tomb-finance';
import config, { bankDefinitions } from '../../config';

const Banks: React.FC = ({ children }) => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const bathFinance = useBATHFinance();
  const isUnlocked = bathFinance?.isUnlocked;

  const fetchPools = useCallback(async () => {
    const banks: Bank[] = [];

    for (const bankInfo of Object.values(bankDefinitions)) {
      if (bankInfo.finished) {
        if (!bathFinance.isUnlocked) continue;

        // only show pools staked by user
        const balance = await bathFinance.stakedBalanceOnBank(
          bankInfo.contract,
          bankInfo.poolId,
          bathFinance.myAccount,
        );
        if (balance.lte(0)) {
          continue;
        }
      }
      banks.push({
        ...bankInfo,
        address: config.deployments[bankInfo.contract].address,
        depositToken: bathFinance.externalTokens[bankInfo.depositTokenName],
        earnToken: bankInfo.earnTokenName === 'TOMB' ? bathFinance.TOMB : bathFinance.TSHARE,
      });
    }
    banks.sort((a, b) => (a.sort > b.sort ? 1 : -1));
    setBanks(banks);
  }, [bathFinance, setBanks]);

  useEffect(() => {
    if (bathFinance) {
      fetchPools().catch((err) => console.error(`Failed to fetch pools: ${err.stack}`));
    }
  }, [isUnlocked, bathFinance, fetchPools]);

  return <Context.Provider value={{ banks }}>{children}</Context.Provider>;
};

export default Banks;
