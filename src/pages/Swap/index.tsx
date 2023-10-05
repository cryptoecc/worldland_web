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

const Swap = () => {
  const [modal, setModal] = useState<boolean>(false);
  const { address, isConnected } = useAccount();
  const [input, setInput] = useState<string>('1000000000000000000');
  const [output, setOutput] = useState<string>('');
  const [currentTxHash, setCurrentTxHash] = useState<`0x${string}` | undefined>();

  // Swap Token 선택
  const [selectedToken, setSelectedToken] = useState(null);
  const [selected2Token, setSelected2Token] = useState(null);
  const [selectedInputField, setSelectedInputField] = useState('first');

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

  const {
    data: amountOut,
    isError,
    isLoading,
  } = useContractRead({
    address: WLD_ADDRESSES[CONTRACT_ADDRESSES.UNISWAP][CONTRACT_ADDRESSES.ROUTER],
    abi: MAP_STR_ABI[ABI.UNISWAPV2_ROUTER],
    functionName: FUNCTION.GETAMOUNTSOUT,
    args: [
      input,
      [WLD_ADDRESSES[CONTRACT_ADDRESSES.WRAPPEDETH_ADDRESS], WLD_ADDRESSES[CONTRACT_ADDRESSES.LVT_ADDRESS]],
    ],
    onSuccess(data) {
      console.log({ data });
    },
    onError(data) {
      console.log({ data });
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
        setInput(typedValue);
        break;
      case Field.OUTPUT:
        setOutput(typedValue);
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    console.log(selectedToken);
  }, [selectedToken]);

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
        output={output}
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

