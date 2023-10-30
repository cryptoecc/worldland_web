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
import { useEffect, useState } from 'react';
import { from_wei, putCommaAtPrice, to_wei } from 'utils/util';
import { crypto_list } from 'data';
import { PAIR_ADRESSES } from 'configs/contract_addresses';
import { erc20ABI } from 'wagmi';
import RemoveLiquidityModal from 'components/RemoveLiquidityModal';
import { gasLimit } from 'utils/wagmi';
import { chain_query } from 'configs/contract_calls';




interface Ipairs {
    pairs?: Pair[];
}

const Pool = () => {
    const { address } = useAccount()
    const [pairs, setPairs] = useState<Pair[]>([])
    const [selectedPair, setSelectedPair] = useState<Pair>()
    const navigate = useNavigate();
    const [modal, setModal] = useState<boolean>(false);
    const [allowanceLP, setAllowanceLP] = useState<string>('')



    const { data } = useContractReads({
        contracts: PAIR_ADRESSES.map((el) => ({
            address: el,
            abi: erc20ABI,
            functionName: 'balanceOf',
            args: [address as any],
        })),
        watch: true,
        onSuccess(data: any) {
            const arr = [];
            for (let i = 0; i < data.length; i++) {
                data[i]['address'] = PAIR_ADRESSES[i];
                data[i]['balance'] = data[i].result;
                delete data[i]['result'];
                delete data[i]['status'];

                if (Math.floor(parseFloat(from_wei(data[i].balance))) > 0) {
                    // user has a balance of LP tokens
                    arr.push(data[i]);
                }
            }
            handleQueryAmountOutForToken(arr);

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
            setAllowanceLP(data.toString());
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
        args: [MAPNETTOADDRESS[CONTRACT_ADDRESSES.ROUTER], selectedPair?.balance?.toString()],
        functionName: 'approve',
        gas: gasLimit,
        onSuccess(data) {
            console.log({ approvalLP: data });
        },
        onError(err) {
            console.log({ approvalErrLP: err });
        }
    })

    async function handleExtractPairFromPool(pair?: string) {
        try {
            let _pair: { token0: string; token1: string } = { token0: "", token1: "" };
            // token0 query
            _pair['token0'] = await chain_query({
                chain: 2,
                contract_address: pair,
                abikind: ABI.LVSWAPV2_PAIR,
                methodname: FUNCTION.TOKEN0,
                f_args: []
            })
            // token1 query
            _pair['token1'] = await chain_query({
                chain: 2,
                contract_address: pair,
                abikind: ABI.LVSWAPV2_PAIR,
                methodname: FUNCTION.TOKEN1,
                f_args: []
            })
            return _pair;
        } catch (err) {

            console.log(err)
        }
    }

    async function returnAmount(args: string[]) {
        return await chain_query({
            chain: 2,
            contract_address: MAPNETTOADDRESS[CONTRACT_ADDRESSES.ROUTER],
            abikind: ABI.LVSWAPV2_ROUTER,
            methodname: FUNCTION.GETAMOUNTOUT,
            f_args: [
                MAPNETTOADDRESS[CONTRACT_ADDRESSES.FACTORY],
                to_wei("1"),
                ...args
            ]
        })
    }

    async function returnTotalSupply(pair?: `0x${string}`) {
        try {
            return await chain_query({
                chain: 2,
                contract_address: pair,
                abikind: ABI.LVSWAPV2_PAIR,
                methodname: FUNCTION.TOTALSUPPLY,
                f_args: []
            })
        } catch (err) {
            console.log(err);
        }
    }
    async function returnReserves(pair?: `0x${string}`) {
        try {
            let { 0: reserve0, 1: reserve1 } = await chain_query({
                chain: 2,
                contract_address: pair,
                abikind: ABI.LVSWAPV2_PAIR,
                methodname: FUNCTION.GETRESERVES,
                f_args: []
            })
            return { reserve0, reserve1 };
        } catch (err) {
            console.log(err);
        }
    }

    async function calcPooledUserAsset(pair: Pair) {
        try {
            // User's Token A Balance = (User's Share of Total Liquidity / Total Liquidity) * Total Token A in the Pool
            let pooledA = ((parseFloat(from_wei(pair?.balance)) / parseFloat(from_wei(pair?.totalSupply))) * parseFloat(from_wei(pair?.reserve0)))
            let pooledB = ((parseFloat(from_wei(pair?.balance)) / parseFloat(from_wei(pair?.totalSupply))) * parseFloat(from_wei(pair?.reserve1)))
            return { pooledA, pooledB }
        } catch (err) {
            console.log(err)
        }
    }



    async function handleQueryAmountOutForToken(_pairs: Pair[]) {
        try {
            let updatedPairArr: Pair[] = [];
            for (let i = 0; i < _pairs.length; i++) {
                let pair = await handleExtractPairFromPool(_pairs[i]?.address);
                updatedPairArr[i] = {
                    ..._pairs[i],
                    totalSupply: (await returnTotalSupply(_pairs[i]?.address)),
                    reserve0: ((await returnReserves(_pairs[i]?.address))?.reserve0),
                    reserve1: ((await returnReserves(_pairs[i]?.address))?.reserve1),
                    token0: pair?.token0,
                    token1: pair?.token1,
                    AtoB: (await returnAmount([pair?.token0 as string, pair?.token1 as string])),
                    BtoA: (await returnAmount([pair?.token1 as string, pair?.token0 as string])),
                    pooledA: (await calcPooledUserAsset({
                        ..._pairs[i],
                        totalSupply: (await returnTotalSupply(_pairs[i]?.address)),
                        reserve0: ((await returnReserves(_pairs[i]?.address))?.reserve0),
                        reserve1: ((await returnReserves(_pairs[i]?.address))?.reserve1),
                    }))?.pooledA,
                    pooledB: (await calcPooledUserAsset({
                        ..._pairs[i],
                        totalSupply: (await returnTotalSupply(_pairs[i]?.address)),
                        reserve0: ((await returnReserves(_pairs[i]?.address))?.reserve0),
                        reserve1: ((await returnReserves(_pairs[i]?.address))?.reserve1),
                    }))?.pooledB,
                }
            }
            console.log({ updatedPairArr })
            setPairs(updatedPairArr);

        } catch (err) {
            console.log(err);
        }
    }




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
                                            {putCommaAtPrice(from_wei(el.AtoB), 5)} {"->"} {putCommaAtPrice(1, 3)}
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
                                        {putCommaAtPrice(from_wei(el.AtoB), 5)} {crypto_list[1]['symbol']}
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