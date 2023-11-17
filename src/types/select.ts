import { DAIIcon, DAIListIcon, ETHIcon, ETHListIcon, WETHIcon, WETHListIcon } from 'assets';

export type Type = 'input' | 'output';

export type Provider = 'Swap' | 'Bridge';

export type SelectListType = 'tokenList' | 'networkList';

type Token = 'ETH' | 'DAI' | 'WETH';

type TokenIcon = typeof ETHIcon | typeof DAIIcon | typeof WETHIcon;

type Network = 'Ethereum' | 'DAI' | 'Worldland';

type ListIcon = typeof ETHListIcon | typeof DAIListIcon | typeof WETHListIcon;

export interface ListItemType {
  token: Token;
  tokenIcon: TokenIcon;
  network: Network;
  networkIcon?: TokenIcon;
  listIcon: ListIcon;
}

export interface SelectType extends ListItemType {
  type: Type;
  provider: Provider;
  listType: SelectListType;
  value?: string;
  isOpen: boolean;
  openHandler: (activeType: Type) => void;
  changeSelect: (select: SelectType, listType?: SelectListType) => void;
}
