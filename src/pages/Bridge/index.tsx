import * as S from "./style/index.style"
import Layout from 'components/@common/Layout/Layout';
import { useState, ChangeEvent, createElement } from "react";
import { WldChainIcon } from "assets/static/chain-assets/WldChainIcon";
import { EthChainIcon, } from "assets/static/chain-assets/EthChainIcon";
import { EthTokenIcon, } from "assets/static/token-assets/EthTokenIcon";
import { DownArrowIcon } from "assets";
import BridgeModeToggleIcon from "assets/static/chain-assets/BridgeModeToggleIcon";



const Bridge = () => {
    const [input, setInput] = useState("");
    async function handleEvent(e: ChangeEvent<HTMLInputElement>) {
        setInput(e.target.value);
    }

    return (
        <Layout>
            <S.Container>
                <S.Label>Bridge</S.Label>
                <S.SubLabel>Transfer From</S.SubLabel>
                <S.ParentWrap>
                    <S.Chain>
                        <S.ChainNameWrap>
                            {createElement(EthChainIcon)}
                            <S.B>
                                Ethereum
                            </S.B>
                        </S.ChainNameWrap>
                        <S.B>
                            Balance: <span>0</span>
                        </S.B>
                    </S.Chain>
                    <S.InputWrapper>
                        <S.TokenWrap>
                            <S.SubTokenWrap>
                                {createElement(EthTokenIcon)}
                                <S.B>
                                    ETH
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
            </S.Container>
        </Layout>
    )
}

export default Bridge