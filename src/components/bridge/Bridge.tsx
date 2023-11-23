import * as S from './Bridge.style';

import Select, { SelectProps } from '../@common/Select/Select';

import { Fragment } from 'react';
import BridgeSelectInput from '../@common/Select/BridgeSelectInput';

const Bridge = ({ type, text, input, provider, eventHandler }: Pick<SelectProps, 'type' | 'text' | 'provider' | 'input' | 'eventHandler'>) => {

  return (
    <S.Layout>
      <Select type={type} text={text} listType="tokenList" borderRadius="0.75rem 0 0 0.75rem">
        <BridgeSelectInput _input={input} type={type} eventHandler={eventHandler} provider={provider ?? 'Bridge'} />
      </Select>
      <Select
        type={type}
        text="Network"
        provider={provider}
        listType="networkList"
        maxWidth="8.5625rem"
        borderRadius=" 0 0.75rem 0.75rem 0"
      >
        <Fragment />
      </Select>
    </S.Layout>
  );
};

export default Bridge;
