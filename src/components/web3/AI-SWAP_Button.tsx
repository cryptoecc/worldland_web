import { MAP_STR_ABI } from 'configs/abis';
import { WLD_ADDRESSES } from 'configs/contract_addresses';
import { FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import { ABI, CONTRACT_ADDRESSES } from 'utils/enum';
import Web3 from 'web3';

interface Props {
  onAccountConnected: (account: string) => void;
}

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
`;

export const AiSwapButton = ({ input, output }: AiSwapProps) => {
  const [web3, setWeb3] = useState<Web3 | null>(null);

  //   const getBlockNumber = async () => {
  //     if (web3) {
  //       const latest = BigInt((await web3.eth.getBlock('latest')).number);
  //       const current = latest + BigInt(1);
  //       const next = current + BigInt(1);
  //       return { latest: latest, current: current, next: next };
  //     }
  //   };
  useEffect(() => {
    let currentWeb3 = web3;
    if (!currentWeb3 && typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      currentWeb3 = new Web3(window.ethereum);
      setWeb3(currentWeb3);
    }
  }, [web3]);

  const setDeadline = async (expiry: number) => {
    if (web3) {
      const blockGenerationTime = BigInt(15);
      const latestTimeStamp = BigInt((await web3.eth.getBlock('latest')).timestamp);
      return latestTimeStamp + blockGenerationTime + BigInt(expiry);
    }
  };

  const swapTransaction = async () => {
    if (web3) {
      const contract = await new web3.eth.Contract(
        MAP_STR_ABI[ABI.UNISWAPV2_ROUTER],
        WLD_ADDRESSES[CONTRACT_ADDRESSES.ROUTER],
      );

      const factory = await new web3.eth.Contract(
        MAP_STR_ABI[ABI.UNISWAPV2_FACTORY],
        WLD_ADDRESSES[CONTRACT_ADDRESSES.FACTORY],
      );

      const getData = await (factory.methods.allPairsLength as any)().call();
      console.log(getData);

      console.log('swap', contract);

      const weiInput = web3.utils.toWei(input, 'ether');
      const weiOutput = web3.utils.toWei(output, 'ether');

      const accounts = await web3.eth.getAccounts();
      console.log('swap user', accounts);

      let deadline = await setDeadline(3600);
      console.log('dead', deadline);
      const asdf = deadline?.toString();

      const privateKey = process.env.REACT_APP_PRIVATE_KEY;

      const account = process.env.REACT_APP_ACCOUNT;

      const token0 = '0x28707aFb11CC97DD5884E6466eE8E5A7F1301132';
      const token1 = '0x689ccf9a3B752C8Cb19fF5c6eCeec36eA86233AB';

      const swapPath = [token0, token1];

      console.log(weiOutput);
      console.log(weiInput);

      const response = await (contract.methods.swapExactTokensForTokens as any)(
        weiOutput,
        weiInput,
        swapPath,
        accounts[0],
        asdf,
        { gas: 999999 },
      )
        .send({
          from: accounts[0],
          gas: 20000,
          gasPrice: '20000000000',
        })
        .on('transactionHash', (hash: any) => {
          console.log('Transaction hash', hash);
        })
        .on('receipt', (receipt: any) => {
          console.log('Transaction receipt:', receipt);
        })
        .on('error', (error: any) => {
          console.error('Transaction error:', error);
        });

      console.log(response);
    }
  };

  const handleOneClick = () => {
    console.log('click');
    swapTransaction();
  };

  //   swapTransaction();

  return <Button onClick={handleOneClick}>Swap</Button>;
};
