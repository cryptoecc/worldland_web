import * as S from "./style/index.style"
import Layout from 'components/@common/Layout/Layout';
import { useState, ChangeEvent, createElement, useEffect } from "react";
import { WldChainIcon } from "assets/static/chain-assets/WldChainIcon";
import { EthChainIcon, } from "assets/static/chain-assets/EthChainIcon";
import { EthTokenIcon, } from "assets/static/token-assets/EthTokenIcon";
import { DownArrowIcon } from "assets";
import BridgeModeToggleIcon from "assets/static/chain-assets/BridgeModeToggleIcon";
import SelectList from "components/Bridge/SelectList";
import { bridgeSelectListETH, bridgeSelectListWLD, initialBridgeSelect } from "constants/select";
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
import { MAPNETTOADDRESS, MAPNETWORKTOCHAINID } from "configs/contract_address_config";
import { ABI, CONTRACT_ADDRESSES, FUNCTION } from "utils/enum";
import { MAP_STR_ABI } from "configs/abis";
import { formatEther, parseEther } from "viem";
import { from_wei, handleBtnState, to_wei } from "utils/util";



const Bridge = () => {
    const { chain } = useNetwork();
    const { address, isConnected } = useAccount();
    const { open } = useWeb3Modal();
    const [thisChainTokenList, setThisChainTokenList] = useState<ListItemType[]>(chain?.id === 1 ? bridgeSelectListETH : bridgeSelectListWLD);
    const [otherChainTokenList, setOtherChainTokenList] = useState<ListItemType[]>(chain?.id === 1 ? bridgeSelectListWLD : bridgeSelectListETH);
    const [inputSelect, setInputSelect] = useState<ListItemType>(thisChainTokenList[0]);
    const [outputSelect, setOutputSelect] = useState<ListItemType>(thisChainTokenList[0]);
    const [input, setInput] = useState("");
    const [modal, setModal] = useState<boolean>(false);
    const [disabled, setDisabled] = useState<boolean>(false);
    const [btnState, setBtnState] = useState<number>(1);

    const { data: ethBalance } = useBalance({ address });
    const { data: tokenBalance } = useBalance({ address, token: inputSelect.address });
    const { data: otherChainEthBalance } = useBalance({ chainId: outputSelect.networkId, address });
    const { data: otherChainTokenBalance } = useBalance({ chainId: outputSelect.networkId, address, token: outputSelect.address });

    const { write: send } = useContractWrite({
        address: MAPNETWORKTOCHAINID[chain?.id as number][CONTRACT_ADDRESSES.BRIDGE],
        abi: MAP_STR_ABI[ABI.BRIDGEBASE_ABI],
        functionName: inputSelect.funcType,
        onSuccess() {
            setInput("");
        },

        onError(err) {
            console.log({ approvalErrB: err });
        },
    });

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
        switch (chain?.id) {
            case 1:
                setInputSelect(bridgeSelectListETH[0]);
                setOutputSelect(bridgeSelectListWLD[0]);
                setThisChainTokenList(bridgeSelectListETH);
                setOtherChainTokenList(bridgeSelectListWLD);
                break;
            case 103:
                setInputSelect(bridgeSelectListWLD[0]);
                setOutputSelect(bridgeSelectListETH[0]);
                setThisChainTokenList(bridgeSelectListWLD);
                setOtherChainTokenList(bridgeSelectListETH);
                break;
            default:
                return;
        }
    }, [chain?.id])

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
                            Balance: <span>0</span>
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
                            Balance: <span>0</span>
                        </S.B>
                    </S.Chain>
                </S.ParentWrap>
                <S.Button onClick={handleFunctionSelector}>
                    {handleBtnState(btnState, inputSelect)}
                </S.Button>
                {modal && <SelectList tokenList={thisChainTokenList} setInputSelect={handleSelectItem} modal={modal} handler={setModal} />}
            </S.Container>
        </Layout>
    )
}

export default Bridge