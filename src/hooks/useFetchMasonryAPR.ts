import { useEffect, useState } from 'react';
import useBATHFinance from './useBATHFinance';
import useRefresh from './useRefresh';

const useFetchMasonryAPR = () => {
  const [apr, setApr] = useState<number>(0);
  const bathFinance = useBATHFinance();
  const { slowRefresh } = useRefresh();

  useEffect(() => {
    async function fetchMasonryAPR() {
      try {
        setApr(await bathFinance.getMasonryAPR());
      } catch (err) {
        console.error(err);
      }
    }
    fetchMasonryAPR();
  }, [setApr, bathFinance, slowRefresh]);

  return apr;
};

export default useFetchMasonryAPR;
