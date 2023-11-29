import * as S from "./style/index.style"
import Layout from 'components/@common/Layout/Layout';
import { useState, ChangeEvent, createElement, useEffect } from "react";
import { WldChainIcon } from "assets/static/chain-assets/WldChainIcon";
import { EthChainIcon, } from "assets/static/chain-assets/EthChainIcon";
import { EthTokenIcon, } from "assets/static/token-assets/EthTokenIcon";
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
import { ABI, CONTRACT_ADDRESSES, FUNCTION } from "utils/enum";
import { MAP_STR_ABI } from "configs/abis";
import { parseEther } from "viem";
import { handleBtnState, putCommaAtPrice, to_wei } from "utils/util";
import { useToasts } from 'react-toast-notifications';

import { NETWORKS } from "configs/networks";
import { MESSAGES } from "utils/messages";

const Bridge = () => {
    const { chain } = useNetwork();
    const { address, isConnected } = useAccount();
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


    const { data: tx, write: send } = useContractWrite({
        address: MAPNETWORKTOCHAINID[chain?.id as number][CONTRACT_ADDRESSES.BRIDGE],
        abi: MAP_STR_ABI[ABI.BRIDGEBASE_ABI],
        functionName: inputSelect.funcType,
        gas: BigInt(3000000),
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
        hash: tx?.hash,
        staleTime: 2_000,
        onSuccess(data) {
            addToast('Transaction has been executed!', {
                appearance: 'success',
                content: 'Transactions are stored and batch executed each 15 seconds!',
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
            console.log({ data });
        },
    });

    function handleSelectItem(item: ListItemType, index: number) {
        try {
            setInputSelect(item);
            setOutputSelect(otherChainTokenList[index]);
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
                    send({
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
                } else {
                    send({
                        args: [
                            to_wei(input),
                            inputSelect.address
                        ]
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
                    setOutputSelect(bridgeSelectListWLD[0]);
                    setThisChainTokenList(bridgeSelectListETH);
                    setOtherChainTokenList(bridgeSelectListWLD);
                    break;
                case NETWORKS.CHAIN_2:
                    setInputSelect(bridgeSelectListWLD[0]);
                    setOutputSelect(bridgeSelectListETH[0]);
                    setThisChainTokenList(bridgeSelectListWLD);
                    setOtherChainTokenList(bridgeSelectListETH);
                    break;
                default:
                    setInputSelect(bridgeSelectListETH[0]);
                    setOutputSelect(bridgeSelectListWLD[0]);
                    setThisChainTokenList(bridgeSelectListETH);
                    setOtherChainTokenList(bridgeSelectListWLD);
            }
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
            } else {
                setDisabled(false);
                setBtnState(9);
            }
        }
    }, [
        isConnected,
        chain?.id,
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
                            min="0.0001"
                            autoComplete="off"
                            placeholder="0.0000"
                            value={input}
                            onChange={handleEvent}
                        />
                        <S.MaxBtn>Max</S.MaxBtn>
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