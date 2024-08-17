import { useContext } from 'react';
import { Context } from '../contexts/BATHFinanceProvider';

const useBATHFinance = () => {
  const { bathFinance } = useContext(Context);
  return bathFinance;
};

export default useBATHFinance;
