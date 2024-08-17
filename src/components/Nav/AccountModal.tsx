import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getFullDisplayBalance } from '../../utils/formatBalance';

import Label from '../Label';
import Modal from '../Modal';
import ModalTitle from '../ModalTitle';
import TokenSymbol from '../TokenSymbol';
import { ethers } from 'ethers';
import useWallet from 'use-wallet';
declare global {
  interface Window {
    ethereum?: any;
  }
}

const AccountModal = () => {
  const { account } = useWallet();
  const provider = new ethers.providers.Web3Provider(window?.ethereum);
  const [bnbBal, setBNBBAL] = useState(null);
  const fetchData = async () => {
    setBNBBAL(await provider.getBalance(account));
  };
  useEffect(() => {
    fetchData();
    const intervalId = setInterval(() => {
      fetchData();
    }, 10000);

    return () => {
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Modal>
      <ModalTitle text="My Wallet" />
      <Label text={account} />
      <Balances>
        <StyledBalanceWrapper>
          <TokenSymbol symbol="TOMB" />
          <StyledBalance>
            <StyledValue>{bnbBal === null ? 0 : Number(getFullDisplayBalance(bnbBal, 18))}</StyledValue>
            <Label text="BNB Available" />
          </StyledBalance>
        </StyledBalanceWrapper>
      </Balances>
    </Modal>
  );
};

const StyledValue = styled.div`
  //color: ${(props) => props.theme.color.grey[300]};
  font-size: 30px;
  font-weight: 700;
`;

const StyledBalance = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const Balances = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: ${(props) => props.theme.spacing[4]}px;
`;

const StyledBalanceWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: 0 ${(props) => props.theme.spacing[3]}px;
`;

export default AccountModal;
