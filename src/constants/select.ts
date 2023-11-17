import { DAIIcon, DAIListIcon, ETHIcon, ETHListIcon, WETHIcon } from 'assets';
import { ListItemType, SelectType } from 'types/select';

export const swapSelectList: ListItemType[] = [
  {
    token: 'ETH',
    listIcon: ETHListIcon,
    network: 'Ethereum',
    tokenIcon: ETHIcon,
  },
  {
    token: 'DAI',
    listIcon: DAIListIcon,
    network: 'DAI',
    tokenIcon: DAIIcon,
  },
];

export const bridgeSelectList: ListItemType[] = [
  {
    token: 'ETH',
    tokenIcon: ETHIcon,
    network: 'Ethereum',
    networkIcon: ETHIcon,
    listIcon: ETHListIcon,
  },
  {
    token: 'WETH',
    tokenIcon: ETHIcon,
    network: 'Worldland',
    networkIcon: WETHIcon,
    listIcon: DAIListIcon,
  },
];

export const initialSwapSelect: SelectType = {
  type: 'input',
  provider: 'Swap',
  listType: 'tokenList',
  token: 'ETH',
  listIcon: ETHListIcon,
  network: 'Ethereum',
  tokenIcon: ETHIcon,
  isOpen: false,
  value: '',
  openHandler: () => {},
  changeSelect: () => {},
} as const;

export const initialBridgeSelect: SelectType = {
  type: 'input',
  provider: 'Bridge',
  listType: 'tokenList',
  token: 'ETH',
  tokenIcon: ETHIcon,
  network: 'Ethereum',
  networkIcon: ETHIcon,
  listIcon: ETHListIcon,
  isOpen: false,
  value: '',
  openHandler: () => {},
  changeSelect: () => {},
} as const;
