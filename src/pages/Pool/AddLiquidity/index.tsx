import { useState, useEffect, createElement } from 'react';
import styled from 'styled-components';
import VideoContainer from 'components/VideoContainer';
import Video from 'components/Video';
import Backdrop from 'components/Backdrop';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { IoMdSettings } from 'react-icons/io';
import { BiChevronDown } from 'react-icons/bi';
import { selectList } from 'constants/select';
import { useNavigate, useLocation } from 'react-router-dom';
import TokenModal from 'components/TokenModal';
import {
  useAccount,
  useNetwork,
  useSwitchNetwork,
  useBalance,
  useContractWrite,
  useWaitForTransaction,
  useContractRead,
} from 'wagmi';
import { ABI, CHAINDS, CONTRACT_ADDRESSES, FUNCTION, TOKEN } from 'utils/enum';
import { handleAddLiquidityBtnState, putCommaAtPrice, setDeadline } from 'utils/util';
import { MAP_STR_ABI } from 'configs/abis';
import { web3_wld } from 'configs/web3-wld';
import { from_wei, to_wei } from 'utils/util';
import { MAPNETTOADDRESS } from 'configs/contract_address_config';
import { useWeb3Modal } from '@web3modal/react';
import { chain_query } from 'configs/contract_calls';
import { useToasts } from 'react-toast-notifications';
import { chainIds } from 'configs/services/chainIds';
import { parseEther } from 'viem';
import { ListItemType } from 'types/select';

