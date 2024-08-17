import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent } from '@material-ui/core';
import usePoolInfoByPid from '../../hooks/steamroom/usePoolInfo';
import { getFullDisplayBalance } from '../../utils/formatBalance';
import useWallet from 'use-wallet';
import SteamRoomAction from './SteamRoomAction';
import MiniLoader from '../../components/MiniLoader';
import useBATHFinance from '../../hooks/useBATHFinance';
import ERC20 from '../../tomb-finance/ERC20';
import { ethers } from 'ethers';

const SteamRoomCard = ({ pId, PoolInfo }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isSteamRoomActionOpen, setisSteamRoomActionOpen] = useState(false)
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
      const info = await bathFinance.STEAMROOM.poolInfo(pId)
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner(account);
      const lpContract = new ERC20(info?.token, signer, 'LP')
      let res_d = await bathFinance.STEAMROOM.userInfo(pId, account);
      let res_s = await lpContract.contract.symbol();
      let res_t = await lpContract.balanceOf(bathFinance.STEAMROOM.address);
      setlpSymbol(res_s);
      settvl(res_t)
      setdeposited(Number(getFullDisplayBalance(res_d['amount'], lpContract.decimal)))
      setearnings(Number(getFullDisplayBalance(res_d['claimedTub'], 18)));

    //APR & TVL
    
      let TubPerSecond = await bathFinance?.STEAMROOM?.tubPerSecond();
      TubPerSecond = Number(TubPerSecond)/10**18;
      let accTubPerShare =  Number(getFullDisplayBalance(info?.accTubPerShare));
      if (accTubPerShare > 0){
        setAPR(TubPerSecond * 24 * 3600 * 100 / accTubPerShare);
      }

  /*
  const lpTokenPrice  = getDepositTokenPriceInDollars(...);
  . ;
      
  TVL = lpTokenBalance * lpTokenPrice

  BathTokenPerSecond = from contract .bathPerSecond
  BathTokenPerDay = BathTokenPerSecond * 3600 * 24

  const BathPrice = ..
  totalRewardPricePerDay = BathPrice * BathTokenPerDay
  totalPriceOfBathPerShare = BathPrice * pool.accBathPerShare
  
  dailyAPR =( BathTokenPerDay / pool.accBathPerShare ) * 100
  */

    } catch (error) {
      console.log(error, "ERROR")
    }

  }

  return (
    <>
      {poolInfo?.token ?
        <Box style={{ margin: 0 }}>
          <Card variant="outlined" style={styles}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => { setisSteamRoomActionOpen(!isSteamRoomActionOpen) }}
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
                  <div style={{ width: '20%', textAlign: 'center' }}>{earnings + ' TUB'}</div>
                </Box>
              </Box>
            </CardContent>
          </Card>
          <div style={{ display: !isSteamRoomActionOpen ? 'none' : 'block' }}>
            <SteamRoomAction poolInfo={poolInfo} pId={pId} />
          </div>
        </Box>
        : <div style={{ borderRadius: '50%', padding: '10px', color: 'black', display: 'inline-block' }}><MiniLoader /></div>}
    </>
  );
};

export default SteamRoomCard;
