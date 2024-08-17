import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent } from '@material-ui/core';
import usePoolInfoByPid from '../../hooks/sauna/usePoolInfo';
import { getFullDisplayBalance } from '../../utils/formatBalance';
import useWallet from 'use-wallet';
import SaunaAction from './SaunaAction';
import MiniLoader from '../../components/MiniLoader';
import useBATHFinance from '../../hooks/useBATHFinance';
import ERC20 from '../../tomb-finance/ERC20';
import { ethers } from 'ethers';

const SaunaCard = ({ pId, PoolInfo }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isSaunaActionOpen, setisSaunaActionOpen] = useState(false)
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const styles = {
    backgroundColor: isHovered ? 'grey' : 'white',
    color: isHovered ? 'white' : 'black',
    padding: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease-out, color 0.3s ease-out',
  };
  const { account } = useWallet();
  const poolInfo = usePoolInfoByPid(pId);
  const [deposited, setdeposited] = useState(0);
  const [earnings, setearnings] = useState(0);
  const [tvl, settvl] = useState(0);
  const [dailyAPR, setAPR] = useState(0);
  const [lpSymbol, setlpSymbol] = useState("");
  const bathFinance = useBATHFinance();
  useEffect(() => {
    fetchData();
    const intervalId = setInterval(() => {
      fetchData();
    }, 10000);

    return () => {
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchData = async () => {
    try {
      const info = await bathFinance.SAUNA.poolInfo(pId)
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner(account);
      const lpContract = new ERC20(info?.token, signer, 'LP')
      let res_d = await bathFinance.SAUNA.userInfo(pId, account);
      let res_s = await lpContract.contract.symbol();
      let res_t = await lpContract.balanceOf(bathFinance.SAUNA.address);
      setlpSymbol(res_s);
      settvl(res_t)
      setdeposited(Number(getFullDisplayBalance(res_d['amount'], lpContract.decimal)))
      setearnings(Number(getFullDisplayBalance(res_d['claimedwETH'], 18)));

      //APR & TVL
      
        let wETHPerSecond = await bathFinance?.SAUNA?.wETHPerSecond();
        wETHPerSecond = Number(wETHPerSecond)/10**18;
        let accwETHPerShare =  Number(getFullDisplayBalance(info?.accwETHPerShare ));
        if (accwETHPerShare > 0){
          setAPR(wETHPerSecond * 24 * 3600 * 100 / accwETHPerShare);
        }
    } catch (error) {
      console.log(error)
    }

  }

  return (
    <>
      {poolInfo?.token ?
        <Box style={{ margin: 0 }}>
          <Card variant="outlined" style={styles}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => { setisSaunaActionOpen(!isSaunaActionOpen) }}
          >
            <CardContent>
              <Box style={{ position: 'relative' }}>
                <Box
                  style={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%'
                  }}
                >
                  <div style={{ width: '20%', textAlign: 'center' }}>{`${PoolInfo[0]}-${PoolInfo[1]}`}</div>
                  <div style={{ width: '20%', textAlign: 'center' }}>{dailyAPR.toFixed(2)} %</div>
                  <div style={{ width: '20%', textAlign: 'center' }}>{isNaN(Number(tvl)) || Number(tvl) === 0 ? 0 : getFullDisplayBalance(tvl, 18)}</div>
                  <div style={{ width: '20%', textAlign: 'center' }}>{deposited + ' ' + lpSymbol}</div>
                  <div style={{ width: '20%', textAlign: 'center' }}>{earnings + ' wETH'}</div>
                </Box>
              </Box>
            </CardContent>
          </Card>
          <div style={{ display: !isSaunaActionOpen ? 'none' : 'block' }}>
            <SaunaAction poolInfo={poolInfo} pId={pId} />
          </div>
        </Box>
        : <div style={{ borderRadius: '50%', padding: '10px', color: 'black', display: 'inline-block' }}><MiniLoader /></div>}
    </>
  );
};

export default SaunaCard;
