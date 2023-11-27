import * as S from "./style/index.style"
import Layout from 'components/@common/Layout/Layout';
import { useState, ChangeEvent, createElement, useEffect } from "react";
import { WldChainIcon } from "assets/static/chain-assets/WldChainIcon";
import { EthChainIcon, } from "assets/static/chain-assets/EthChainIcon";
import { EthTokenIcon, } from "assets/static/token-assets/EthTokenIcon";
import { DownArrowIcon } from "assets";
import BridgeModeToggleIcon from "assets/static/chain-assets/BridgeModeToggleIcon";
import SelectList from "components/Bridge/SelectList";
import { bridgeSelectList, initialBridgeSelect } from "constants/select";
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



const Bridge = () => {
    const { chain } = useNetwork();
    const { address, isConnected } = useAccount();
    const filteredList = bridgeSelectList.filter((el) => el.networkId === chain?.id);
    const [inputSelect, setInputSelect] = useState<ListItemType>(filteredList[0]);
    const [input, setInput] = useState("");
    const [modal, setModal] = useState<boolean>(false);
    async function handleEvent(e: ChangeEvent<HTMLInputElement>) {
        setInput(e.target.value);
    }

    useEffect(() => {
        const _filteredList = bridgeSelectList.filter((el) => el.networkId === chain?.id);
        setInputSelect(_filteredList[0]);
    }, [chain?.id])

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
                    <S.ToggleIconWrap>
                        {createElement(BridgeModeToggleIcon)}
                    </S.ToggleIconWrap>
                </S.ToggleIconHolder>
                <S.SubLabel>Transfer To</S.SubLabel>
                <S.ParentWrap>
                    <S.Chain>
                        <S.ChainNameWrap>
                            {createElement(WldChainIcon)}
                            <S.B>
                                Worldland
                            </S.B>
                        </S.ChainNameWrap>
                        <S.B>
                            Balance: <span>0</span>
                        </S.B>
                    </S.Chain>
                </S.ParentWrap>
                <S.Button>
                    Bridge
                </S.Button>
                {modal && <SelectList inputSelect={inputSelect} setInputSelect={setInputSelect} modal={modal} handler={setModal} />}
            </S.Container>
        </Layout>
    )
}

export default Bridge