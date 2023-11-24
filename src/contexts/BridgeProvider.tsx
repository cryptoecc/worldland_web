import { PropsWithChildren, createContext, useCallback, useContext, useEffect, useState } from 'react';
import { BridgeSelectType, Type } from 'types/select';
import { bridgeSelectList, initialBridgeSelect } from 'constants/select';

import SelectList from 'components/@common/Select/SelectList';
import { WETHIcon } from 'assets';

interface BridgeContextType extends Pick<BridgeSelectType, 'isOpen' | 'openHandler'> {
  input: BridgeSelectType;
  output: BridgeSelectType;
}

const BridgeContext = createContext<BridgeContextType>({
  input: initialBridgeSelect,
  output: initialBridgeSelect,
  isOpen: false,
  openHandler: () => { },
});

const BridgeProvider = ({ children }: PropsWithChildren) => {
  const [inputSelect, setInputSelect] = useState<BridgeSelectType>(initialBridgeSelect);
  const [outputSelect, setOutputSelect] = useState<BridgeSelectType>({
    ...initialBridgeSelect,
    type: 'output',
    token: 'WETH',
    network: 'Worldland',
    networkIcon: WETHIcon,
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [type, setType] = useState<Type | null>(null);

  const changeSelect = useCallback(
    (selectItem: Partial<BridgeSelectType>) => {
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
    },
    [isOpen, setIsOpen, setType],
  );

  useEffect(() => {
    if (type !== null) return changeSelect({ type, isOpen });
  }, [type, isOpen]);

  return (
    <BridgeContext.Provider
      value={{
        input: { ...inputSelect, changeSelect },
        output: { ...outputSelect, changeSelect },
        isOpen,
        openHandler,
      }}
    >
      {children}
      {isOpen && <SelectList type={type ?? 'input'} selectList={bridgeSelectList} />}
    </BridgeContext.Provider>
  );
};

export default BridgeProvider;

export const useBridgeContext = () => {
  const context = useContext(BridgeContext);

  if (context === null) {
    throw new Error('BridgeProvider error');
  }

  return context;
};
