import * as S from './Bridge.style';

import Select, { SelectProps } from '../@common/Select/Select';

import { Fragment } from 'react';
import SelectInput from '../@common/Select/SelectInput';

const Bridge = ({ type, text }: Pick<SelectProps, 'type' | 'text'>) => {
  return (
    <S.Layout>
      <Select type={type} text={text} listType="tokenList" borderRadius="0.75rem 0 0 0.75rem">
        <SelectInput type={type} />
      </Select>
      <Select
        type={type}
        text="Network"
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
