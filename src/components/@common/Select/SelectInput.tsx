import * as S from './SelectInput.style';

import { ChangeEvent, Dispatch, SetStateAction, ForwardedRef, HTMLAttributes, forwardRef, useEffect, useState } from 'react';

import { SelectProps } from './Select';
import { Provider, Type } from 'types/select';
import { useContextType } from 'hooks/useContextType';
import { from_wei, putCommaAtPrice } from 'utils/util';

export type SelectInputProps = {
  type: Type;
  _input?: string;
  _output?: string;
  provider: Provider;
  handleValue?: (e: ChangeEvent<HTMLInputElement>) => void;
} & Partial<SelectProps> &
  HTMLAttributes<HTMLInputElement>;

const SelectInput = forwardRef(({ type, _input, _output, provider, handleValue, ...props }: SelectInputProps, ref: ForwardedRef<HTMLInputElement>) => {
  const { input, output } = useContextType(provider ?? 'Bridge');

  useEffect(() => {
    input.changeSelect({ ...input, value: _input });
  }, [_input]);

  useEffect(() => {
    output.changeSelect({ ...output, value: _output });
  }, [_output]);

  return (
    <S.InputWrapper {...props}>
      <S.Input
        ref={ref}
        pattern="^[0-9]*[.,]?[0.9]*$"
        min="0.0001"
        autoComplete="off"
        placeholder="0.0000"
        type={type}
        readOnly={type === 'output'}
        value={type === 'input' ? _input : putCommaAtPrice(from_wei(_output), 5)}
        onChange={handleValue}
      />
      {type === 'input' && <S.MaxBtn>Max</S.MaxBtn>}
    </S.InputWrapper>
  );
});

export default SelectInput;
