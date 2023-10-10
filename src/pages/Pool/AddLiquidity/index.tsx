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
import { ABI, CONTRACT_ADDRESSES } from "utils/enum";
import { setDeadline } from "utils/util";
import { SEPOLIA_ADDRESSES } from "configs/contract_addresses";
import { MAP_STR_ABI } from "configs/abis";
import { web3_wld } from "configs/web3-wld";
import { from_wei, to_wei } from "utils/util";

const AddLiquidity = () => {
    const { address } = useAccount()
    const [selectedToken0, setSelectedToken0] = useState<TokenProps | null>(null);
    const [selectedToken1, setSelectedToken1] = useState<TokenProps | null>(null);
    const [selectedTokenInputField, setSelectedTokenInputField] = useState<number>(0);
    const [selectedTokenAmount0, setSelectedTokenAmount0] = useState<string>('0');
    const [selectedTokenAmount1, setSelectedTokenAmount1] = useState<string>('0');
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

    const { data: allowanceA } = useContractRead({
        address: SEPOLIA_ADDRESSES[CONTRACT_ADDRESSES.TOKENA],
        abi: MAP_STR_ABI[ABI.ERC20_ABI],
        functionName: 'allowance',
        args: [address, SEPOLIA_ADDRESSES[CONTRACT_ADDRESSES.ROUTER]],
        watch: true,
        onSuccess(data: any) {
            console.log({ success: data })
        },
        onError(data: any) {
            console.log({ error: data })
        }
    })
    const { data: allowanceB } = useContractRead({
        address: SEPOLIA_ADDRESSES[CONTRACT_ADDRESSES.TOKENB],
        abi: MAP_STR_ABI[ABI.ERC20_ABI],
        functionName: 'allowance',
        args: [address, SEPOLIA_ADDRESSES[CONTRACT_ADDRESSES.ROUTER]],
        // watch: true,
        onSuccess(data: any) {
            console.log({ success: data })
        },
        onError(data: any) {
            console.log({ error: data })
        }
    })

    const { data: approvalA, write: approveA } = useContractWrite({
        address: SEPOLIA_ADDRESSES[CONTRACT_ADDRESSES.TOKENA],
        abi: MAP_STR_ABI[CONTRACT_ADDRESSES.ERC20_ABI],
        args: [SEPOLIA_ADDRESSES[CONTRACT_ADDRESSES.ROUTER], to_wei(approvalAmount)],
        functionName: 'approve',
        onSuccess(data) {
            console.log({ approvalA: data });
        },
        onError(err) {
            console.log({ approvalErrA: err });
        }
    })
    const { data: approvalB, write: approveB } = useContractWrite({
        address: SEPOLIA_ADDRESSES[CONTRACT_ADDRESSES.TOKENB],
        abi: MAP_STR_ABI[CONTRACT_ADDRESSES.ERC20_ABI],
        args: [SEPOLIA_ADDRESSES[CONTRACT_ADDRESSES.ROUTER], to_wei(approvalAmount)],
        functionName: 'approve',
        onSuccess(data) {
            console.log({ approvalB: data });
        },
        onError(err) {
            console.log({ approvalErrB: err });
        }
    })
    const { data: _, write: AddLiquidity } = useContractWrite({
        address: SEPOLIA_ADDRESSES[CONTRACT_ADDRESSES.ROUTER],
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
                SEPOLIA_ADDRESSES[CONTRACT_ADDRESSES.TOKENA],
                SEPOLIA_ADDRESSES[CONTRACT_ADDRESSES.TOKENB],
                to_wei(selectedTokenAmount0),
                to_wei(selectedTokenAmount1),
                to_wei(to_wei('1')),
                to_wei(to_wei('1')),
                address,
                deadline,
            ],
        });
    }

    function tokenAmountInputHandler(index: number, amount: string) {
        mapIndexToInput[index](amount);
    }


    function handleApprovals() {
        approveA();
        approveB();
    }



    const { chain } = useNetwork();


    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location])
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
                        <p>Clear all</p>
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
                        <h2>0.00020500</h2>
                        <p>ETH per DAI</p>
                    </div>
                    <section className="deposit-field">
                        <h2>Deposit amounts</h2>
                        <div className="input-hold">
                            <div className="input-wrap">
                                <div className="inner-items">
                                    <input onChange={(e) => tokenAmountInputHandler(0, e.target.value)} type="text" placeholder="0" />
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
                                    <p className="balance">Balance: 0 <span className="max-btn">MAX</span></p>
                                </div>
                            </div>
                            <div className="input-wrap">
                                <div className="inner-items">
                                    <input onChange={(e) => tokenAmountInputHandler(1, e.target.value)} type="text" placeholder="0" />
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
                                    <p className="balance">Balance: 0 <span className="max-btn">MAX</span></p>
                                </div>
                            </div>
                        </div>
                        <button onClick={handleAddLiquidity} className="deposit-btn">Add liquidity</button>
                        {/* <button onClick={AddLiquidity} className="deposit-btn">Enter an amount</button> */}
                        {/* <button onClick={handleApprovals} className="deposit-btn">{allowanceA > 0 ? 'Insufficient DAI balance' : 'Approve'}</button> */}
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
                color: #9f9f9f;
                /* background-color: rgb(255, 255, 255, 0.1); */
                background-color: rgb(149, 60, 53);
                border-radius: 20px;
                cursor: pointer;
            }
        }
    }
  }
`