const AddLiquidity = () => {
  const { address, isConnected } = useAccount();
  const { addToast } = useToasts();
  const [btnState, setBtnState] = useState<number>(1);
  const [lowBalanceToken, setLowBalanceToken] = useState<ListItemType>(selectList[0]);
  const [selectedToken0, setSelectedToken0] = useState<ListItemType>(selectList[0]);
  const [selectedToken1, setSelectedToken1] = useState<ListItemType>(selectList[1]);
  const [selectedTokenInputField, setSelectedTokenInputField] = useState<number>(0);
  const [selectedTokenAmount0, setSelectedTokenAmount0] = useState<string>('');
  const [selectedTokenAmount1, setSelectedTokenAmount1] = useState<string>('');
  const [disabled, setDisabled] = useState<boolean>(false);
  const [modal, setModal] = useState(false);
  const [amountOut, setAmountOut] = useState<string>('');
  const [currentPrice, setCurrentPrice] = useState<string>('');
  const { open } = useWeb3Modal();
  const location = useLocation;
  const approvalAmount = '1000000000';
  const mapIndexToFunction: ImapIndexToFunction = {
    0: (obj: ListItemType) => setSelectedToken0(obj),
    1: (obj: ListItemType) => setSelectedToken1(obj),
  };
  const mapIndexToInput: ImapIndexToInput = {
    0: (amount: string) => setSelectedTokenAmount0(amount),
    1: (amount: string) => setSelectedTokenAmount1(amount),
  };

  const navigate = useNavigate();
  const handleTokenClick = (params: ListItemType) => {
    mapIndexToFunction[selectedTokenInputField](params);
    setModal(false);
  };
  function handleModalOpen(index: number) {
    setSelectedTokenInputField(index);
    setModal((prev) => !prev);
  }

  async function queryCurrentPrice() {
    // makes a chain query regardless of wallet connection
    if (selectedToken0?.address === selectedToken1?.address) {
      return;
    }
    let args = {
      chain: 2,
      contract_address: MAPNETTOADDRESS[CONTRACT_ADDRESSES.ROUTER],
      abikind: ABI.LVSWAPV2_ROUTER,
      methodname: FUNCTION.GETAMOUNTOUT,
      f_args: [
        MAPNETTOADDRESS[CONTRACT_ADDRESSES.FACTORY],
        to_wei('1'),
        selectedToken0?.address,
        selectedToken1?.address,
      ],
    };
    let price = await chain_query(args);
    setCurrentPrice(price);
  }

  useEffect(() => {
    queryCurrentPrice();
  }, [selectedToken0?.address, selectedToken1?.address]);

  const { data: coinBalanceA } = useBalance({ address });
  const { data: tokenBalanceA } = useContractRead({
    address: selectedToken0?.address,
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
    address: selectedToken1?.address,
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

  const { data: allowanceA } = useContractRead({
    address: selectedToken0?.address,
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
  const { data: allowanceB } = useContractRead({
    address: selectedToken1?.address,
    abi: MAP_STR_ABI[ABI.ERC20_ABI],
    functionName: 'allowance',
    args: [address, MAPNETTOADDRESS[CONTRACT_ADDRESSES.ROUTER]],
    watch: true,
    onSuccess(data: any) {
      console.log({ allowanceB: data });
    },
    onError(data: any) {
      console.log({ error: data });
    },
  });

  const { data: _amountOut } = useContractRead({
    address: MAPNETTOADDRESS[CONTRACT_ADDRESSES.ROUTER],
    abi: MAP_STR_ABI[ABI.LVSWAPV2_ROUTER],
    functionName: FUNCTION.GETAMOUNTOUT,
    args: [
      MAPNETTOADDRESS[CONTRACT_ADDRESSES.FACTORY],
      to_wei(selectedTokenAmount0 ? selectedTokenAmount0 : '0'),
      selectedToken0?.address,
      selectedToken1?.address,
    ],
    watch: true,
    onSuccess(data: any) {
      queryCurrentPrice();
      setAmountOut(data);
      if (parseFloat(from_wei(data)) > 0) {
        tokenAmountInputHandler(1, putCommaAtPrice(from_wei(data), 5));
      }
    },
    onError(data: any) {
      console.log({ error: data });
    },
  });

  const { write: approveA } = useContractWrite({
    address: selectedToken0?.address,
    abi: MAP_STR_ABI[CONTRACT_ADDRESSES.ERC20_ABI],
    args: [MAPNETTOADDRESS[CONTRACT_ADDRESSES.ROUTER], to_wei(approvalAmount)],
    functionName: FUNCTION.APPROVE,
    onSuccess(data) {
      console.log({ approvalA: data });
    },
    onError(err) {
      console.log({ approvalErrA: err });
    },
  });

  const { write: approveB } = useContractWrite({
    address: selectedToken1?.address,
    abi: MAP_STR_ABI[CONTRACT_ADDRESSES.ERC20_ABI],
    args: [MAPNETTOADDRESS[CONTRACT_ADDRESSES.ROUTER], to_wei(approvalAmount)],
    functionName: FUNCTION.APPROVE,
    onSuccess(data) {
      console.log({ approvalB: data });
    },
    onError(err) {
      console.log({ approvalErrB: err });
    },
  });

  const { data: _, write: AddLiquidity } = useContractWrite({
    address: MAPNETTOADDRESS[CONTRACT_ADDRESSES.ROUTER],
    abi: MAP_STR_ABI[ABI.LVSWAPV2_ROUTER],
    functionName: FUNCTION.ADDLIQUIDITY,
    onSuccess(data) {
      console.log({ approvalB: data });
    },
    onError(err) {
      console.log({ approvalErrB: err });
    },
  });

  const { data: __, write: AddLiquidityETH } = useContractWrite({
    address: MAPNETTOADDRESS[CONTRACT_ADDRESSES.ROUTER],
    abi: MAP_STR_ABI[ABI.LVSWAPV2_ROUTER],
    functionName: FUNCTION.ADDLIQUIDITYETH,
    value: parseEther(selectedTokenAmount0),
    onSuccess(data) {
      console.log({ approvalB: data });
    },
    onError(err) {
      console.log({ approvalErrB: err });
    },
  });

  async function handleAddLiquidity() {
    let deadline = await setDeadline(3600);
    let cleanedOutput = selectedTokenAmount1.replace(/[,\.]/g, '');
    console.log({
      contract_address: MAPNETTOADDRESS[CONTRACT_ADDRESSES.ROUTER],
      token0: selectedToken0.address,
      token1: selectedToken1.address,
      amount0: to_wei(selectedTokenAmount0),
      amount1: to_wei(cleanedOutput),
      amountOutMin: to_wei('0.0001'),
      address,
      deadline
    });
    AddLiquidity({
      args: [
        selectedToken0?.address,
        selectedToken1?.address,
        to_wei(selectedTokenAmount0),
        to_wei(cleanedOutput),
        to_wei('0.0001'),
        to_wei('0.0001'),
        address,
        deadline,
      ],
    });
    setSelectedTokenAmount0('');
    setSelectedTokenAmount1('');
  }

  async function handleAddLiquidityETH() {
    let deadline = await setDeadline(3600);
    let cleanedOutput = selectedTokenAmount1.replace(/[,\.]/g, '');
    console.log({ cleanedOutput: to_wei(cleanedOutput) });
    AddLiquidityETH({
      args: [
        selectedToken1?.address, // wETH address
        // value WLC
        // to_wei(selectedTokenAmount1), // wETH amount 0.1
        to_wei(cleanedOutput),
        to_wei('0.1'),
        to_wei('0.1'),
        address,
        deadline,
      ],
    });
    setSelectedTokenAmount0('');
    setSelectedTokenAmount1('');
  }

  function tokenAmountInputHandler(index: number, amount: string) {
    mapIndexToInput[index](amount);
  }

  function handleApprovals(index: number) {
    let mapApprovalToIndex: any = {
      0: approveA,
      1: approveB,
    };
    mapApprovalToIndex[index]();
    setSelectedTokenAmount0('0');
  }

  function handleFunctionSelector() {
    if (!isConnected) {
      // metamask is not connected
      open();
      return;
    } else if (chain?.id !== chainIds[CHAINDS.WORLDLAND]) {
      // wrong network
      switchNetwork?.(chainIds[CHAINDS.WORLDLAND]);
    } else if (selectedTokenAmount0 === '0' || selectedTokenAmount0 === '') {
      // empty field
      return;
    } else if (Number(from_wei(tokenBalanceA)) < Number(selectedTokenAmount0 ? selectedTokenAmount0 : '0')) {
      // balance A is not enough
      return;
    } else if (Number(from_wei(tokenBalanceB)) < Number(from_wei(amountOut))) {
      // balance B is not enough
      return;
    } else if (
      Number(selectedTokenAmount0 ? selectedTokenAmount0 : '0') > Number(from_wei(allowanceA)) &&
      Number(selectedTokenAmount0 ? selectedTokenAmount0 : '0') > Number(from_wei(allowanceB))
    ) {
      // low allowanceA
      // approveA
      handleApprovals(0);
      handleApprovals(1);
    } else if (Number(selectedTokenAmount0 ? selectedTokenAmount0 : '0') > Number(from_wei(allowanceA))) {
      // low allowanceA
      // approveA
      handleApprovals(0);
    } else if (Number(selectedTokenAmount0 ? selectedTokenAmount0 : '0') > Number(from_wei(allowanceB))) {
      // low allowanceB
      // approveB
      handleApprovals(1);
    } else if (Number(selectedTokenAmount0 ? selectedTokenAmount0 : '0') > Number(from_wei(allowanceA))) {
      // if allowanceA is low
      handleApprovals(0);
    } else if (Number(from_wei(selectedTokenAmount0) ? from_wei(selectedTokenAmount0) : '0') > Number(from_wei(allowanceB))) {
      // if allowanceB is low
      handleApprovals(1);
    } else {
      // permission to add liquidity
      handleAddLiquidity();
    }
  }

  function handleClear() {
    tokenAmountInputHandler(0, '');
  }

  const { chain } = useNetwork();

  const { chains, switchNetwork } = useSwitchNetwork({
    onSuccess(data) {
      //
      console.log({ data });
      addToast('네트워크 변경 완료', {
        appearance: 'success', // 오류 메시지 스타일
        autoDismiss: true, // 자동 닫기
      });
    },
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    console.log({ allowanceA: Number(from_wei(allowanceA)) });
    console.log({ allowanceB: Number(from_wei(amountOut)) > Number(from_wei(allowanceB)) });
    if (!isConnected) {
      // metamask is not connected
      setDisabled(false);
      setBtnState(4);
    } else if (chain?.id !== chainIds[CHAINDS.WORLDLAND]) {
      // wrong network
      setDisabled(false);
      setBtnState(7);
    } else if (selectedTokenAmount0 === '0' || selectedTokenAmount0 === '') {
      // empty field
      setDisabled(true);
      setBtnState(0);
    } else if (Number(from_wei(tokenBalanceA)) < Number(selectedTokenAmount0 ? selectedTokenAmount0 : '0')) {
      // balance A is not enough
      setDisabled(true);
      setBtnState(1);
      setLowBalanceToken(selectedToken0);
    } else if (Number(from_wei(tokenBalanceB)) < Number(from_wei(amountOut))) {
      // balance B is not enough
      setDisabled(true);
      setBtnState(1);
      setLowBalanceToken(selectedToken1);
    } else if (
      Number(selectedTokenAmount0 ? selectedTokenAmount0 : '0') > Number(from_wei(allowanceA)) &&
      Number(from_wei(amountOut)) > Number(from_wei(allowanceB))
    ) {
      // low allowanceA && allowanceB
      setDisabled(false);
      setBtnState(2);
    } else if (Number(selectedTokenAmount0 ? selectedTokenAmount0 : '0') > Number(from_wei(allowanceA))) {
      // low allowanceA
      setDisabled(false);
      setBtnState(2);
    } else if (Number(selectedTokenAmount0 ? selectedTokenAmount0 : '0') > Number(from_wei(allowanceB))) {
      // low allowanceB
      setDisabled(false);
      setBtnState(2);
    } else {
      console.log({ amount0: from_wei(allowanceA) });
      // permission to add liquidity
      setBtnState(3);
      setDisabled(false);
    }
  }, [
    chain?.id,
    selectedTokenAmount0,
    allowanceA,
    allowanceB,
    amountOut,
    isConnected,
    selectedToken0,
    selectedToken1,
    tokenBalanceA,
    tokenBalanceB,
  ]);

  return (
    <Container>
      <Backdrop intensity={5} />
      <VideoContainer>
        <Video autoPlay loop muted playsInline>
          <source src="/videos/MainVideo.mp4" />
          Your browser does not support the video tag.
        </Video>
      </VideoContainer>
      <section className="content-wrap">
        <div className="header">
          <AiOutlineArrowLeft onClick={() => navigate(-1)} color="#b4b4b4" size={25} style={{ cursor: 'pointer' }} />
          <h1>Add liquidity</h1>
          <div className="settings-wrap">
            <p onClick={handleClear}>Clear all</p>
            <IoMdSettings color="#b4b4b4" size={25} style={{ cursor: 'pointer' }} />
          </div>
        </div>
        <hr />
        <section className="inner-section">
          <h2>Select pair</h2>
          <section className="pairs">
            <div onClick={() => handleModalOpen(0)} className="pair">
              <span>
                {selectedToken0 ? (
                  <>
                    {createElement(selectList[0].tokenIcon)}
                    <p>{selectedToken0.token}</p>
                  </>
                ) : (
                  <>
                    {createElement(selectList[1].tokenIcon)}
                    <p>{selectList[1].token}</p>
                  </>
                )}
              </span>
              <BiChevronDown color="#ffffff" size={25} />
            </div>
            <div onClick={() => handleModalOpen(1)} className="pair">
              <span>
                {selectedToken1 ? (
                  <>
                    {createElement(selectList[1].tokenIcon)}
                    <p>{selectedToken1.token}</p>
                  </>
                ) : (
                  <>
                    {createElement(selectList[1].tokenIcon)}
                    <p>{selectList[1].token}</p>
                  </>
                )}
              </span>
              <BiChevronDown color="#ffffff" size={25} />
            </div>
          </section>
          <section className="fee-tier">
            <div>
              <h3>0.3% fee tier</h3>
              <p>100% select</p>
            </div>
            <button className="edit-btn">Edit</button>
          </section>
          <div className="current-price-box">
            <p>Current price:</p>
            <h2>{putCommaAtPrice(from_wei(currentPrice), 5)}</h2>
            <p>
              {selectedToken1.token} per {selectedToken0.token}
            </p>
          </div>
          <section className="deposit-field">
            <h2>Deposit amounts</h2>
            <div className="input-hold">
              <div className="input-wrap">
                <div className="inner-items">
                  <input
                    value={selectedTokenAmount0}
                    onChange={(e) => tokenAmountInputHandler(0, e.target.value)}
                    type="text"
                    placeholder="0"
                  />
                  <span className="token-card">
                    {selectedToken0 ? (
                      <>
                        {createElement(selectList[0].tokenIcon)}
                        <p>{selectedToken0.token}</p>
                      </>
                    ) : (
                      <>
                        {createElement(selectList[0].tokenIcon)}
                        <p>{selectList[0].token}</p>
                      </>
                    )}
                  </span>
                </div>
                <div className="inner-items">
                  <p className="amount-in-usd">$10.07B</p>
                  <p className="balance">
                    Balance: {putCommaAtPrice(from_wei(tokenBalanceA), 3)} <span className="max-btn">MAX</span>
                  </p>
                </div>
              </div>
              <div className="input-wrap">
                <div className="inner-items">
                  <input
                    value={selectedTokenAmount1}
                    onChange={(e) => tokenAmountInputHandler(1, e.target.value)}
                    type="text"
                    placeholder={'0'}
                  />
                  <span className="token-card">
                    {selectedToken1 ? (
                      <>
                        {createElement(selectList[1].tokenIcon)}
                        <p>{selectedToken1.token}</p>
                      </>
                    ) : (
                      <>
                        {createElement(selectList[1].tokenIcon)}
                        <p>{selectList[1].token}</p>
                      </>
                    )}
                  </span>
                </div>
                <div className="inner-items">
                  <p className="amount-in-usd">$10.07B</p>
                  <p className="balance">
                    Balance: {putCommaAtPrice(from_wei(tokenBalanceB), 3)} <span className="max-btn">MAX</span>
                  </p>
                </div>
              </div>
            </div>
            <button onClick={handleFunctionSelector} disabled={disabled} className="deposit-btn">
              {handleAddLiquidityBtnState(btnState, lowBalanceToken)}
            </button>
          </section>
        </section>
      </section>
      {modal && (
        <>
          <Backdrop intensity={10} close={setModal} />
          <TokenModal close={setModal} handleTokenClick={handleTokenClick} />
        </>
      )}
    </Container>
  );
};

export default AddLiquidity;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100vh;
  position: relative;
  font-family: 'Nunito Sans', sans-serif;
  padding: 20px;
  margin: 120px 0;

  .content-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    max-width: 650px;
    width: 100%;
    background-color: rgb(255, 255, 255, 0.1);
    z-index: 4;
    border-radius: 15px;
    padding: 15px;

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      margin: 20px 0;

      h1 {
        color: #ffffff;
        font-size: 20px;
        font-weight: 600;
      }

      .settings-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 15px;

        p {
          color: #fc72ff;
          font-size: 12px;
          cursor: pointer;
        }
      }
    }
    hr {
      border: 1px solid #4c4c4c;
      width: 100%;
      border-width: 0.1px;
    }
    .inner-section {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      width: 100%;
      margin: 20px 0 0;
      gap: 20px;
      h2 {
        width: 100%;
        text-align: left;
        color: #ffffff;
      }
      .pairs {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        gap: 10px;
        .pair {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 5px;
          padding: 0 10px;
          background-color: rgb(255, 255, 255, 0.1);
          border: 1px solid rgb(255, 255, 255, 0.2);
          border-radius: 12px;
          height: 30px;
          max-width: 300px;
          width: 100%;
          height: 50px;
          cursor: pointer;
          span {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
          }
          p {
            color: #ffffff;
            font-size: 20px;
            margin: 0;
            padding: 0;
            text-align: center;
          }
          img {
            width: 25px;
            height: 25px;
          }
        }
        .pair:hover {
          border: 1px solid rgb(255, 255, 255, 0);
        }
      }

      .fee-tier {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 15px 20px;
        border: 1px solid rgb(255, 255, 255, 0.1);
        border-radius: 20px;
        width: 100%;
        height: 120px;
        div {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-direction: column;
          height: 100%;
          padding: 10px 0;

          h3 {
            color: #ffffff;
          }
          p {
            color: #ffffff;
            background-color: rgb(255, 255, 255, 0.1);
            font-size: 10px;
            padding: 8px;
            border-radius: 10px;
          }
        }
        button {
          color: #a1a1a1;
          font-size: 18px;
          border: 1px solid rgb(255, 255, 255, 0.1);
          padding: 8px;
          border-radius: 10px;
          font-weight: 550;
        }
        button:hover {
          background-color: rgb(255, 255, 255, 0.1);
          cursor: pointer;
        }
      }
      .current-price-box {
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        flex-direction: column;
        width: 100%;
        gap: 10px;
        p {
          color: #ffffff;
          font-size: 12px;
        }
        h2 {
          font-weight: 600;
        }
      }
      .deposit-field {
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        flex-direction: column;
        margin: 20px 0 0 0;
        width: 100%;

        h2 {
          width: 100%;
          text-align: left;
          font-weight: 650;
          margin: 0 0 15px;
        }

        .input-hold {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          width: 100%;
          gap: 15px;

          .input-wrap {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            width: 100%;
            background-color: rgb(255, 255, 255, 0.1);
            border-radius: 20px;
            border: 1px solid rgb(255, 255, 255, 0.2);
            padding: 10px 0;

            .inner-items {
              display: flex;
              align-items: center;
              justify-content: space-between;
              width: 100%;
              padding: 10px 20px;

              input {
                background-color: rgb(255, 255, 255, 0);
                border: none;
                width: 90%;
                color: #ffffff;
                font-size: 22px;
                font-weight: 550;
              }
              p {
                color: #ffffff;
                font-weight: 550;
                font-size: 13px;
              }
              .max-btn {
                background-color: rgb(49, 28, 50, 0.6);
                padding: 7px;
                border-radius: 15px;
                color: #ce5fd1;
                font-size: 12px;
              }
              .token-card {
                display: flex;
                align-items: center;
                justify-content: space-between;
                color: #ffffff;
                background-color: rgb(0, 0, 0, 0.4);
                border-radius: 20px;
                padding: 10px;
                gap: 10px;
                p {
                  font-size: 20px;
                  font-weight: 900;
                }
                img {
                  width: 25px;
                  height: 25px;
                }
              }
            }
          }
          .input-wrap:hover {
            border: 1px solid rgb(255, 255, 255, 0);
            cursor: pointer;
          }
        }
        .deposit-btn {
          width: 100%;
          padding: 15px;
          margin: 20px 0 0;
          font-size: 20px;
          font-weight: 600;
          color: #ffffff;
          background-color: rgb(149, 60, 53);
          border-radius: 20px;
          cursor: pointer;

          &:disabled {
            background-color: rgb(255, 255, 255, 0.1);
            color: #6a6a6a;
            cursor: not-allowed;
          }
        }
      }
    }
  }
`;
