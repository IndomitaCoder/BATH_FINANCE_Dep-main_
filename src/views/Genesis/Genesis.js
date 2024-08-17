import React, { useState, useEffect } from 'react';
import { useWallet } from 'use-wallet';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { Box, Container, Typography } from '@material-ui/core';


import UnlockWallet from '../../components/UnlockWallet';
import Page from '../../components/Page';
import GenesisCard from './GenesisCard';
import CemeteryImage from '../../assets/img/cemetery.png';
import { createGlobalStyle } from 'styled-components';
import { POOL_TOKEN_PAIR } from '../../utils/constants';
import useBATHFinance from '../../hooks/useBATHFinance';


const BackgroundImage = createGlobalStyle`
  body {
    background: url(${CemeteryImage}) no-repeat !important;
    background-size: cover !important;
  }
`;

const Genesis = () => {
  const { path } = useRouteMatch();
  const { account } = useWallet();
  const pooinfo = POOL_TOKEN_PAIR;
  const bathFinance = useBATHFinance();
  const [startTime, setstartTime] = useState('')
  const [endTime, setendTime] = useState('')
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!!account && bathFinance && bathFinance?.provider) fetchData();
    }, 10000);
    return () => {
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])
  const fetchData = async () => {
    let start = await bathFinance?.GENESISFARM?.poolStartTime();
    let end = await bathFinance?.GENESISFARM?.poolEndTime()
    setstartTime(new Date(Number(start) * 1000).toUTCString())
    setendTime(new Date(Number(end) * 1000).toUTCString())
  }
  return (
    <Switch>
      <Page>
        <Route exact path={path}>
          <BackgroundImage />
          {!!account ? (
            <Container maxWidth="lg">
              <Typography color="textPrimary" align="center" variant="h3" gutterBottom>
                Genesis
              </Typography>

              <Box mt={5} width={`100%`}>
                <Typography color="textPrimary" variant="h4" gutterBottom>
                  Earn BATH by staking LP
                </Typography>
                <div style={{ display: 'flex', flexDirection: 'column', color: "white" }}>
                  <p style={{ margin: 0 }}>Pool starts in  {startTime}</p>
                  <p style={{ margin: 0 }}>Pool ends in  {endTime}</p>
                </div>
                <div style={{ backgroundColor: 'rgba(1,1,1,0.2)', padding: '50px 20px', borderRadius: '20px', backdropFilter: 'blur(15px)' }}>
                  <div style={{
                    padding: '20px',
                    background: 'rgb(44 0 63)',
                    display: 'flex',
                    flexDirection: 'row',
                    color: 'white',
                    borderRadius: '20px 20px 0 0'
                  }}>
                    <div style={{ width: '20%', textAlign: 'center' }}>Pool</div>
                    <div style={{ width: '20%', textAlign: 'center' }}>APR</div>
                    <div style={{ width: '20%', textAlign: 'center' }}>TVL </div>
                    <div style={{ width: '20%', textAlign: 'center' }}>Deposited</div>
                    <div style={{ width: '20%', textAlign: 'center' }}>Claimed</div>
                  
                  </div>
                  {
                    pooinfo.map((item, i) => <div key={i} style={{
                      borderBottom: '1px solid gray',
                      marginBottom: '10px'
                    }}><React.Fragment >
                        <GenesisCard pId={i} PoolInfo={item} poolPair={pooinfo} />
                      </React.Fragment></div>)
                  }
                </div>
              </Box>
            </Container>
          ) : (
            <UnlockWallet />
          )}
        </Route>
      </Page>
    </Switch >
  );
};

export default Genesis;
