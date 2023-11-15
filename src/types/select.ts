import { DAIIcon, DAITokenIcon, ETHTokenIcon, EthereumIcon } from 'assets';

export type Type = 'input' | 'output';

export type SelectListType = 'tokenList' | 'networkList';

type Token = 'ETH' | 'DAI';

type TokenIcon = typeof ETHTokenIcon | typeof DAITokenIcon;

type Network = 'Ethereum' | 'DAI';

type NetworkIcon = typeof EthereumIcon | typeof DAIIcon;

export interface SelectType {
  type: Type;
  listType: SelectListType;
  token: Token;
  tokenIcon: TokenIcon;
  network: Network;
  networkIcon: NetworkIcon;
  value?: string;
  isOpen: boolean;
  openHandler: (activeType: Type) => void;
  changeSelect: (select: SelectType, listType?: SelectListType) => void;
}

export interface ListItemType {
  token: Token;
  tokenIcon: TokenIcon;
  network: Network;
  networkIcon: NetworkIcon;
}
