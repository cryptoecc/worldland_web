import * as S from './Bridge.style';

import Select, { SelectProps } from '../@common/Select/Select';

import { Fragment } from 'react';
import SelectInput from '../@common/Select/SelectInput';
import { useBridgeContext } from 'contexts/BridgeProvider';

const Bridge = ({ type, text, provider }: Pick<SelectProps, 'type' | 'text' | 'provider'>) => {
  const { input, output } = useBridgeContext();

  return (
    <S.Layout>
      <Select type={type} text={text} listType="tokenList" borderRadius="0.75rem 0 0 0.75rem">
        <SelectInput type={type} provider={provider ?? 'Bridge'} />
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
