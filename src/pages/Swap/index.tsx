import { useEffect, useState } from 'react';
import SwapInputTab from 'components/SwapInputTab';
import { styled } from 'styled-components';
import TokenModal from 'components/TokenModal';
import Backdrop from 'components/Backdrop';
import { chainIds } from 'configs/services/chainIds';
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
import { to_wei } from 'utils/util';
import { ABI, CHAINDS, CONTRACT_ADDRESSES, FUNCTION, Field } from '../../utils/enum';
import VideoContainer from 'components/VideoContainer';
import Video from 'components/Video';
import Web3 from 'web3';
import { MAPNETTOADDRESS } from 'configs/contract_address_config';

interface AmountOutData {
  amountOut: any;
  isError?: any;
  isLoading?: any;
}

const Swap = () => {
  const [modal, setModal] = useState<boolean>(false);
  const { address, isConnected } = useAccount();
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [currentTxHash, setCurrentTxHash] = useState<`0x${string}` | undefined>();

  // Swap Token 선택
  const [selectedToken, setSelectedToken] = useState(null);
  const [selected2Token, setSelected2Token] = useState(null);
  const [selectedInputField, setSelectedInputField] = useState('first');
  const [web3, setWeb3] = useState<Web3 | null>(null);

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

  const { data } = useWaitForTransaction({
    chainId: chain?.id,
    hash: currentTxHash,
    staleTime: 2_000,
    onSuccess() {
      //
    },
    onError(error: any) {
      //
    },
  });

  // const getAccountsOut = async () => {
  //   console.log('123123123');
  //   if (web3) {
  //     console.log('1111');
  //     const contract = new web3.eth.Contract(
  //       MAP_STR_ABI[ABI.UNISWAPV2_ROUTER],
  //       WLD_ADDRESSES[CONTRACT_ADDRESSES.ROUTER],
  //     );
  //     console.log(contract);
  //     try {
  //       console.log('123');
  //       const result: any = await (contract.methods.getAmountsOut as any)(
  //         '0x71A831bb5155818396B70C5f5Fc1ae221Fd51E56',
  //         input,
  //         [[WLD_ADDRESSES[CONTRACT_ADDRESSES.WRAPPEDETH_ADDRESS]], [WLD_ADDRESSES[CONTRACT_ADDRESSES.LVT_ADDRESS]]],
  //       ).call();

  //       console.log(result);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  // };

  // const {
  //   data: amountOut,
  //   isError,
  //   isLoading,
  // } = useContractRead({
  //   address: WLD_ADDRESSES[CONTRACT_ADDRESSES.UNISWAP][CONTRACT_ADDRESSES.ROUTER],
  //   abi: MAP_STR_ABI[ABI.UNISWAPV2_ROUTER],
  //   functionName: FUNCTION.GETAMOUNTSOUT,
  //   args: [
  //     '0x71A831bb5155818396B70C5f5Fc1ae221Fd51E56',
  //     to_wei(input),
  //     [WLD_ADDRESSES[CONTRACT_ADDRESSES.WRAPPEDETH_ADDRESS], WLD_ADDRESSES[CONTRACT_ADDRESSES.LVT_ADDRESS]],
  //   ],
  //   onSuccess(data: any) {
  //     console.log('뭐냐', data);
  //     console.log(data[1]);
  //     const outputWei = web3!.utils.fromWei(data[1], 'ether');
  //     setOutput(outputWei);
  //   },
  //   onError(data) {
  //     console.log({ data });
  //   },
  // });

  const { data: amountOut } = useContractRead({
    address: MAPNETTOADDRESS[CONTRACT_ADDRESSES.ROUTER],
    abi: MAP_STR_ABI[ABI.LVSWAPV2_ROUTER],
    functionName: 'getAmountOut',
    args: [
      MAPNETTOADDRESS[CONTRACT_ADDRESSES.FACTORY],
      to_wei(input ? input : "0"),
      MAPNETTOADDRESS[CONTRACT_ADDRESSES.TOKENA],
      MAPNETTOADDRESS[CONTRACT_ADDRESSES.TOKENB],
    ],
    // watch: true,
    onSuccess(data: any) {
      console.log({ amountOut: data })
    },
    onError(data: any) {
      console.log({ error: data })
    }
  })

  console.log('@ value', [
    WLD_ADDRESSES[CONTRACT_ADDRESSES.WRAPPEDETH_ADDRESS],
    WLD_ADDRESSES[CONTRACT_ADDRESSES.LVT_ADDRESS],
  ]);

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

  useEffect(() => {
    let currentWeb3 = web3;

    if (!currentWeb3 && typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      currentWeb3 = new Web3(window.ethereum);
      setWeb3(currentWeb3);
    }

    // getAccountsOut();
  }, [input]);

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
        open={setModal}
        inputHandler={userInputHandler}
        input={input}
        output={amountOut}
        selectedToken={selectedToken}
        selected2Token={selected2Token}
        openModalForFirstInput={openModalForFirstInput}
        openModalForSecondInput={openModalForSecondInput}
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
