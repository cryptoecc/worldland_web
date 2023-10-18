import { useEffect, useState } from 'react';
import SwapInputTab from 'components/SwapInputTab';
import { styled } from 'styled-components';
import TokenModal from 'components/TokenModal';
import Backdrop from 'components/Backdrop';
import { chainIds } from 'configs/services/chainIds';
import { Spin, Space } from 'antd';
import {
  useAccount,
  useNetwork,
  useSwitchNetwork,
  useBalance,
  useContractWrite,
  useWaitForTransaction,
  useContractRead,
} from 'wagmi';
import { MAP_STR_ABI } from 'configs/abis';
import { WLD_ADDRESSES } from 'configs/contract_addresses';
import { from_wei, setDeadline, to_wei } from 'utils/util';
import { ABI, CHAINDS, CONTRACT_ADDRESSES, FUNCTION, Field } from '../../utils/enum';
import VideoContainer from 'components/VideoContainer';
import Video from 'components/Video';
import Web3 from 'web3';
import { MAPNETTOADDRESS } from 'configs/contract_address_config';
import { crypto_list } from 'data';
import Web3ConnectButton from 'components/web3/Web3Button';
import { useWeb3Modal, Web3NetworkSwitch } from '@web3modal/react';

const Swap = () => {
  const [modal, setModal] = useState<boolean>(false);
  const { address, isConnected } = useAccount();
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [currentTxHash, setCurrentTxHash] = useState<`0x${string}` | undefined>();
  const { open, close } = useWeb3Modal();

  // Swap Token 선택
  const [selectedToken, setSelectedToken] = useState<TokenProps>(crypto_list[0]);
  const [selected2Token, setSelected2Token] = useState<TokenProps>(crypto_list[1]);
  const [selectedInputField, setSelectedInputField] = useState('first');
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [btnState, setBtnState] = useState<number>(1);
  const approvalAmount = '1000000';
  const [disabled, setDisabled] = useState<boolean>(false);
  const [spotlightToken, setSpotlightToken] = useState<TokenProps>(crypto_list[0]);
  const [amountOut, setAmountOut] = useState<string>('');
  const [loader, setLoader] = useState<boolean>(false);

  const openModalForFirstInput = () => {
    setSelectedInputField('first');
    setModal(true);
  };

  const openModalForSecondInput = () => {
    setSelectedInputField('second');
    setModal(true);
  };

  const handleTokenClick = (token: any) => {
    if (selectedInputField === 'first') {
      // 첫 번째 입력을 위한 토큰을 선택
      setSelectedToken(token);
    } else if (selectedInputField === 'second') {
      setSelected2Token(token);
      // 두 번째 입력을 위한 토큰을 선택
      // 여기서 별도의 상태를 업데이트하거나 다른 로직을 실행
    }
    setModal(false);
  };

  const { chain } = useNetwork();

  const { chains, switchNetwork } = useSwitchNetwork({
    onSuccess(data) {
      //
    },
  });

  const { data: _amountOut } = useContractRead({
    address: MAPNETTOADDRESS[CONTRACT_ADDRESSES.ROUTER],
    abi: MAP_STR_ABI[ABI.LVSWAPV2_ROUTER],
    functionName: FUNCTION.GETAMOUNTOUT,
    watch: true,
    args: [
      MAPNETTOADDRESS[CONTRACT_ADDRESSES.FACTORY],
      to_wei(input ? input : '0'),
      selectedToken?.address,
      selected2Token?.address,
    ],
    onSuccess(data: any) {
      console.log({ amountOut: data });
      setAmountOut(data);
    },
    onError(data: any) {
      console.log({ error: data });
    },
  });

  const { write } = useContractWrite({
    chainId: chain?.id,
    address: WLD_ADDRESSES[CONTRACT_ADDRESSES.WRAPPEDETH_ADDRESS_BRIDGE],
    abi: MAP_STR_ABI[ABI.WRAPETH],
    functionName: FUNCTION.BURN,
    onMutate({ args }) {
      if (!isConnected) {
        // handleOpenNotification({
        //     status: "Please connect your wallet!",
        // });
        return;
      }
      if (chain?.id !== chainIds[CHAINDS.WORLDLAND_SEOUL]) {
        switchNetwork?.(chainIds[CHAINDS.WORLDLAND_SEOUL]);
      }

      if (input === '') {
        return;
      }

      //   setLoader(true);
      //   handleOpenNotification({
      //     status: "Sending transaction...",
      //   });
    },
    onSuccess({ hash }) {
      //   handleOpenNotification({
      //     status: "Awaiting the transaction...",
      //   });
      setCurrentTxHash(hash);
    },
    onError(error: any) {
      alert(error);
      console.log(error);
      //   handleOpenNotification({
      //     status: error?.shortMessage,
      //   });
    },
  });

  const sendTransaction = async () => {
    try {
      write({
        args: [to_wei(input)],
      });
    } catch (err) {
      console.log(err);
    }
  };

  function userInputHandler(field: Field, typedValue: string) {
    switch (field) {
      case Field.INPUT:
        console.log('input');
        setInput(typedValue);
        break;
      case Field.OUTPUT:
        console.log('output');
        setOutput(typedValue);
        break;
      default:
        break;
    }
  }

  const { data: _, write: swap } = useContractWrite({
    address: MAPNETTOADDRESS[CONTRACT_ADDRESSES.ROUTER],
    abi: MAP_STR_ABI[ABI.LVSWAPV2_ROUTER],
    functionName: FUNCTION.SWAPEXACTTOKENSFORTOKENS,
    onSuccess(data) {
      console.log({ data });
      userInputHandler(Field.INPUT, '');
      userInputHandler(Field.OUTPUT, '');
    },
    onError(err) {
      console.log({ approvalErrB: err });
    },
  });

  const { data: approvalA, write: approveA } = useContractWrite({
    address: selectedToken?.address,
    abi: MAP_STR_ABI[CONTRACT_ADDRESSES.ERC20_ABI],
    args: [MAPNETTOADDRESS[CONTRACT_ADDRESSES.ROUTER], to_wei(approvalAmount)],
    functionName: 'approve',
    onSuccess(data) {
      console.log({ approvalA: data });
      userInputHandler(Field.INPUT, '');
      userInputHandler(Field.OUTPUT, '');
      setLoader(true);
    },
    onError(err) {
      console.log({ approvalErrA: err });
      setLoader(false);
    },
  });

  const approvalConfirmation = useWaitForTransaction({
    hash: approvalA?.hash,
    staleTime: 2_000,
    onSuccess(data) {
      console.log('Approve confirmation success: ', data);
      setLoader(false);
    },
    onError(err) {
      console.log('Error: ', err);
      setLoader(false);
    },
  });

  async function handleSwap() {
    let deadline = await setDeadline(3600);
    const swapPath = [selectedToken.address, selected2Token.address];
    swap({ args: [to_wei(input), output, swapPath, address, deadline] });
  }

  function handleFunctionSelector() {
    if (!isConnected) {
      // metamask is not connected
      open();
      return;
    } else if (input === '0' || input === '') {
      // empty field
      return;
    } else if (Number(from_wei(tokenBalanceA)) < Number(input ? input : '0')) {
      // balance A is not enough
      return;
    } else if (Number(input ? input : '0') > Number(from_wei(allowanceA))) {
      // if allowanceA is low
      approveA();
    } else {
      // permission to add liquidity
      handleSwap();
    }
  }

  const { data: allowanceA } = useContractRead({
    address: selectedToken?.address,
    abi: MAP_STR_ABI[ABI.ERC20_ABI],
    functionName: 'allowance',
    args: [address, MAPNETTOADDRESS[CONTRACT_ADDRESSES.ROUTER]],
    watch: true,
    onSuccess(data: any) {
      console.log({ allowanceA: data });
    },
    onError(data: any) {
      console.log({ error: data });
    },
  });

  const { data: tokenBalanceA } = useContractRead({
    address: selectedToken?.address,
    abi: MAP_STR_ABI[ABI.ERC20_ABI],
    functionName: 'balanceOf',
    args: [address],
    watch: true,
    onSuccess(data: any) {
      console.log({ tokenBalanceA: data });
    },
    onError(data: any) {
      console.log({ error: data });
    },
  });
  const { data: tokenBalanceB } = useContractRead({
    address: selected2Token?.address,
    abi: MAP_STR_ABI[ABI.ERC20_ABI],
    functionName: 'balanceOf',
    args: [address],
    watch: true,
    onSuccess(data: any) {
      console.log({ tokenBalanceB: data });
    },
    onError(data: any) {
      console.log({ error: data });
    },
  });

  useEffect(() => {
    let currentWeb3 = web3;

    if (!currentWeb3 && typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      currentWeb3 = new Web3(window.ethereum);
      setWeb3(currentWeb3);
    }
  }, [input]);

  useEffect(() => {
    if (!isConnected) {
      // metamask is not connected
      // setDisabled(true);
      setBtnState(4);
    } else if (input === '0' || input === '') {
      // empty field
      setDisabled(true);
      setBtnState(5);
      setSpotlightToken(selectedToken);
    } else if (Number(from_wei(tokenBalanceA)) < Number(input ? input : '0')) {
      // balance A is not enough
      setDisabled(true);
      setBtnState(1);
      setSpotlightToken(selectedToken);
    } else if (Number(input ? input : '0') > Number(from_wei(allowanceA))) {
      // checks the lv-router02 contract's allowance on user's token input and decides if the contract needs an approval of user on their tokens
      setDisabled(false);
      setBtnState(2);
    } else {
      // permission to swap
      setBtnState(6);
      setDisabled(false);
    }
  }, [input, allowanceA, amountOut, isConnected, selectedToken, selected2Token, tokenBalanceA, tokenBalanceB]);

  return (
    <Container>
      <Backdrop intensity={5} />
      <VideoContainer>
        <Video autoPlay loop muted playsInline>
          <source src="/videos/MainVideo.mp4" />
          Your browser does not support the video tag.
        </Video>
      </VideoContainer>
      <SwapInputTab
        loader={loader}
        open={setModal}
        inputHandler={userInputHandler}
        funcExec={handleFunctionSelector}
        input={input}
        output={amountOut}
        selectedToken={selectedToken}
        selected2Token={selected2Token}
        openModalForFirstInput={openModalForFirstInput}
        openModalForSecondInput={openModalForSecondInput}
        spotlightToken={spotlightToken}
        btnState={btnState}
        disabled={disabled}
      />
      {modal && (
        <>
          <Backdrop intensity={10} close={setModal} />
          <TokenModal close={setModal} handleTokenClick={handleTokenClick} />
        </>
      )}
    </Container>
  );
};

export default Swap;

const Container = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100vh;
  position: relative;
`;
