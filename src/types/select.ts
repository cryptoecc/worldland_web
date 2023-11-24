import { DAIIcon, DAIListIcon, ETHIcon, ETHListIcon, WETHIcon, WETHListIcon } from 'assets';

export type Type = 'input' | 'output';

export type Provider = 'Swap' | 'Bridge';

export type SelectListType = 'tokenList' | 'networkList';

type Token = 'ETH' | 'WETH' | 'WLC' | 'WWLC' | 'USDC' | 'DAI';

type TokenIcon = typeof ETHIcon | typeof DAIIcon | typeof WETHIcon;

type Network = 'Ethereum' | 'Worldland';

type NetworkIcon = typeof ETHIcon | typeof WETHIcon;

export interface SwapSelectType {
  type: Type;
  listType: SelectListType;
  token: Token;
  tokenIcon: TokenIcon;
  address: `0x${string}`;
  value?: string;
  isOpen: boolean;
  openHandler: (activeType: Type) => void;
  changeSelect: (select: SwapSelectType, listType?: SelectListType) => void;
}
export interface BridgeSelectType {
  type: Type;
  listType: SelectListType;
  token: Token;
  tokenIcon: TokenIcon;
  address: `0x${string}`;
  network?: Network;
  networkIcon?: NetworkIcon;
  value?: string;
  isOpen: boolean;
  openHandler: (activeType: Type) => void;
  changeSelect: (select: BridgeSelectType, listType?: SelectListType) => void;
}

type ListIcon = typeof ETHListIcon | typeof DAIListIcon | typeof WETHListIcon;

export interface SwapListItemType {
  token: Token;
  tokenIcon: TokenIcon;
  address: `0x${string}`;
  listIcon: ListIcon;
}
export interface BridgeListItemType {
  token: Token;
  tokenIcon: TokenIcon;
  network?: Network;
  networkIcon?: NetworkIcon;
  address: `0x${string}`;
  listIcon: ListIcon;
}

export interface SwapSelectType extends SwapListItemType {
  type: Type;
  provider: Provider;
  listType: SelectListType;
  value?: string;
  isOpen: boolean;
  openHandler: (activeType: Type) => void;
  changeSelect: (select: SwapSelectType, listType?: SelectListType) => void;
}
export interface BridgeSelectType extends BridgeListItemType {
  type: Type;
  provider: Provider;
  listType: SelectListType;
  value?: string;
  isOpen: boolean;
  openHandler: (activeType: Type) => void;
  changeSelect: (select: BridgeSelectType, listType?: SelectListType) => void;
}
