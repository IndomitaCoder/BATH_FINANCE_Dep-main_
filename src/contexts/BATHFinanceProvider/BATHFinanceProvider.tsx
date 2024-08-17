import React, { createContext, useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import BATHFinance from '../../tomb-finance';
import config from '../../config';

export interface BATHFinanceContext {
  bathFinance?: BATHFinance;
}

export const Context = createContext<BATHFinanceContext>({ bathFinance: null });

export const BATHFinanceProvider: React.FC = ({ children }) => {
  const { ethereum, account } = useWallet();
  const [bathFinance, setBATHFinance] = useState<BATHFinance>();

  useEffect(() => {
    if (!bathFinance) {
      const tomb = new BATHFinance(config);
      if (account) {
        // wallet was unlocked at initialization
        tomb.unlockWallet(ethereum, account);
      }
      setBATHFinance(tomb);
    } else if (account) {
      bathFinance.unlockWallet(ethereum, account);
    }
  }, [account, ethereum, bathFinance]);

  return <Context.Provider value={{ bathFinance }}>{children}</Context.Provider>;
};
