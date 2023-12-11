import { DAITokenIcon, DAIIcon, ETHTokenIcon, EthereumIcon } from 'assets';

export type Type = 'input' | 'output';

export type SelectListType = 'tokenList' | 'networkList';

type Token = 'ETH' | 'wETH' | 'USDC' | 'WLC' | 'wWLC' | 'DAI';

type TokenIcon = typeof DAITokenIcon | typeof ETHTokenIcon;

type Network = 'Ethereum' | 'Worldland' | 'Sepolia';

type NetworkIcon = typeof DAIIcon | typeof EthereumIcon;

type FunctionType = 'lockETH' | 'burnWETH' | 'lockToken' | 'burnToken';

export type FundType = 'coin' | 'token';

export interface SelectType {
  id: number;
  type: Type;
  listType: SelectListType;
  token: Token;
  tokenIcon: TokenIcon;
  address: `0x${string}`;
  network: Network;
  networkIcon: NetworkIcon;
  value?: string;
  isOpen: boolean;
  openHandler: (activeType: Type) => void;
  changeSelect: (select: SelectType, listType?: SelectListType) => void;
}

export interface ListItemType {
  id: number;
  token: Token;
  tokenIcon: TokenIcon;
  network: Network;
  networkIcon: NetworkIcon;
  networkId?: number;
  address: `0x${string}`;
  funcType?: FunctionType;
  balance?: string;
  fundType?: FundType;
}
