import { ListItemType, SelectType } from 'types/select';
import { CONTRACT_ADDRESSES } from 'utils/enum';
import { MAPNETTOADDRESS } from 'configs/contract_address_config';
import { DAITokenIcon, DAIIcon, ETHTokenIcon, EthereumIcon } from 'assets';

export const selectList: ListItemType[] = [
  {
    token: 'WETH',
    tokenIcon: ETHTokenIcon,
    network: 'Wrapped ETH',
    networkIcon: EthereumIcon,
    address: MAPNETTOADDRESS[CONTRACT_ADDRESSES.WETH_ADDRESS],
  },
  {
    token: 'DAI',
    tokenIcon: DAITokenIcon,
    network: 'DAI',
    networkIcon: DAIIcon,
    address: MAPNETTOADDRESS[CONTRACT_ADDRESSES.DAI_ADDRESS],
  },
];

export const initialSwapSelect: SelectType = {
  type: 'input',
  listType: 'tokenList',
  token: 'WETH',
  tokenIcon: ETHTokenIcon,
  network: 'Wrapped ETH',
  networkIcon: EthereumIcon,
  address: MAPNETTOADDRESS[CONTRACT_ADDRESSES.WETH_ADDRESS],
  isOpen: false,
  value: '',
  openHandler: () => {},
  changeSelect: () => {},
} as const;
