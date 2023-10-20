import styled from 'styled-components';
import VideoContainer from 'components/VideoContainer';
import Video from 'components/Video';
import Backdrop from 'components/Backdrop';
import { ImDrawer2 } from "react-icons/im";
import { AiOutlineArrowRight } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useAccount, useContractWrite, useContractRead, useContractReads } from 'wagmi';
import { MAPNETTOADDRESS } from 'configs/contract_address_config';
import { ABI, CONTRACT_ADDRESSES, FUNCTION } from 'utils/enum';
import { MAP_STR_ABI } from 'configs/abis';
import { useState } from 'react';
import { from_wei, putCommaAtPrice, to_wei } from 'utils/util';
import { crypto_list } from 'data';
import { PAIR_ADRESSES } from 'configs/contract_addresses';
import { erc20ABI } from 'wagmi';
import RemoveLiquidityModal from 'components/RemoveLiquidityModal';




interface Ipairs {
    pairs?: ImapPairToBalance[];
}

const Pool = () => {
    const { address, isConnected } = useAccount()
    const [pairs, setPairs] = useState<ImapPairToBalance[]>([])
    const [selectedPair, setSelectedPair] = useState<Pair>()
    const navigate = useNavigate();
    const [modal, setModal] = useState<boolean>(false);
    const [amountOut, setAmountOut] = useState<string>("")
    const [allowanceLP, setAllowanceLP] = useState<string>('')



    const { data } = useContractReads({
        contracts: [
            {
                address: PAIR_ADRESSES[0],
                abi: erc20ABI,
                functionName: 'balanceOf',
                args: [address as any],
            },
        ],
        watch: true,
        onSuccess(data: any) {
            console.log({ pairBalance: data })
            const arr = [];
            for (let i = 0; i < data.length; i++) {
                data[i]['address'] = PAIR_ADRESSES[i];
                data[i]['balance'] = data[i].result;
                delete data[i]['result'];
                delete data[i]['status'];

                if (Number(from_wei(data[i].balance)) > 0) {
                    // user has a balance of LP tokens
                    arr.push(data[i]);
                }
            }
            console.log({ ARRR: arr })
            setPairs(arr);

        },
        onError(data: any) {
            console.log({ error: data })
        }
    })

    const { data: _ } = useContractRead({
        address: MAPNETTOADDRESS[CONTRACT_ADDRESSES.ROUTER],
        abi: MAP_STR_ABI[ABI.LVSWAPV2_ROUTER],
        functionName: FUNCTION.GETAMOUNTOUT,
        args: [
            MAPNETTOADDRESS[CONTRACT_ADDRESSES.FACTORY],
            to_wei("1"),
            MAPNETTOADDRESS[CONTRACT_ADDRESSES.TOKENA],
            MAPNETTOADDRESS[CONTRACT_ADDRESSES.TOKENB],
        ],
        watch: true,
        onSuccess(data: any) {
            console.log({ amountOut: data })
            setAmountOut(data);
        },
        onError(data: any) {
            console.log({ error: data })
        }
    })

    const { data: _allowance } = useContractRead({
        address: selectedPair?.address,
        abi: MAP_STR_ABI[ABI.ERC20_ABI],
        functionName: 'allowance',
        args: [address, MAPNETTOADDRESS[CONTRACT_ADDRESSES.ROUTER]],
        watch: true,
        onSuccess(data: any) {
            console.log({ allowanceLP: data })
            setAllowanceLP(data);
        },
        onError(data: any) {
            console.log({ error: data })
        }
    })

    function handlePairClick(pair: Pair) {
        setModal(true)
        console.log({ pair })
        setSelectedPair(pair);
    }

    const { write: approveLP } = useContractWrite({
        address: selectedPair?.address,
        abi: MAP_STR_ABI[CONTRACT_ADDRESSES.ERC20_ABI],
        args: [MAPNETTOADDRESS[CONTRACT_ADDRESSES.ROUTER], selectedPair?.balance],
        functionName: 'approve',
        gas: BigInt(250000),
        onSuccess(data) {
            console.log({ approvalLP: data });
        },
        onError(err) {
            console.log({ approvalErrLP: err });
        }
    })

    return (
        <Container pairs={pairs}>
            <Backdrop intensity={5} />
            <VideoContainer>
                <Video autoPlay loop muted playsInline>
                    <source src="/videos/MainVideo.mp4" />
                    Your browser does not support the video tag.
                </Video>
            </VideoContainer>
            <section className="content-wrap">
                <div className="header">
                    <h1>Pools</h1>
                    <button onClick={() => navigate('add-liquidity')} className="add-liquidity">
                        + New position
                    </button>
                </div>
                <div className="active-positions">
                    <div className="positions">
                        <ul className="header">
                            <li>Pool</li>
                            <li>Range</li>
                            <li>Value</li>
                            <li>Status</li>
                            <li>Current Price</li>
                        </ul>
                        <ul className="pairs">
                            {pairs.map((el, i) => (
                                <li onClick={() => handlePairClick(el)} key={i}>
                                    <span className="pair-logo">
                                        <img className="image move" src={crypto_list[0]['icon']} alt={crypto_list[0]['title']} />
                                        <img className="image" src={crypto_list[1]['icon']} alt={crypto_list[1]['title']} />
                                        <p className="pair-name">
                                            {crypto_list[0]['symbol']}/{crypto_list[1]['symbol']}
                                        </p>
                                    </span>
                                    <span className="range">
                                        <p>
                                            {putCommaAtPrice(from_wei(amountOut), 3)} {"->"} {putCommaAtPrice(1, 3)}
                                        </p>
                                        <p>
                                            {crypto_list[1]['symbol']} per {crypto_list[0]['symbol']}
                                        </p>
                                    </span>
                                    <p className="value-in-usd">
                                        {/* $ - */}
                                    </p>

                                    <span className="status">
                                        <p>In Range</p>
                                    </span>

                                    <p className="value-in-token">
                                        {putCommaAtPrice(from_wei(amountOut), 3)} {crypto_list[1]['symbol']}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="no-positions">
                        <ImDrawer2 color="#ffffff" size={55} />
                        <h3>Your active liquidity positions will appear here.</h3>
                    </div>
                </div>
                <div className="learn">
                    <div className="walkthrough">
                        <p>Learn about providing liquidity <AiOutlineArrowRight color="#b4b4b4" size={15} style={{ transform: "rotate(-45deg)" }} /></p>
                        <p>Check out our v3 LP walkthrough and migration guides.</p>
                    </div>
                    <div className="walkthrough">
                        <p>Top pools <AiOutlineArrowRight color="#b4b4b4" size={15} style={{ transform: "rotate(-45deg)" }} /></p>
                        <p>Explore Kimchiswap analytics.</p>
                    </div>
                </div>
            </section>
            {modal && (
                <>
                    <Backdrop intensity={10} close={setModal} />
                    <RemoveLiquidityModal selectedPair={selectedPair} allowance={allowanceLP} handleApprove={approveLP} close={setModal} />
                </>
            )}
        </Container>
    )
}

export default Pool;

const Container = styled.div<Ipairs>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100vh;
  font-family: 'Nunito Sans', sans-serif;
  padding: 20px;
  .content-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    z-index: 5;
    max-width: 1100px;
    width: 100%;
    gap: 30px;
    overflow: hidden;
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        font-weight: 600;
        h1 {
        color: #ffffff;
        font-size: 38px;
        }
        button {
        color: #ffffff;
        font-size: 20px;
        border-radius: 15px;
        background-color: #FC72FF;
        padding: 12px;
        cursor: pointer;
        }
        button:hover {
            opacity: 0.9;
        }
    }
    .active-positions {
        display: flex;
        align-items: ${(props: Ipairs) => props.pairs && props?.pairs.length === 0 ? "center" : "flex-start"};
        justify-content: center;
        border-radius: 15px;
        background-color: rgb(255, 255, 255, 0.1);
        width: 100%;
        max-width: inherit;
        height: 100%;
        padding: 0;
        overflow-y: hidden;
        .no-positions {
            display: ${(props: Ipairs) => props.pairs && props?.pairs.length === 0 ? "flex" : "none"};
            align-items: center;
            justify-content: center;
            gap: 20px;
            flex-direction: column;
            color: #ffffff;
            height: 300px;

            h3 {
                font-size: 20px;
                max-width: 320px;
                text-align: center;
                line-height: 1.4;
            }
        }
        .positions {
            display: ${(props: Ipairs) => props.pairs && props?.pairs.length === 0 ? "none" : "flex"};
            align-items: center;
            justify-content: center;
            flex-direction: column;
            color: #ffffff;
            max-width: 100%;
            width: 100%;
            .header {
                display: flex;
                align-items: center;
                justify-content: space-between;
              
                width: 100%;
                padding: 15px 30px;
                background-color: rgb(24, 32, 47, 0.6);
                border-radius: 15px 15px 0 0;
                color: #7a7a7a;

                li:nth-of-type(1) {
                    width: 100%;
                    max-width: 250px;
                }
            }
            .pairs {
                display: flex;
                flex-direction: column;
                width: 100%;
                height: 100%;
                max-height: 300px;
                overflow-y: scroll;

                &::-webkit-scrollbar {
                    width: 0;
                    height: 0;
                }

                &::-webkit-scrollbar-track {
                    background: transparent;
                }

                li {
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    width: 100%;
                    padding: 7px 0;
                    gap: 50px;
                    font-weight: 600;
                    color: #c6c6c6;
                    font-size: 14px;
                    cursor: pointer;

                    .pair-logo {
                        display: flex;
                        align-items: center;
                        justify-content: flex-start;
                        gap: 10px;
                        width: 100%;
                        max-width: 330px;
                        

                        .image {
                            width: 35px;
                            height: 35px;
                            border: 3px solid rgb(24, 32, 47, 0.7);
                            border-radius: 50%;
                        }
                        .move {
                            transform: translateX(23px);
                        }
                    }
                    .range {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-direction: column;
                        gap: 5px;
                        font-weight: 600;
                        color: #c6c6c6;
                        width: 100%;
                        max-width: 150px;
                    }
                    .value-in-usd {
                        width: 100%;
                        max-width: 150px;
                    }
                       
                    .status {
                            font-size: 12px;
                            border-radius: 20px;
                            background-color:  rgb(0, 255, 25, 0.4);
                            padding: 3px 10px;
                        }
                    .value-in-token {
                        max-width: 170px;
                        width: 100%;
                        text-align: right;
                    }
                }
                li:nth-of-type(odd) {
                    background-color: rgb(255, 255, 255, 0.1);
                }
                li:nth-of-type(even) {
                    background-color: none;
                }
            }
        }
    } 
    .learn {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;

        .walkthrough {
            display: flex;
            align-items: flex-start;
            justify-content: center;
            flex-direction: column;
            gap: 10px;
            padding: 20px;
            border: 1px solid #5b5b5b;
            border-radius: 20px;
            color: #b4b4b4;
            max-width: 440px;
            width: 100%;
            font-weight: 550;
            max-height: 100px;
            height: 100%;
        }
        .walkthrough:hover {
            opacity: 0.6;
            cursor: pointer;
        }

        @media screen and (max-width: 728px) {
            flex-direction: column;
            gap: 20px;
        }
    }
  }
`