import { useState, useEffect } from "react";
import styled from 'styled-components';
import VideoContainer from 'components/VideoContainer';
import Video from 'components/Video';
import Backdrop from 'components/Backdrop';
import { AiOutlineArrowLeft } from "react-icons/ai";
import { IoMdSettings } from "react-icons/io";
import { BiChevronDown } from "react-icons/bi";
import { crypto_list } from 'data';
import { useNavigate, useLocation } from "react-router-dom";
import TokenModal from "components/TokenModal";
import {
    useAccount,
    useNetwork,
    useSwitchNetwork,
    useBalance,
    useContractWrite,
    useWaitForTransaction,
    useContractRead,
} from 'wagmi';
import { ABI, CONTRACT_ADDRESSES, TOKEN } from "utils/enum";
import { handleBtnState, putCommaAtPrice, setDeadline } from "utils/util";
import { MAP_STR_ABI } from "configs/abis";
import { web3_wld } from "configs/web3-wld";
import { from_wei, to_wei } from "utils/util";
import { MAPNETTOADDRESS } from "configs/contract_address_config";

const AddLiquidity = () => {
    const { address, isConnected } = useAccount()
    const [btnState, setBtnState] = useState<number>(1)
    const [lowBalanceToken, setLowBalanceToken] = useState<TokenProps>(crypto_list[0]);
    const [selectedToken0, setSelectedToken0] = useState<TokenProps>(crypto_list[0]);
    const [selectedToken1, setSelectedToken1] = useState<TokenProps>(crypto_list[1]);
    const [selectedTokenInputField, setSelectedTokenInputField] = useState<number>(0);
    const [selectedTokenAmount0, setSelectedTokenAmount0] = useState<string>('');
    const [selectedTokenAmount1, setSelectedTokenAmount1] = useState<string>('0');
    const [disabled, setDisabled] = useState<boolean>(false);
    const [modal, setModal] = useState(false);
    const location = useLocation;
    const approvalAmount = '1000000';
    const mapIndexToFunction: ImapIndexToFunction = {
        0: (obj: TokenProps) => setSelectedToken0(obj),
        1: (obj: TokenProps) => setSelectedToken1(obj),
    }
    const mapIndexToInput: ImapIndexToInput = {
        0: (amount: string) => setSelectedTokenAmount0(amount),
        1: (amount: string) => setSelectedTokenAmount1(amount),
    }

    const navigate = useNavigate();
    const handleTokenClick = (params: TokenProps) => {
        mapIndexToFunction[selectedTokenInputField](params)
        setModal(false);
    };
    function handleModalOpen(index: number) {
        setSelectedTokenInputField(index);
        setModal(prev => !prev);
    }

    const { data: tokenBalanceA } = useContractRead({
        address: selectedToken0?.address,
        abi: MAP_STR_ABI[ABI.ERC20_ABI],
        functionName: 'balanceOf',
        args: [address],
        watch: true,
        onSuccess(data: any) {
            console.log({ tokenBalanceA: data })
        },
        onError(data: any) {
            console.log({ error: data })
        }
    })
    const { data: tokenBalanceB } = useContractRead({
        address: selectedToken1?.address,
        abi: MAP_STR_ABI[ABI.ERC20_ABI],
        functionName: 'balanceOf',
        args: [address],
        watch: true,
        onSuccess(data: any) {
            console.log({ tokenBalanceB: data })
        },
        onError(data: any) {
            console.log({ error: data })
        }
    })


    const { data: allowanceA } = useContractRead({
        address: selectedToken0?.address,
        abi: MAP_STR_ABI[ABI.ERC20_ABI],
        functionName: 'allowance',
        args: [address, MAPNETTOADDRESS[CONTRACT_ADDRESSES.ROUTER]],
        // watch: true,
        onSuccess(data: any) {
            console.log({ allowanceA: data })
        },
        onError(data: any) {
            console.log({ error: data })
        }
    })
    const { data: allowanceB } = useContractRead({
        address: selectedToken1?.address,
        abi: MAP_STR_ABI[ABI.ERC20_ABI],
        functionName: 'allowance',
        args: [address, MAPNETTOADDRESS[CONTRACT_ADDRESSES.ROUTER]],
        // watch: true,
        onSuccess(data: any) {
            console.log({ allowanceB: data })
        },
        onError(data: any) {
            console.log({ error: data })
        }
    })


    const { data: amountOut } = useContractRead({
        address: MAPNETTOADDRESS[CONTRACT_ADDRESSES.ROUTER],
        abi: MAP_STR_ABI[ABI.LVSWAPV2_ROUTER],
        functionName: 'getAmountOut',
        args: [
            MAPNETTOADDRESS[CONTRACT_ADDRESSES.FACTORY],
            to_wei(selectedTokenAmount0 ? selectedTokenAmount0 : "0"),
            selectedToken0?.address,
            selectedToken1?.address
        ],
        // watch: true,
        onSuccess(data: any) {
            console.log({ amountOut: data })
        },
        onError(data: any) {
            console.log({ error: data })
        }
    })


    const { data: approvalA, write: approveA } = useContractWrite({
        address: selectedToken0?.address,
        abi: MAP_STR_ABI[CONTRACT_ADDRESSES.ERC20_ABI],
        args: [MAPNETTOADDRESS[CONTRACT_ADDRESSES.ROUTER], to_wei(approvalAmount)],
        functionName: 'approve',
        onSuccess(data) {
            console.log({ approvalA: data });
        },
        onError(err) {
            console.log({ approvalErrA: err });
        }
    })
    const { data: approvalB, write: approveB } = useContractWrite({
        address: selectedToken1?.address,
        abi: MAP_STR_ABI[CONTRACT_ADDRESSES.ERC20_ABI],
        args: [MAPNETTOADDRESS[CONTRACT_ADDRESSES.ROUTER], to_wei(approvalAmount)],
        functionName: 'approve',
        onSuccess(data) {
            console.log({ approvalB: data });
        },
        onError(err) {
            console.log({ approvalErrB: err });
        }
    })
    const { data: _, write: AddLiquidity } = useContractWrite({
        address: MAPNETTOADDRESS[CONTRACT_ADDRESSES.ROUTER],
        abi: MAP_STR_ABI[ABI.LVSWAPV2_ROUTER],
        functionName: 'addLiquidity',
        onSuccess(data) {
            console.log({ approvalB: data });
        },
        onError(err) {
            console.log({ approvalErrB: err });
        }
    })

    async function handleAddLiquidity() {
        let deadline = await setDeadline(3600);
        AddLiquidity({
            args: [
                selectedToken0?.address,
                selectedToken1?.address,
                to_wei(selectedTokenAmount0),
                to_wei(amountOut),
                to_wei("10"),
                to_wei("10"),
                address,
                deadline,
            ],
        });
        setSelectedTokenAmount0("0");
    }

    function tokenAmountInputHandler(index: number, amount: string) {
        mapIndexToInput[index](amount);
    }


    function handleApprovals() {
        approveA();
        approveB();
        setSelectedTokenAmount0("0")
    }

    function handleFunctionSelector() {
        if (!isConnected) {
            // metamask is not connected
            return;
        } else if (selectedTokenAmount0 === "0" || selectedTokenAmount0 === "") {
            // empty field
            return;
        } else if (Number(from_wei(tokenBalanceA)) < Number(selectedTokenAmount0 ? selectedTokenAmount0 : "0")) {
            // balance A is not enough
            return;
        } else if (Number(from_wei(tokenBalanceB)) < Number(from_wei(amountOut))) {
            // balance B is not enough
            return;
        } else if (Number(selectedTokenAmount0 ? selectedTokenAmount0 : "0") > Number(from_wei(allowanceA))
            || Number(selectedTokenAmount0 ? selectedTokenAmount0 : "0") > Number(from_wei(allowanceB))) {
            // checks the lv-router02 contract's allowance on user's token input and decides if the contract needs an approval of user on their tokens
            handleApprovals();
        } else {
            // permission to add liquidity
            handleAddLiquidity();
        }
    }

    function handleClear() {
        tokenAmountInputHandler(0, "");
    }

    const { chain } = useNetwork();


    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location])

    useEffect(() => {
        if (!isConnected) {
            // metamask is not connected
            setDisabled(true);
            setBtnState(4);
        } else if (selectedTokenAmount0 === "0" || selectedTokenAmount0 === "") {
            // empty field
            setDisabled(true);
            setBtnState(0);
        } else if (Number(from_wei(tokenBalanceA)) < Number(selectedTokenAmount0 ? selectedTokenAmount0 : "0")) {
            // balance A is not enough
            setDisabled(true);
            setBtnState(1);
            setLowBalanceToken(selectedToken0)
        } else if (Number(from_wei(tokenBalanceB)) < Number(from_wei(amountOut))) {
            // balance B is not enough
            setDisabled(true);
            setBtnState(1);
            setLowBalanceToken(selectedToken1)
        } else if (Number(selectedTokenAmount0 ? selectedTokenAmount0 : "0") > Number(from_wei(allowanceA))
            || Number(selectedTokenAmount0 ? selectedTokenAmount0 : "0") > Number(from_wei(allowanceB))) {
            // checks the lv-router02 contract's allowance on user's token input and decides if the contract needs an approval of user on their tokens
            setBtnState(2);
        } else {
            // permission to add liquidity
            setBtnState(3);
            setDisabled(false)
        }
    }, [
        selectedTokenAmount0,
        allowanceA,
        allowanceB,
        amountOut,
        isConnected,
        selectedToken0,
        selectedToken1,
        tokenBalanceA,
        tokenBalanceB
    ])

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
                    <AiOutlineArrowLeft onClick={() => navigate(-1)} color="#b4b4b4" size={25} style={{ cursor: "pointer" }} />
                    <h1>Add liquidity</h1>
                    <div className="settings-wrap">
                        <p onClick={handleClear}>Clear all</p>
                        <IoMdSettings color="#b4b4b4" size={25} style={{ cursor: "pointer" }} />
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
                                        <img src={selectedToken0.icon} alt={selectedToken0.icon} />
                                        <p>{selectedToken0.symbol}</p>
                                    </>
                                ) : (
                                    <>
                                        <img src={crypto_list[0]['icon']} alt={crypto_list[0]['title']} />
                                        <p>{crypto_list[0]['symbol']}</p>
                                    </>
                                )}
                            </span>
                            <BiChevronDown color="#ffffff" size={25} />
                        </div>
                        <div onClick={() => handleModalOpen(1)} className="pair">
                            <span>
                                {selectedToken1 ? (
                                    <>
                                        <img src={selectedToken1.icon} alt={selectedToken1.icon} />
                                        <p>{selectedToken1.symbol}</p>
                                    </>
                                ) : (
                                    <>
                                        <img src={crypto_list[1]['icon']} alt={crypto_list[1]['title']} />
                                        <p>{crypto_list[1]['symbol']}</p>
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
                        <h2>{putCommaAtPrice(from_wei(amountOut), 3)}</h2>
                        <p>{selectedToken1.symbol} per {selectedToken0.symbol}</p>
                    </div>
                    <section className="deposit-field">
                        <h2>Deposit amounts</h2>
                        <div className="input-hold">
                            <div className="input-wrap">
                                <div className="inner-items">
                                    <input value={selectedTokenAmount0} onChange={(e) => tokenAmountInputHandler(0, e.target.value)} type="text" placeholder="0" />
                                    <span className="token-card">
                                        {selectedToken0 ? (
                                            <>
                                                <img src={selectedToken0.icon} alt={selectedToken0.icon} />
                                                <p>{selectedToken0.symbol}</p>
                                            </>
                                        ) : (
                                            <>
                                                <img src={crypto_list[0]['icon']} alt={crypto_list[0]['title']} />
                                                <p>{crypto_list[0]['symbol']}</p>
                                            </>
                                        )}
                                    </span>
                                </div>
                                <div className="inner-items">
                                    <p className="amount-in-usd">$10.07B</p>
                                    <p className="balance">Balance: {putCommaAtPrice(from_wei(tokenBalanceA), 3)} <span className="max-btn">MAX</span></p>
                                </div>
                            </div>
                            <div className="input-wrap">
                                <div className="inner-items">
                                    <input value={amountOut ? putCommaAtPrice(from_wei(amountOut), 5) : ""} type="text" placeholder={amountOut} />
                                    <span className="token-card">
                                        {selectedToken1 ? (
                                            <>
                                                <img src={selectedToken1.icon} alt={selectedToken1.icon} />
                                                <p>{selectedToken1.symbol}</p>
                                            </>
                                        ) : (
                                            <>
                                                <img src={crypto_list[1]['icon']} alt={crypto_list[1]['title']} />
                                                <p>{crypto_list[1]['symbol']}</p>
                                            </>
                                        )}
                                    </span>
                                </div>
                                <div className="inner-items">
                                    <p className="amount-in-usd">$10.07B</p>
                                    <p className="balance">Balance: {putCommaAtPrice(from_wei(tokenBalanceB), 3)} <span className="max-btn">MAX</span></p>
                                </div>
                            </div>
                        </div>
                        <button onClick={handleFunctionSelector} disabled={disabled} className="deposit-btn">{handleBtnState(btnState, lowBalanceToken)}</button>
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
    )
}

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
                color: #FC72FF;
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
                border: 1px solid  rgb(255, 255, 255, 0.1);
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
                                color: #CE5FD1;
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
                }
            }

        }
    }
  }
`