import { MAP_STR_ABI } from 'configs/abis';
import { MAPNETTOADDRESS } from 'configs/contract_address_config';
import { SEPOLIA_ADDRESSES, WLD_ADDRESSES } from 'configs/contract_addresses';
import { FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import { ABI, CONTRACT_ADDRESSES, FUNCTION, Field } from 'utils/enum';
import { to_wei, setDeadline, handleSwapBtnState } from 'utils/util';
import { Spin, Space } from 'antd';
// import Web3 from 'web3';

const Button = styled.button`
  width: 100%;
  color: #4e7be2;
  background-color: #1e3062;
  padding: 15px;
  font-size: 20px;
  border-radius: 15px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: #1c2232;
  }

  &:disabled {
    background-color: rgb(255, 255, 255, 0.1);
    color: #6a6a6a;
    cursor: not-allowed;
  }
`;

export const AiSwapButton = ({
  loader,
  input,
  output,
  btnState,
  disabled,
  spotlightToken,
  setInputHandler,
  funcExec
}: AiSwapProps) => {
  return <Button disabled={disabled} onClick={funcExec}>
    {
      loader ? (<Space size="large">
        <Spin />
      </Space>) :
        handleSwapBtnState(btnState, spotlightToken)
    }
  </Button>;
};
