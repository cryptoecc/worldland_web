import * as S from './index.style';
import { useNetwork } from 'wagmi';
import { ChangeEvent, useEffect, useState, SetStateAction, Dispatch } from 'react';
import { ListItemType } from "types/select";
import { bridgeSelectList } from "constants/select";
import SelectSearch from './SelectSearch';
import SelectListItem from './SelectListItem';

interface SelectListProps {
    modal: boolean;
    handler: Dispatch<SetStateAction<boolean>>;
    inputSelect: ListItemType;
    setInputSelect: Dispatch<SetStateAction<ListItemType>>
}

const SelectList = ({ modal, handler, inputSelect, setInputSelect }: SelectListProps) => {
    const { chain } = useNetwork();
    const filteredList = bridgeSelectList.filter((el) => el.networkId === chain?.id);
    const [list, setList] = useState<ListItemType[]>(filteredList);
    const [searchValue, setSearchValue] = useState<string>('');

    function handleSelect(item: ListItemType) {
        setInputSelect(item);
        handler((prev: boolean) => !prev);
    }

    const getItems = (search: string) => {
        if (search === '') return filteredList;
        if (search !== '') {
            const lowerCaseSearch = search.toLowerCase();
            const _filteredList = filteredList.filter(
                (value) =>
                    value.token.toLowerCase().includes(lowerCaseSearch) || value.network.toLowerCase().includes(lowerCaseSearch),
            );
            return _filteredList.length > 0 ? _filteredList : filteredList;
        }
    };

    const handleSearchValue = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    useEffect(() => {
        const newList = getItems(searchValue);
        setList(newList ?? filteredList);
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
                        onClick={() => handleSelect(item)}
                    />
                ))}
            </S.ItemWrapper>
        </S.Container>
    )
}

export default SelectList


