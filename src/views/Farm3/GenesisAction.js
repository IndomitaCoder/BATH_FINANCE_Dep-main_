import React, { useState, useEffect } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { Box, Button, styled } from '@material-ui/core';
import { getFullDisplayBalance } from '../../utils/formatBalance';
import useWallet from 'use-wallet';
import Container from '../../components/Container/Container';
import { createGlobalStyle } from 'styled-components';
import CemeteryImage from '../../assets/img/cemetery.png';
import { pink, purple } from '@material-ui/core/colors';
import ERC20 from '../../tomb-finance/ERC20';
import useBATHFinance from '../../hooks/useBATHFinance';
import { ethers } from 'ethers';
import { useTransactionAdder } from '../../state/transactions/hooks';
import { parseUnits } from 'ethers/lib/utils';


const ColorButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: purple[900],
  '&:hover': {
    backgroundColor: purple[900],
  },
}));

const ColorButton2 = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(pink[500]),
  backgroundColor: pink[900],
  '&:hover': {
    backgroundColor: pink[900],
  },
}));

const GenesisAction = ({ poolInfo, pId }) => {
  const { path } = useRouteMatch();
  const { account } = useWallet();
  const [isDeposit, setisDeposit] = useState(true)
  const [lpBalance, setlpBalance] = useState(0)
  const [lpSymbol, setlpSymbol] = useState("");
  const [inputValue, setInputValue] = useState(null);
  const [pendingBath, setpendingBath] = useState(0);
  const [deposited, setdeposited] = useState(0)
  const addTransaction = useTransactionAdder();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const tombFinance = useBATHFinance();
  const signer = provider.getSigner(account);
  const lpContract = new ERC20(poolInfo?.token, signer, 'LP')

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
      let res_b = await lpContract.balanceOf(account)
      let res_s = await lpContract.contract.symbol();
      let res_p = await tombFinance.SAUNA.pendingwETHs(pId, account)
      let res_d = await tombFinance.SAUNA.userInfo(pId, account);
      setlpBalance(Number(getFullDisplayBalance(res_b, lpContract.decimal)));
      setlpSymbol(res_s);
      setpendingBath(Number(getFullDisplayBalance(res_p, lpContract.decimal)))
      setdeposited(Number(getFullDisplayBalance(res_d['amount'], lpContract.decimal)))
    } catch (error) {
      console.log(error)
    }

  }

  const BackgroundImage = createGlobalStyle`
  body {
    background: url(${CemeteryImage}) no-repeat !important;
    background-size: cover !important;
  }
  `;
  const onDepositClick = async () => {
    try {
      if (Number(inputValue) > 0) {
        if (poolInfo?.token) {
          let response = await lpContract.allowance(account, tombFinance.SAUNA.address)
          let allowedAmount = Number(getFullDisplayBalance(response, lpContract.decimal));
          if (allowedAmount < Number(inputValue)) {
            let response = await lpContract.approve(tombFinance.SAUNA.address, ethers.constants.MaxUint256);
            await addTransaction(response, {
              summary: `Approve ${lpContract.symbol}`,
              approval: {
                tokenAddress: lpContract.address,
                spender: account,
              },
            });
          }
          const amountBn = parseUnits(Number(inputValue).toString(), poolInfo?.token.decimal)
          let genesisFarm = tombFinance.SAUNA.connect(signer);
          response = await genesisFarm.deposit(pId, amountBn)
          await addTransaction(response, {
            summary: `Deposit ${lpContract.symbol}`,
            approval: {
              tokenAddress: lpContract.address,
              spender: account,
            },
          });
        }
      }

    } catch (error) {
      console.log(error)
    }
    fetchData()
  }

  const onWithdrawClick = async () => {
    try {
      if (Number(inputValue) > 0) {
        const amountBn = parseUnits(Number(inputValue).toString(), poolInfo?.token.decimal)
        let genesisFarm = tombFinance.SAUNA.connect(signer);
        let response = await genesisFarm.withdraw(pId, amountBn);
        await addTransaction(response, {
          summary: `Withdraw ${lpContract.symbol} and BATH`,
          approval: {
            tokenAddress: lpContract.address,
            spender: account,
          },
        });
      }

    } catch (error) {
      console.log(error)
    }
    fetchData()
  }

  const onHarvestClick = async () => {
    try {
      const amountBn = parseUnits('0', poolInfo?.token.decimal)
      let genesisFarm = tombFinance.SAUNA.connect(signer);
      let response = await genesisFarm.withdraw(pId, amountBn);
      await addTransaction(response, {
        summary: `Harvest BATH`,
        approval: {
          tokenAddress: lpContract.address,
          spender: account,
        },
      });
    } catch (error) {
      console.log(error)
    }
    fetchData()
  }

  return (
    <Switch>
      {/* <Page> */}
      <Route exact path={path}>
        <BackgroundImage />
        <Container maxWidth="lg">
          <Box mt={5} width={`100%`} style={{ display: "flex", flexDirection: 'column', backgroundColor: 'rgba(1,1,1,0.2)', padding: '50px 20px', borderRadius: '20px', backdropFilter: 'blur(15px)', margin: 0 }}>
            <div style={{ color: 'white', display: 'flex', flexFlow: 'wrap', flexDirection: 'column-reverse' }}>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <p style={{ margin: 0 }}>Balance:&nbsp;</p>
                <p style={{ fontSize: 'larger', margin: 0 }}>{lpBalance + ' ' + lpSymbol}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <p style={{ margin: 0 }}>Pending BATH: &nbsp;</p>
                <p style={{ fontSize: 'larger', margin: 0 }}>{pendingBath + ' BATH'}</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <div style={{ padding: '10px', borderRadius: '20px', border: '1px solid white', display: 'flex' }}>
                <div
                  onClick={() => {
                    setInputValue(null);
                    setisDeposit(true)
                  }}
                  style={{ padding: '10px', borderRadius: '20px', border: isDeposit ? '1px solid white' : '1px solid rgba(0,0,0,0)', textAlign: 'center', cursor: 'pointer', backgroundColor: isDeposit ? 'white' : '', width: '50%' }}>
                  <p style={{ color: !isDeposit ? 'white' : 'black', margin: 0 }}>Deposit</p>
                </div>
                <div onClick={() => {
                  setInputValue(null);
                  setisDeposit(false)
                }}
                  style={{ padding: '10px', borderRadius: '20px', width: '50%', border: !isDeposit ? '1px solid white' : '1px solid rgba(0,0,0,0)', textAlign: 'center', cursor: 'pointer', backgroundColor: !isDeposit ? 'white' : '' }}>
                  <p style={{ color: isDeposit ? 'white' : 'black', margin: 0 }}>Withdraw</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', borderRadius: '20px', border: '1px solid white', padding: '5px 15px', marginTop: '20px' }}>
                <div style={{ margin: '20px 0 0 0', width: "100%", position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <input placeholder='LP Token Amount' type='number' inputMode="numeric" min="0" max="0"
                    value={inputValue === null ? '' : inputValue}
                    style={{
                      padding: '0 10px', border: 'none',
                      borderBottom: '1px solid gray', cursor: 'pointer', fontSize: '1.5rem', backgroundColor: 'rgba(1,1,1,0)', color: 'white', width: "70%", boxSizing: 'border-box', outline: 'none', WebkitAppearance: 'none',
                      MozAppearance: 'textfield',
                      textAlign: 'center'
                    }}
                    onChange={(v) => {

                      setInputValue(v.target.value)
                    }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                    <Button variant="outlined" size="small" onClick={() => { setInputValue(isDeposit ? lpBalance : deposited) }}>
                      Max
                    </Button>
                    <Button variant="outlined" size="small" style={{ marginLeft: '10px' }} onClick={() => { setInputValue(isDeposit ? lpBalance / 2 : deposited / 2) }}>
                      50%
                    </Button>
                  </div>
                </div>

              </div>
              <ColorButton
                variant="contained"
                color="primary"
                style={{ marginTop: '20px' }}
                onClick={isDeposit ? onDepositClick : onWithdrawClick}
              >
                {isDeposit ? "Deposit" : 'Withdraw'}
              </ColorButton>
              {!isDeposit ?
                <ColorButton2
                  variant="contained"
                  color="primary"
                  style={{ marginTop: '20px' }}
                  onClick={onHarvestClick}
                >
                  Harvest BATH
                </ColorButton2> : null}
              {isDeposit ? <p style={{ color: 'white', textAlign: 'center' }}>There is a {Number(poolInfo?.depositFee) / 100}% deposit fee for this staking pool.</p> : null}
            </div>
          </Box>
        </Container>
      </Route>
      {/* </Page> */}
    </Switch>
  );
};

export default GenesisAction;
