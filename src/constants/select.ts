import { DAIIcon, DAITokenIcon, ETHTokenIcon, EthereumIcon } from 'assets';
import { ListItemType, SelectType } from 'types/select';

export const selectList: ListItemType[] = [
  {
    token: 'ETH',
    tokenIcon: ETHTokenIcon,
    network: 'Ethereum',
    networkIcon: EthereumIcon,
  },
  {
    token: 'DAI',
    tokenIcon: DAITokenIcon,
    network: 'DAI',
    networkIcon: DAIIcon,
  },
];

export const initialSwapSelect: SelectType = {
  type: 'input',
  listType: 'tokenList',
  token: 'ETH',
  tokenIcon: ETHTokenIcon,
  network: 'Ethereum',
  networkIcon: EthereumIcon,
  isOpen: false,
  value: '',
  openHandler: () => {},
  changeSelect: () => {},
} as const;
