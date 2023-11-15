import * as S from './SelectInput.style';

import { ChangeEvent, ForwardedRef, HTMLAttributes, forwardRef, useEffect, useState } from 'react';

import { SelectProps } from './Select';
import { Type } from 'types/select';
import { useSwapContext } from 'contexts/SwapProvider';

export type SelectInputProps = {
  type: Type;
} & Partial<SelectProps> &
  HTMLAttributes<HTMLInputElement>;

const SelectInput = forwardRef(({ type, ...props }: SelectInputProps, ref: ForwardedRef<HTMLInputElement>) => {
  const { input, output } = useSwapContext();
  const [value, setValue] = useState<string>('');

  const handleValue = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    input.changeSelect({ ...input, value });
  }, [value]);

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
        value={value}
        onChange={handleValue}
      />
      {type === 'input' && <S.MaxBtn>Max</S.MaxBtn>}
    </S.InputWrapper>
  );
});

export default SelectInput;
