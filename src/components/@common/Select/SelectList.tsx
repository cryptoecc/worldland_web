import * as S from './SelectList.style';

import { ChangeEvent, useEffect, useState } from 'react';
import { BridgeListItemType, Provider, BridgeSelectType, Type } from 'types/select';

import SelectSearch from './SelectSearch';
import { useContextType } from 'hooks/useContextType';
import SwapSelectListItems from './SwapSelectListItems';
import BridgeSelectListItems from './BridgeSelectListItems';

interface SelectListProps {
  type: Type;
  selectList: BridgeListItemType[];
  provider?: Provider;
}

const SelectList = ({ type, selectList, provider }: SelectListProps) => {
  const { input, output, isOpen, openHandler } = useContextType(provider ?? 'Bridge');
  const [searchValue, setSearchValue] = useState<string>('');
  const [list, setList] = useState<BridgeListItemType[]>(selectList);

  const handleSelect = (item: Partial<BridgeSelectType>) => {
    if (type === 'input') {
      input.changeSelect({ ...input, ...item });
    }
    if (type === 'output') {
      output.changeSelect({ ...output, ...item });
    }
    openHandler(type);
  };

  const handleSearchValue = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const getItems = (search: string) => {
    if (search === '') return selectList;
    if (search !== '') {
      const lowerCaseSearch = search.toLowerCase();
      const filteredList = selectList.filter(
        (value) =>
          value.token.toLowerCase().includes(lowerCaseSearch),
      );
      return filteredList.length > 0 ? filteredList : selectList;
    }
  };

  useEffect(() => {
    const newSearchList = getItems(searchValue);
    setList(newSearchList ?? selectList);
  }, [searchValue]);

  return (
    <S.Container isOpen={isOpen}>
      <S.Title>Select token to transfer</S.Title>
      <SelectSearch value={searchValue} onChange={handleSearchValue} />
      <S.ItemWrapper>
        {list.map((item, index) => {
          return provider === "Swap" ? (
            <SwapSelectListItems
              key={`item_${index}`}
              token={item.token}
              tokenIcon={item.tokenIcon}
              listIcon={item.listIcon}
              onClick={() => handleSelect(item)}
            />) : (
            <BridgeSelectListItems
              key={`item_${index}`}
              token={item.token}
              tokenIcon={item.tokenIcon}
              network={item.network}
              networkIcon={item.networkIcon}
              listIcon={item.listIcon}
              onClick={() => handleSelect(item)}
            />)
        })}
      </S.ItemWrapper>
    </S.Container>
  );
};

export default SelectList;
