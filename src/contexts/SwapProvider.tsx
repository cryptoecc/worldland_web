import { PropsWithChildren, createContext, useCallback, useContext, useEffect, useState } from 'react';
import { SwapSelectType, Type } from 'types/select';
import { initialSwapSelect, swapSelectList } from 'constants/select';

import SelectList from 'components/@common/Select/SelectList';

interface SwapContextType extends Pick<SwapSelectType, 'isOpen' | 'openHandler'> {
  input: SwapSelectType;
  output: SwapSelectType;
}

export const SwapContext = createContext<SwapContextType>({
  input: initialSwapSelect,
  output: initialSwapSelect,
  isOpen: false,
  openHandler: () => { },
});

const SwapProvider = ({ children }: PropsWithChildren) => {
  const [inputSelect, setInputSelect] = useState<SwapSelectType>(initialSwapSelect);
  const [outputSelect, setOutputSelect] = useState<SwapSelectType>({
    ...initialSwapSelect,
    type: 'output',
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [type, setType] = useState<Type | null>(null);

  const changeSelect = useCallback(
    (selectItem: Partial<SwapSelectType>) => {
      if (selectItem === null) return;
      if (selectItem.type === 'input') return setInputSelect({ ...inputSelect, ...selectItem });
      if (selectItem.type === 'output') return setOutputSelect({ ...outputSelect, ...selectItem });
    },
    [inputSelect, setInputSelect, outputSelect, setOutputSelect],
  );

  const openHandler = useCallback(
    (activeType: Type) => {
      if (activeType === null) return;
      setType(activeType);
      setIsOpen(!isOpen);
      console.log('openHandler', 'isOpen');
    },
    [isOpen, setIsOpen, setType],
  );

  useEffect(() => {
    if (type !== null) return changeSelect({ type, isOpen });
  }, [type, isOpen]);

  return (
    <SwapContext.Provider
      value={{
        input: { ...inputSelect, changeSelect },
        output: { ...outputSelect, changeSelect },
        isOpen,
        openHandler,
      }}
    >
      {children}
      {isOpen && <SelectList type={type ?? 'input'} selectList={swapSelectList} provider="Swap" />}
    </SwapContext.Provider>
  );
};

export default SwapProvider;

export const useSwapContext = () => {
  const context = useContext(SwapContext);

  if (context === null) {
    throw new Error('SwapProvider error');
  }

  return context;
};
