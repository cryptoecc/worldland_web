import * as S from "./style/index.style"
import Layout from 'components/@common/Layout/Layout';
import { useState, ChangeEvent, createElement, useEffect, useCallback } from "react";
import { DownArrowIcon } from "assets";
import BridgeModeToggleIcon from "assets/static/chain-assets/BridgeModeToggleIcon";
import SelectList from "components/Bridge/SelectList";
import { FundTypes, bridgeSelectListETH, bridgeSelectListWLD, initialBridgeSelect } from "constants/select";
import { ListItemType } from "types/select";
import {
    useAccount,
    useNetwork,
    useSwitchNetwork,
    useBalance,
    useContractWrite,
    useWaitForTransaction,
    useContractRead,
} from 'wagmi';
import { useWeb3Modal } from '@web3modal/react';
import { MAPNETWORKTOCHAINID } from "configs/contract_address_config";
import { ABI, CONTRACT_ADDRESSES, FUNCTION, QUERY } from "utils/enum";
import { MAP_STR_ABI } from "configs/abis";
import { formatEther, parseEther } from "viem";
import { handleBtnState, putCommaAtPrice, to_wei } from "utils/util";
import { useToasts } from 'react-toast-notifications';

import { NETWORKS } from "configs/networks";
import { MESSAGES } from "utils/messages";
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import debounce from "lodash.debounce";

interface FEE_QUERY {
    networkFeeType: string;
    networkFee: bigint;
    bridgeFee: bigint;
}

