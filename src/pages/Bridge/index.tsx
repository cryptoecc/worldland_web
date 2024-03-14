import * as S from "./style/index.style"
import Layout from 'components/@common/Layout/Layout';
import { useState, ChangeEvent, createElement, useEffect } from "react";
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

const Bridge = () => {
    const { chain } = useNetwork();
    const { address, isConnected } = useAccount();
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
    const [chainToggleState, setChainToggleState] = useState<boolean>(false);
    const { data: ethBalance } = useBalance({ address, watch: true });
    const { data: otherChainEthBalance } = useBalance({ chainId: outputSelect.networkId, address, watch: true });

    const { data: tokenBalance } = useBalance({ address, token: inputSelect.address, watch: true });
    const { data: otherChainTokenBalance } = useBalance({ chainId: outputSelect.networkId, address, watch: true, token: outputSelect.address });


    const { data: allowance } = useContractRead({
        address: inputSelect.address,
        abi: MAP_STR_ABI[ABI.ERC20_ABI],
        functionName: QUERY.ALLOWANCE,
        args: [address, networkType],
        watch: true,
        onSuccess(data: any) {
            console.log({ tokenBalanceA: data });
        },
        onError(data: any) {
            console.log({ error: data });
        },
    });

    const { data: fixedFee } = useContractRead({
        address: networkType,
        abi: MAP_STR_ABI[ABI.BRIDGEBASE_ABI],
        functionName: QUERY.FIXEDFEE,
        args: [],
        watch: true,
        onSuccess(data: any) {
            console.log({ FIXEDFEE: data })
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


    const { data: bridgeTx, write: sendBridge } = useContractWrite({
        address: networkType,
        abi: MAP_STR_ABI[ABI.BRIDGEBASE_ABI],
        functionName: inputSelect.funcType,
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

    useWaitForTransaction({
        hash: bridgeTx?.hash || approvalTx?.hash,
        staleTime: 2_000,
        onSuccess() {
            addToast(MESSAGES.TX_SUCCESS, {
                appearance: 'success',
                content: approvalTx?.hash && MESSAGES.TX_CONTENT,
                autoDismiss: true,
            });
        },
        onError(err: any) {
            addToast(MESSAGES.TX_FAIL, {
                appearance: 'error',
                content: err?.shortMessage,
                autoDismiss: true,
            });
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
            if (!isConnected) {
                // metamask is not connected
                open();
                return;
            } else if (chain?.id !== inputSelect.networkId) {
                // wrong network
                switchNetwork?.(inputSelect.networkId);
            } else if (input === "0" || input === "") {
                // empty field
                return;
            } else if (inputSelect.funcType === FUNCTION.LOCKETH) {
                if (parseFloat(ethBalance?.formatted as string) < parseFloat(input)) {
                    // low eth balance
                    return;
                } else {
                    sendBridge({
                        args: [
                            address,
                            inputSelect.address
                        ],
                        value: parseEther(input)
                    })
                }
            } else if (inputSelect.funcType === FUNCTION.BURNWETH) {
                if (parseFloat(tokenBalance?.formatted as string) < parseFloat(input)) {
                    // low token balance
                    return;
                } else if (parseFloat(formatEther(allowance)) < parseFloat(input)) {
                    // low allowance
                    sendApprove();
                    return;
                } else {
                    sendBridge({
                        args: [
                            to_wei(input),
                            inputSelect.address
                        ],
                        value: fixedFee.toString()
                    })
                }
            } else if (inputSelect.funcType === FUNCTION.LOCKTOKEN) {
                if (parseFloat(tokenBalance?.formatted as string) < parseFloat(input)) {
                    // low token balance
                    return;
                } else if (parseFloat(formatEther(allowance)) < parseFloat(input)) {
                    // low allowance
                    sendApprove();
                    return;
                } else {
                    sendBridge({
                        args: [
                            address,
                            to_wei(input),
                            inputSelect.token,
                            inputSelect.address
                        ],
                        value: fixedFee.toString()
                    })
                }
            } else if (inputSelect.funcType === FUNCTION.BURNTOKEN) {
                if (parseFloat(tokenBalance?.formatted as string) < parseFloat(input)) {
                    // low token balance
                    return;
                } else if (parseFloat(formatEther(allowance)) < parseFloat(input)) {
                    // low allowance
                    sendApprove();
                    return;
                } else {
                    sendBridge({
                        args: [
                            address,
                            to_wei(input),
                            inputSelect.address,
                            inputSelect.token
                        ],
                        value: fixedFee.toString()
                    })
                }
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
        } else if (inputSelect.funcType === FUNCTION.LOCKETH) {
            if (parseFloat(ethBalance?.formatted as string) < parseFloat(input)) {
                // low eth balance
                setDisabled(true);
                setBtnState(1);
            } else {
                setDisabled(false);
                setBtnState(9);
            }
        } else if (inputSelect.funcType === FUNCTION.BURNWETH) {
            if (parseFloat(tokenBalance?.formatted as string) < parseFloat(input)) {
                // low token balance
                setDisabled(true);
                setBtnState(1);
            } else if (parseFloat(formatEther(allowance)) < parseFloat(input)) {
                // low allowance
                setDisabled(false);
                setBtnState(2);
            } else {
                setDisabled(false);
                setBtnState(9);
            }
        } else if (inputSelect.funcType === FUNCTION.LOCKTOKEN) {
            if (parseFloat(tokenBalance?.formatted as string) < parseFloat(input)) {
                // low token balance
                setDisabled(true);
                setBtnState(1);
            } else if (parseFloat(formatEther(allowance)) < parseFloat(input)) {
                // low allowance
                setDisabled(false);
                setBtnState(2);
            } else {
                setDisabled(false);
                setBtnState(9);
            }
        } else if (inputSelect.funcType === FUNCTION.BURNTOKEN) {
            if (parseFloat(tokenBalance?.formatted as string) < parseFloat(input)) {
                // low token balance
                setDisabled(true);
                setBtnState(1);
            } else if (parseFloat(formatEther(allowance)) < parseFloat(input)) {
                // low allowance
                setDisabled(false);
                setBtnState(2);
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
        tokenBalance?.formatted
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
                            type="text"
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
                </S.ParentWrap>
                <S.Button disabled={disabled} onClick={handleFunctionSelector}>
                    {handleBtnState(btnState, inputSelect)}
                </S.Button>
                {modal && <SelectList tokenList={thisChainTokenList} setInputSelect={handleSelectItem} modal={modal} handler={setModal} />}
            </S.Container>
        </Layout>
    )
}

export default Bridge