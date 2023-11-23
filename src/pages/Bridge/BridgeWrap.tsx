import * as S from './index.style';
import { useState, ChangeEvent } from "react"
import Bridge from 'components/bridge/Bridge';
import { useBridgeContext } from 'contexts/BridgeProvider';
import { testInput } from 'utils/util';

const BridgeWrap = () => {
    const { input, output } = useBridgeContext();
    const [_input, setInput] = useState<string>("");

    function inputHandler(e: ChangeEvent<HTMLInputElement>) {
        let typedValue = e.target.value;
        if (testInput(typedValue) || typedValue === '') {
            setInput(typedValue);
        }
    }
    return (
        <S.BridgeWrapper>
            <Bridge type="input" input={_input} text="From" eventHandler={inputHandler} />
            <Bridge type="output" text="To" />
        </S.BridgeWrapper>
    )
}

export default BridgeWrap