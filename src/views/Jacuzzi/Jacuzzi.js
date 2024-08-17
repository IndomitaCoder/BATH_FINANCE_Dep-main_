import React, { useState, useEffect } from 'react';
import { useWallet } from 'use-wallet';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { Box, Container, Typography } from '@material-ui/core';


import UnlockWallet from '../../components/UnlockWallet';
import Page from '../../components/Page';
import JacuzziCard from './JacuzziCard';
import CemeteryImage from '../../assets/img/cemetery.png';
import { createGlobalStyle } from 'styled-components';
import { POOL_TOKEN_PAIR_2 } from '../../utils/constants';
import useBATHFinance from '../../hooks/useBATHFinance';


const BackgroundImage = createGlobalStyle`
  body {
    background: url(${CemeteryImage}) no-repeat !important;
    background-size: cover !important;
  }
`;

const Jacuzzi = () => {
  const { path } = useRouteMatch();
  const { account } = useWallet();
  const pooinfo = POOL_TOKEN_PAIR_2;
  const bathFinance = useBATHFinance();

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

  }
  return (
    <Switch>
      <Page>
        <Route exact path={path}>
          <BackgroundImage />
          {!!account ? (
            <Container maxWidth="lg">
              <Typography color="textPrimary" align="center" variant="h3" gutterBottom>
                Jacuzzi
              </Typography>

              <Box mt={5}>
                <Typography color="textPrimary" variant="h4" gutterBottom>
                  Earn BATH by any LP
                </Typography>

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
                        <JacuzziCard pId={i} PoolInfo={item} poolPair={pooinfo} />
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

export default Jacuzzi;
