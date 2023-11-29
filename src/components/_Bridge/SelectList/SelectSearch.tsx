import * as S from './SelectSearch.style';

import { ChangeEventHandler, ForwardedRef, HTMLAttributes, forwardRef } from 'react';

import { SearchIcon } from 'assets';

type SelectSearchProps = {
    value: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
} & HTMLAttributes<HTMLInputElement>;

const SelectSearch = forwardRef(({ value, onChange }: SelectSearchProps, ref: ForwardedRef<HTMLInputElement>) => {
    return (
        <S.Container>
            <SearchIcon />
            <S.Input ref={ref} type="text" placeholder="Search" value={value} onChange={onChange} />
        </S.Container>
    );
});

export default SelectSearch;
