import { PropsWithChildren, createContext, useCallback, useContext, useEffect, useState } from 'react';
import { SelectType, Type } from 'types/select';

import SelectList from 'components/@common/Select/SelectList';
import { initialSwapSelect } from 'constants/select';

interface SwapContextType extends Pick<SelectType, 'isOpen' | 'openHandler'> {
  input: SelectType;
  output: SelectType;
}

export const SwapContext = createContext<SwapContextType>({
  input: initialSwapSelect,
  output: initialSwapSelect,
  isOpen: false,
  openHandler: () => { },
});

const SwapProvider = ({ children }: PropsWithChildren) => {
  const [inputSelect, setInputSelect] = useState<SelectType>(initialSwapSelect);
  const [outputSelect, setOutputSelect] = useState<SelectType>({
    ...initialSwapSelect,
    type: 'output',
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [type, setType] = useState<Type | null>(null);

  const changeSelect = useCallback(
    (selectItem: Partial<SelectType>) => {
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
      {isOpen && <SelectList type={type ?? 'input'} listType="tokenList" />}
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
