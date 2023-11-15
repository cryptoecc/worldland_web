import * as S from './SelectList.style';

import { ChangeEvent, useEffect, useState } from 'react';
import { ListItemType, SelectType, Type } from 'types/select';

import SelectListItem from './SelectListItem';
import SelectSearch from './SelectSearch';
import { selectList } from 'constants/select';
import { useSwapContext } from 'contexts/SwapProvider';

interface SelectListProps extends Pick<SelectType, 'listType'> {
  type: Type;
}

const SelectList = ({ type, listType }: SelectListProps) => {
  const { input, output, isOpen, openHandler } = useSwapContext();
  const [searchValue, setSearchValue] = useState<string>('');
  const [list, setList] = useState<ListItemType[]>(selectList);

  const handleSelect = (item: Partial<SelectType>) => {
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
          value.token.toLowerCase().includes(lowerCaseSearch) || value.network.toLowerCase().includes(lowerCaseSearch),
      );
      return filteredList.length > 0 ? filteredList : selectList;
    }
  };

  useEffect(() => {
    const newList = getItems(searchValue);
    setList(newList);
  }, [searchValue]);

  return (
    <S.Container isOpen={isOpen}>
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
  );
};

export default SelectList;
