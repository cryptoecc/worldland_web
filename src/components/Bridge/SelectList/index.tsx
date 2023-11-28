import * as S from './index.style';
import { useNetwork } from 'wagmi';
import { ChangeEvent, useEffect, useState, SetStateAction, Dispatch } from 'react';
import { ListItemType } from "types/select";
import { bridgeSelectListETH } from "constants/select";
import SelectSearch from './SelectSearch';
import SelectListItem from './SelectListItem';

interface SelectListProps {
    modal: boolean;
    handler: Dispatch<SetStateAction<boolean>>;
    tokenList: ListItemType[];
    setInputSelect: (item: ListItemType, index: number) => void;
}

const SelectList = ({ modal, handler, tokenList, setInputSelect }: SelectListProps) => {
    const { chain } = useNetwork();
    const [list, setList] = useState<ListItemType[]>(tokenList);
    const [searchValue, setSearchValue] = useState<string>('');

    function handleSelect(item: ListItemType, index: number) {
        setInputSelect(item, index);
        handler((prev: boolean) => !prev);
    }

    const getItems = (search: string) => {
        if (search === '') return tokenList;
        if (search !== '') {
            const lowerCaseSearch = search.toLowerCase();
            const _filteredList = tokenList.filter(
                (value) =>
                    value.token.toLowerCase().includes(lowerCaseSearch),
            );
            return _filteredList.length > 0 ? _filteredList : tokenList;
        }
    };

    const handleSearchValue = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    useEffect(() => {
        const newList = getItems(searchValue);
        setList(newList ?? tokenList);
    }, [searchValue]);

    return (
        <S.Container modal={modal}>
            <S.Title>Select token to transfer</S.Title>
            <SelectSearch value={searchValue} onChange={handleSearchValue} />
            <S.ItemWrapper>
                {list.map((item, index) => (
                    <SelectListItem
                        key={`item_${index}`}
                        token={item.token}
                        tokenIcon={item.tokenIcon}
                        network={item.network}
                        networkIcon={item.networkIcon}
                        onClick={() => handleSelect(item, index)}
                    />
                ))}
            </S.ItemWrapper>
        </S.Container>
    )
}

export default SelectList


