import * as S from './SelectInput.style';

import { ChangeEvent, Dispatch, SetStateAction, ForwardedRef, HTMLAttributes, forwardRef, useEffect, useState } from 'react';

import { SelectProps } from './Select';
import { Provider, Type } from 'types/select';
import { useContextType } from 'hooks/useContextType';

export type SelectInputProps = {
    type: Type;
    _input?: string;
    provider: Provider;
    eventHandler?: (e: ChangeEvent<HTMLInputElement>) => void;
} & Partial<SelectProps> &
    HTMLAttributes<HTMLInputElement>;

const BridgeSelectInput = forwardRef(({ type, _input, provider, eventHandler, ...props }: SelectInputProps, ref: ForwardedRef<HTMLInputElement>) => {
    const { input } = useContextType(provider ?? 'Bridge');

    useEffect(() => {
        input.changeSelect({ ...input, value: _input });
    }, [_input]);

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
                value={_input}
                onChange={eventHandler}
            />
            {type === 'input' && <S.MaxBtn>Max</S.MaxBtn>}
        </S.InputWrapper>
    );
});

export default BridgeSelectInput;
