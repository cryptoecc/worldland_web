import { MAP_STR_ABI } from 'configs/abis';
import { MAPNETTOADDRESS } from 'configs/contract_address_config';
import { SEPOLIA_ADDRESSES, WLD_ADDRESSES } from 'configs/contract_addresses';
import { FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import { ABI, CONTRACT_ADDRESSES } from 'utils/enum';
import { to_wei, setDeadline } from 'utils/util';
// import Web3 from 'web3';
import {
  useAccount,
  useNetwork,
  useSwitchNetwork,
  useBalance,
  useContractWrite,
  useWaitForTransaction,
  useContractRead,
} from 'wagmi';

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
  //   const [web3, setWeb3] = useState<Web3 | null>(null);
  const { address, isConnected } = useAccount();

  console.log(address);

  const token0 = '0x28707aFb11CC97DD5884E6466eE8E5A7F1301132';
  const token1 = '0x689ccf9a3B752C8Cb19fF5c6eCeec36eA86233AB';

  const swapPath = [token0, token1];

  const handleSwap = async () => {
    let deadline = await setDeadline(3600);
    Swap({
      args: [to_wei(input), to_wei(output), swapPath, address, deadline],
    });
  };

  const { data: _, write: Swap } = useContractWrite({
    address: WLD_ADDRESSES[CONTRACT_ADDRESSES.ROUTER],
    abi: MAP_STR_ABI[ABI.LVSWAPV2_ROUTER],
    functionName: 'swapExactTokensForTokens',
    onSuccess(data) {
      console.log({ data });
    },
    onError(err) {
      console.log({ approvalErrB: err });
    },
  });

  //   console.log(web3);

  //   const asdf = web3.eth
  //     .getAccounts()
  //     .then((accounts) => {
  //       const accountAddress = accounts[0]; // 첫 번째 계정 주소를 가져옵니다.
  //       console.log('계정 주소:', accountAddress);
  //     })
  //     .catch((error) => {
  //       console.error('계정 주소 가져오기 오류:', error);
  //     });

  //   console.log(asdf);

  //   console.log(account);

  //   const getBlockNumber = async () => {
  //     if (web3) {
  //       const latest = BigInt((await web3.eth.getBlock('latest')).number);
  //       const current = latest + BigInt(1);
  //       const next = current + BigInt(1);
  //       return { latest: latest, current: current, next: next };
  //     }
  //   };
  //   useEffect(() => {
  //     let currentWeb3 = web3;
  //     if (!currentWeb3 && typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
  //       currentWeb3 = new Web3(window.ethereum);
  //       setWeb3(currentWeb3);
  //     }
  //   }, [web3]);

  //   const setDeadline = async (expiry: number) => {
  //     if (web3) {
  //       const blockGenerationTime = BigInt(15);
  //       const latestTimeStamp = BigInt((await web3.eth.getBlock('latest')).timestamp);
  //       return latestTimeStamp + blockGenerationTime + BigInt(expiry);
  //     }
  //   };

  //   const swapTransaction = async () => {
  //     if (web3) {
  //       const contract = await new web3.eth.Contract(
  //         MAP_STR_ABI[ABI.UNISWAPV2_ROUTER],
  //         WLD_ADDRESSES[CONTRACT_ADDRESSES.ROUTER],
  //       );

  //       const factory = await new web3.eth.Contract(
  //         MAP_STR_ABI[ABI.UNISWAPV2_FACTORY],
  //         WLD_ADDRESSES[CONTRACT_ADDRESSES.FACTORY],
  //       );

  //       const getData = await (factory.methods.allPairsLength as any)().call();
  //       console.log(getData);

  //       console.log('swap', contract);

  //   const weiInput = web3.utils.toWei(input, 'ether');
  //   const weiOutput = web3.utils.toWei(output, 'ether');

  //   //       const accounts = await web3.eth.getAccounts();
  //   //       console.log('swap user', accounts);

  //   //       let deadline = await setDeadline(3600);
  //   //       console.log('dead', deadline);
  //   //       const asdf = deadline?.toString();

  //   // const token0 = '0x28707aFb11CC97DD5884E6466eE8E5A7F1301132';
  //   // const token1 = '0x689ccf9a3B752C8Cb19fF5c6eCeec36eA86233AB';

  //   // const swapPath = [token0, token1];

  //   //       console.log(weiOutput);
  //   //       console.log(weiInput);

  //   const response = await(contract.methods.swapExactTokensForTokens as any)(
  //     weiInput,
  //     weiOutput,
  //     swapPath,
  //     '0x7d3C7Cca6958E2323BbD0759Ba7F4C29b5f82C9f',
  //     asdf,
  //   )
  //     .send({
  //       from: '0x7d3C7Cca6958E2323BbD0759Ba7F4C29b5f82C9f',
  //       gas: 20000,
  //       gasPrice: '20000000000',
  //     })
  //     .on('transactionHash', (hash: any) => {
  //       console.log('Transaction hash', hash);
  //     })
  //     .on('receipt', (receipt: any) => {
  //       console.log('Transaction receipt:', receipt);
  //     })
  //     .on('error', (error: any) => {
  //       console.error('Transaction error:', error);
  //     });

  //       console.log(response);
  //     }
  //   };

  const handleOneClick = () => {
    console.log('click');
    handleSwap();
    // swapTransaction();
  };

  //   swapTransaction();

  return <Button onClick={handleOneClick}>Swap</Button>;
};