const Bridge = () => {
    const { chain } = useNetwork();
    const { address, isConnected } = useAccount();
    const [toAddress, setToAddress] = useState<string>("");
    const networkType = MAPNETWORKTOCHAINID[chain?.id ?? 11155111][CONTRACT_ADDRESSES.BRIDGE];
    const { open } = useWeb3Modal();
    const { addToast } = useToasts();
    const [thisChainTokenList, setThisChainTokenList] = useState<ListItemType[]>(chain?.id === NETWORKS.CHAIN_1 ? bridgeSelectListETH : bridgeSelectListWLD);
    const [otherChainTokenList, setOtherChainTokenList] = useState<ListItemType[]>(chain?.id === NETWORKS.CHAIN_1 ? bridgeSelectListWLD : bridgeSelectListETH);
    const [inputSelect, setInputSelect] = useState<ListItemType>(thisChainTokenList[0]);
    const [outputSelect, setOutputSelect] = useState<ListItemType>(thisChainTokenList[0]);
    const [input, setInput] = useState("");
    const [modal, setModal] = useState<boolean>(false);
    const [disabled, setDisabled] = useState<boolean>(false);
    const [btnState, setBtnState] = useState<number>(1);
    const { data: ethBalance } = useBalance({ address, watch: true });
    const { data: otherChainEthBalance } = useBalance({ chainId: outputSelect.networkId, address, watch: true });

    const { data: tokenBalance } = useBalance({ address, token: inputSelect.address, watch: true });
    const { data: otherChainTokenBalance } = useBalance({ chainId: outputSelect.networkId, address, watch: true, token: outputSelect.address });
    const { data: networkFeeBalance } = useBalance({ address, token: MAPNETWORKTOCHAINID[chain?.id ?? 11155111][CONTRACT_ADDRESSES.WETH_ADDRESS], watch: true });

    const [debouncedBridgeFee, setDebouncedBridgeFee] = useState<string>("");
    const [feeQuery, setFeeQuery] = useState<FEE_QUERY>({ networkFee: BigInt(0), bridgeFee: BigInt(0), networkFeeType: "" });


    const { data: allowance } = useContractRead({
        address: inputSelect.address,
        abi: MAP_STR_ABI[ABI.ERC20_ABI],
        functionName: QUERY.ALLOWANCE,
        args: [address, networkType],
        watch: true,
        onSuccess(data: any) {
            console.log({ tokenBalanceA: formatEther(data) });
        },
        onError(data: any) {
            console.log({ error: data });
        },
    });

    const { data: networkFeeTransferAllowance } = useContractRead({
        address: MAPNETWORKTOCHAINID[chain?.id ?? 11155111][CONTRACT_ADDRESSES.WETH_ADDRESS],
        abi: MAP_STR_ABI[ABI.WRAPPEDETH_ABI],
        functionName: QUERY.ALLOWANCE,
        args: [address, networkType],
        watch: true,
        onSuccess(data: any) {
            console.log({ networkFeeTransferAllowance: formatEther(data) });
        },
        onError(data: any) {
            console.log({ error: data });
        },
    });

    const handleDebouncedBridgeFee = useCallback(
        debounce((value: string) => {
            setDebouncedBridgeFee(value);
        }, 1000), []
    )

    const { data: bridgeFee } = useContractRead({
        address: networkType,
        abi: MAP_STR_ABI[ABI.BRIDGEBASE_ABI],
        functionName: QUERY.GETBRIDGEFEE,
        args: [parseEther(debouncedBridgeFee)],
        onSuccess(data: any) {
            setFeeQuery((prev) => ({ ...prev, bridgeFee: data }));
        },
        onError(data: any) {
            console.log({ error: data });
        },
    });

    const { data: getNetworkFee } = useContractRead({
        address: networkType,
        abi: MAP_STR_ABI[ABI.BRIDGEBASE_ABI],
        functionName: QUERY.GETNETWORKFEE,
        onSuccess(data: any) {
            setFeeQuery((prev) => ({ ...prev, networkFee: data[3], networkFeeType: data[2] }));
        },
        onError(data: any) {
            console.log({ error: data });
        },
    });



    const { data: approvalTx, write: sendApprove } = useContractWrite({
        address: inputSelect.address,
        abi: MAP_STR_ABI[ABI.ERC20_ABI],
        functionName: FUNCTION.APPROVE,
        args: [
            networkType,
            to_wei('1000000000000')
        ],
        onSuccess() {
            setInput("");
            addToast(MESSAGES.TX_SENT, {
                appearance: 'success',
                autoDismiss: true,
            });
        },
        onError(err: any) {
            addToast(MESSAGES.TX_FAIL, {
                appearance: 'error',
                content: err?.shortMessage,
                autoDismiss: true,
            });
        },
    });

    const { write: networkFeeTransferApprove } = useContractWrite({
        address: MAPNETWORKTOCHAINID[chain?.id ?? 11155111][CONTRACT_ADDRESSES.WETH_ADDRESS],
        abi: MAP_STR_ABI[ABI.WRAPPEDETH_ABI],
        functionName: FUNCTION.APPROVE,
        args: [
            networkType,
            to_wei('1000000000000')
        ],
        onSuccess() {
            setInput("");
            addToast(MESSAGES.TX_SENT, {
                appearance: 'success',
                autoDismiss: true,
            });
        },
        onError(err: any) {
            addToast(MESSAGES.TX_FAIL, {
                appearance: 'error',
                content: err?.shortMessage,
                autoDismiss: true,
            });
        },
    });


    const { data: bridgeTx, write: sendBridge } = useContractWrite({
        address: networkType,
        abi: MAP_STR_ABI[ABI.BRIDGEBASE_ABI],
        functionName: inputSelect.funcType,
        onSuccess() {
            setInput("");
            setToAddress("");
            addToast(MESSAGES.TX_SENT, {
                appearance: 'success',
                autoDismiss: true,
            });
        },
        onError(err: any) {
            addToast(MESSAGES.TX_FAIL, {
                appearance: 'error',
                content: err?.shortMessage,
                autoDismiss: true,
            });
        },
    });

    useWaitForTransaction({
        hash: bridgeTx?.hash || approvalTx?.hash,
        staleTime: 2_000,
        onSuccess() {
            addToast(MESSAGES.TX_SUCCESS, {
                appearance: 'success',
                content: bridgeTx?.hash && MESSAGES.TX_SUCCESS,
                autoDismiss: true,
            });
            addToast(MESSAGES.TX_SUCCESS, {
                appearance: 'success',
                content: bridgeTx?.hash && MESSAGES.TX_CONTENT,
                autoDismiss: true,
            });
        },
        onError(err: any) {
            if (err?.name !== "TransactionNotFoundError") {
                addToast(MESSAGES.TX_FAIL, {
                    appearance: 'error',
                    content: err?.shortMessage,
                    autoDismiss: true,
                });
            }
        }
    })

    const { switchNetwork } = useSwitchNetwork({
        onSuccess(data) {
            addToast(MESSAGES.CHAIN_CHANGE(data?.name), {
                appearance: 'success',
                autoDismiss: true,
            });
        },
    });

    function setInputToMax() {
        try {
            setInput(inputSelect.balance ?? '');
        } catch (err) {
            console.log(err);
        }
    }

    function handleSelectItem(item: ListItemType, index: number) {
        try {
            const indexedItem = otherChainTokenList.find(el => index === el.id);
            setInputSelect(item);
            setOutputSelect(indexedItem as ListItemType);
        } catch (err) {
            console.log(err)
        }
    }

    async function handleFunctionSelector() {
        try {
            if (isConnected) {
                const _networkFee = feeQuery.networkFee;
                let total = (parseFloat(formatEther(bridgeFee) + parseFloat(input))).toString();
                if (chain?.id !== inputSelect.networkId) {
                    // wrong network
                    switchNetwork?.(inputSelect.networkId);
                } else if (input === "0" || input === "") {
                    // empty field
                    return;
                } else if (!toAddress) {
                    // empty to field
                    return;
                } else if (inputSelect.funcType === FUNCTION.LOCKETH) {
                    let sum = (parseFloat(formatEther(bridgeFee)) + parseFloat(input)).toString();
                    if (parseFloat(ethBalance?.formatted as string) < parseFloat(sum)) {
                        // low eth balance
                        return;
                    } else if (parseFloat(networkFeeBalance?.formatted as string) < parseFloat(formatEther(_networkFee))) {
                        // low network balance
                        return;
                    } else if (parseFloat(formatEther(allowance)) < parseFloat(sum)) {
                        // low weth/wwlc allowance
                        sendApprove();
                    } else {
                        sendBridge({
                            args: [
                                toAddress,
                                inputSelect.address,
                                bridgeFee
                            ],
                            value: parseEther(sum)
                        })
                    }
                } else if (inputSelect.funcType === FUNCTION.BURNWETH) {
                    let sum = parseFloat(formatEther(_networkFee)) + parseFloat(input);
                    if (parseFloat(tokenBalance?.formatted as string) < parseFloat(total)) {
                        // low token balance
                        return;
                    } else if (parseFloat(networkFeeBalance?.formatted as string) < sum) {
                        // low network balance
                        return;
                    } else if (parseFloat(formatEther(allowance)) < parseFloat(total)) {
                        // low allowance
                        sendApprove();
                    } else if (parseFloat(formatEther(networkFeeTransferAllowance)) < parseFloat(formatEther(_networkFee))) {
                        // low allowance on network fee (weth/wwlc)
                        networkFeeTransferApprove();
                    } else {
                        sendBridge({
                            args: [
                                toAddress,
                                bridgeFee,
                                parseEther(total),
                                inputSelect.address
                            ],
                            value: BigInt('0x00')
                        })
                    }
                } else if (inputSelect.funcType === FUNCTION.LOCKTOKEN) {
                    if (parseFloat(tokenBalance?.formatted as string) < parseFloat(total)) {
                        // low token balance
                        return;
                    } else if (parseFloat(networkFeeBalance?.formatted as string) < parseFloat(formatEther(_networkFee))) {
                        // low network balance
                        return;
                    } else if (parseFloat(formatEther(allowance)) < parseFloat(total)) {
                        // low allowance
                        sendApprove();
                        return;
                    } else if (parseFloat(formatEther(networkFeeTransferAllowance)) < parseFloat(formatEther(_networkFee))) {
                        // low allowance on network fee (weth/wwlc)
                        networkFeeTransferApprove();
                    } else {
                        sendBridge({
                            args: [
                                toAddress,
                                bridgeFee,
                                inputSelect.address,
                                parseEther(total),
                            ],
                            value: BigInt('0x00')
                        })
                    }
                } else if (inputSelect.funcType === FUNCTION.BURNTOKEN) {
                    if (parseFloat(tokenBalance?.formatted as string) < parseFloat(total)) {
                        // low token balance
                        return;
                    } else if (parseFloat(networkFeeBalance?.formatted as string) < parseFloat(formatEther(_networkFee))) {
                        // low network balance
                        return;
                    } else if (parseFloat(formatEther(allowance)) < parseFloat(total)) {
                        // low allowance
                        sendApprove();
                        return;
                    } else if (parseFloat(formatEther(networkFeeTransferAllowance)) < parseFloat(total)) {
                        // low allowance on network fee (weth/wwlc)
                        networkFeeTransferApprove();
                    } else {
                        sendBridge({
                            args: [
                                toAddress,
                                bridgeFee,
                                parseEther(total),
                                inputSelect.address,
                            ],
                            value: BigInt('0x00')
                        })
                    }
                }
            } else {
                // metamask is not connected
                open();
                return;
            }
        } catch (err) {
            console.log(err);
        }
    }



    function toggleChain() {
        try {
            if (isConnected) {
                setInputSelect(outputSelect);
                setOutputSelect(inputSelect);
            }
        } catch (err) {
            console.log(err);
        }
    }

    async function handleEvent(e: ChangeEvent<HTMLInputElement>) {
        setInput(e.target.value);
        handleDebouncedBridgeFee(e.target.value);
    }
    async function handleToEvent(e: ChangeEvent<HTMLInputElement>) {
        setToAddress(e.target.value);
    }

    useEffect(() => {
        if (isConnected) {
            switch (chain?.id) {
                case NETWORKS.CHAIN_1:
                    setInputSelect(bridgeSelectListETH[0]);
                    setOutputSelect(bridgeSelectListWLD[1]);
                    setThisChainTokenList(bridgeSelectListETH);
                    setOtherChainTokenList(bridgeSelectListWLD);
                    break;
                case NETWORKS.CHAIN_2:
                    setInputSelect(bridgeSelectListWLD[0]);
                    setOutputSelect(bridgeSelectListETH[1]);
                    setThisChainTokenList(bridgeSelectListWLD);
                    setOtherChainTokenList(bridgeSelectListETH);
                    break;
                default:
                    setInputSelect(bridgeSelectListETH[0]);
                    setOutputSelect(bridgeSelectListWLD[1]);
                    setThisChainTokenList(bridgeSelectListETH);
                    setOtherChainTokenList(bridgeSelectListWLD);
            }
        } else {
            setInputSelect(bridgeSelectListETH[0]);
            setOutputSelect(bridgeSelectListWLD[0]);
            setThisChainTokenList(bridgeSelectListETH);
            setOtherChainTokenList(bridgeSelectListWLD);
        }

    }, [isConnected, chain?.id])

    useEffect(() => {
        const _networkFee = feeQuery.networkFee;
        let total = (parseFloat(formatEther(bridgeFee) + parseFloat(input))).toString();
        if (!isConnected) {
            // metamask is not connected
            setDisabled(false);
            setBtnState(4);
        } else if (chain?.id !== inputSelect.networkId) {
            // wrong network
            setDisabled(false);
            setBtnState(8);
        } else if (input === "0" || input === "") {
            setDisabled(true);
            setBtnState(5);
        } else if (!toAddress) {
            setDisabled(true);
            setBtnState(10);
        } else if (inputSelect.funcType === FUNCTION.LOCKETH) {
            let sum = parseFloat(formatEther(bridgeFee)) + parseFloat(input)
            if (parseFloat(ethBalance?.formatted as string) < sum) {
                // low eth balance
                setDisabled(true);
                setBtnState(1);
            } else if (parseFloat(networkFeeBalance?.formatted as string) < parseFloat(formatEther(_networkFee))) {
                // low network balance
                setDisabled(true);
                setBtnState(11);
            } else if (parseFloat(formatEther(allowance)) < sum) {
                // low weth/wwlc allowance
                setDisabled(false);
                setBtnState(12);
            } else {
                setDisabled(false);
                setBtnState(9);
            }
        } else if (inputSelect.funcType === FUNCTION.BURNWETH) {
            let sum = parseFloat(formatEther(_networkFee)) + parseFloat(input);
            if (parseFloat(tokenBalance?.formatted as string) < parseFloat(total)) {
                // low token balance
                setDisabled(true);
                setBtnState(1);
            } else if (parseFloat(networkFeeBalance?.formatted as string) < sum) {
                // low network balance
                setDisabled(true);
                setBtnState(11);
            } else if (parseFloat(formatEther(allowance)) < parseFloat(total)) {
                // low allowance
                setDisabled(false);
                setBtnState(2);
            } else if (parseFloat(formatEther(networkFeeTransferAllowance)) < parseFloat(formatEther(_networkFee))) {
                // low allowance on network fee (weth/wwlc)
                setDisabled(false);
                setBtnState(12);
            } else {
                setDisabled(false);
                setBtnState(9);
            }
        } else if (inputSelect.funcType === FUNCTION.LOCKTOKEN) {
            if (parseFloat(tokenBalance?.formatted as string) < parseFloat(total)) {
                // low token balance
                setDisabled(true);
                setBtnState(1);
            } else if (parseFloat(networkFeeBalance?.formatted as string) < parseFloat(formatEther(_networkFee))) {
                // low network balance
                setDisabled(true);
                setBtnState(11);
            } else if (parseFloat(formatEther(allowance)) < parseFloat(total)) {
                // low allowance
                setDisabled(false);
                setBtnState(2);
            } else if (parseFloat(formatEther(networkFeeTransferAllowance)) < parseFloat(formatEther(_networkFee))) {
                // low allowance on network fee (weth/wwlc)
                setDisabled(false);
                setBtnState(12);
            } else {
                setDisabled(false);
                setBtnState(9);
            }
        } else if (inputSelect.funcType === FUNCTION.BURNTOKEN) {
            if (parseFloat(tokenBalance?.formatted as string) < parseFloat(total)) {
                // low token balance
                setDisabled(true);
                setBtnState(1);
            } else if (parseFloat(networkFeeBalance?.formatted as string) < parseFloat(formatEther(_networkFee))) {
                // low network balance
                setDisabled(true);
                setBtnState(11);
            } else if (parseFloat(formatEther(allowance)) < parseFloat(total)) {
                // low allowance
                setDisabled(false);
                setBtnState(2);
            } else if (parseFloat(formatEther(networkFeeTransferAllowance)) < parseFloat(total)) {
                // low allowance on network fee (weth/wwlc)
                setDisabled(false);
                setBtnState(12);
            } else {
                setDisabled(false);
                setBtnState(9);
            }
        }
    }, [
        isConnected,
        chain?.id,
        allowance,
        input,
        inputSelect,
        ethBalance?.formatted,
        tokenBalance?.formatted,
        toAddress,
        bridgeFee,
        getNetworkFee,
        networkFeeTransferAllowance,
        networkFeeBalance,
        feeQuery
    ])

    useEffect(() => {
        if (isConnected) {
            // balance monitor chain 1
            switch (inputSelect.fundType) {
                case FundTypes.COIN:
                    setInputSelect(prev => ({ ...prev, balance: putCommaAtPrice(ethBalance?.formatted ?? '0', 4) }));
                    break;
                case FundTypes.TOKEN:
                    setInputSelect(prev => ({ ...prev, balance: putCommaAtPrice(tokenBalance?.formatted ?? '0', 4) }))
                    console.log({ TOKENBALANCEWETH: tokenBalance })
            }
            // balance monitor chain 2
            switch (outputSelect.fundType) {
                case FundTypes.COIN:
                    setOutputSelect(prev => ({ ...prev, balance: putCommaAtPrice(otherChainEthBalance?.formatted ?? '0', 4) }));
                    break;
                case FundTypes.TOKEN:
                    setOutputSelect(prev => ({ ...prev, balance: putCommaAtPrice(otherChainTokenBalance?.formatted ?? '0', 4) }))
            }
        }
    }, [isConnected, inputSelect.fundType, outputSelect.fundType, ethBalance, otherChainEthBalance, tokenBalance, otherChainTokenBalance])



    return (
        <Layout>
            <S.Container>
                <S.Label>Bridge</S.Label>
                <S.SubLabel>Transfer From</S.SubLabel>
                <S.ParentWrap>
                    <S.Chain>
                        <S.ChainNameWrap>
                            {createElement(inputSelect.networkIcon)}
                            <S.B>
                                {inputSelect.network}
                            </S.B>
                        </S.ChainNameWrap>
                        <S.B>
                            Balance: <span>{inputSelect.balance}</span>
                        </S.B>
                    </S.Chain>
                    <S.InputWrapper>
                        <S.TokenWrap onClick={() => setModal(prev => !prev)}>
                            <S.SubTokenWrap>
                                {createElement(inputSelect.tokenIcon)}
                                <S.B>
                                    {inputSelect.token}
                                </S.B>
                            </S.SubTokenWrap>
                            {createElement(DownArrowIcon)}
                            <span></span>
                        </S.TokenWrap>
                        <S.Input
                            type="number"
                            pattern="^[0-9]*[.,]?[0.9]*$"
                            min="0.00001"
                            autoComplete="off"
                            placeholder="0.0000"
                            value={input}
                            onChange={handleEvent}
                        />
                        <S.MaxBtn onClick={setInputToMax}>Max</S.MaxBtn>
                    </S.InputWrapper>
                </S.ParentWrap>
                <S.ToggleIconHolder>
                    <S.ToggleIconWrap onClick={toggleChain}>
                        {createElement(BridgeModeToggleIcon)}
                    </S.ToggleIconWrap>
                </S.ToggleIconHolder>
                <S.SubLabel>Transfer To</S.SubLabel>
                <S.ParentWrap>
                    <S.Chain>
                        <S.ChainNameWrap>
                            {createElement(outputSelect.networkIcon)}
                            <S.B>
                                {outputSelect.network}
                            </S.B>
                        </S.ChainNameWrap>
                        <S.B>
                            Balance: <span>{outputSelect.balance}</span>
                        </S.B>
                    </S.Chain>
                    <S.Span />
                    <S.Chain>
                        {/* {createElement(outputSelect.networkIcon)} */}
                        <S.B>
                            To:
                        </S.B>
                        <S.AddressInput
                            type="text"
                            autoComplete="off"
                            placeholder="0x000"
                            value={toAddress}
                            onChange={handleToEvent}
                        />
                    </S.Chain>
                </S.ParentWrap>
                <S.Button disabled={disabled} onClick={handleFunctionSelector}>
                    {handleBtnState(btnState, inputSelect)}
                </S.Button>
                {modal && <SelectList tokenList={thisChainTokenList} setInputSelect={handleSelectItem} modal={modal} handler={setModal} />}
                <S.GasPriceField>
                    <LocalGasStationIcon sx={{ fontSize: '30px' }} />
                    <S.GasPriceFieldWrap>
                        <p>
                            Bridge Fee = {putCommaAtPrice(formatEther(feeQuery?.bridgeFee), 9)} {chain?.id === NETWORKS.CHAIN_1 ? "ETH" : "WLC"}
                        </p>
                        <p>
                            Network Fee = {putCommaAtPrice(formatEther(feeQuery?.networkFee), 9)} {feeQuery.networkFeeType}
                        </p>
                    </S.GasPriceFieldWrap>

                </S.GasPriceField>
            </S.Container>
        </Layout>
    )
}

export default Bridge