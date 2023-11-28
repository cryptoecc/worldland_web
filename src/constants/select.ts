import { ListItemType, SelectType } from 'types/select';
import { CONTRACT_ADDRESSES } from 'utils/enum';
import { MAPNETTOADDRESS } from 'configs/contract_address_config';
import { DAITokenIcon, DAIIcon, ETHTokenIcon, EthereumIcon, WldChainIcon } from 'assets';

export const selectList: ListItemType[] = [
  {
    token: 'WETH',
    tokenIcon: ETHTokenIcon,
    network: 'Worldland',
    networkIcon: EthereumIcon,
    networkId: 103,
    address: MAPNETTOADDRESS[CONTRACT_ADDRESSES.WETH_ADDRESS],
  },
  {
    token: 'DAI',
    tokenIcon: DAITokenIcon,
    network: 'Worldland',
    networkIcon: DAIIcon,
    networkId: 103,
    address: MAPNETTOADDRESS[CONTRACT_ADDRESSES.DAI_ADDRESS],
  },
];

export const bridgeSelectListETH: ListItemType[] = [
  {
    token: 'ETH',
    tokenIcon: ETHTokenIcon,
    network: 'Ethereum',
    networkIcon: EthereumIcon,
    networkId: 1,
    address: MAPNETTOADDRESS[CONTRACT_ADDRESSES.WWLC_ADDRESS],
    funcType: 'lockETH',
    balance: '0',
  },
  {
    token: 'WWLC',
    tokenIcon: ETHTokenIcon,
    network: 'Ethereum',
    networkIcon: EthereumIcon,
    networkId: 1,
    address: MAPNETTOADDRESS[CONTRACT_ADDRESSES.WWLC_ADDRESS],
    funcType: 'burnWETH',
    balance: '0',
  },
];
export const bridgeSelectListWLD: ListItemType[] = [
  {
    token: 'WLC',
    tokenIcon: WldChainIcon,
    network: 'Worldland',
    networkIcon: WldChainIcon,
    networkId: 103,
    address: MAPNETTOADDRESS[CONTRACT_ADDRESSES.WETH_ADDRESS],
    funcType: 'lockETH',
    balance: '0',
  },
  {
    token: 'WETH',
    tokenIcon: WldChainIcon,
    network: 'Worldland',
    networkIcon: WldChainIcon,
    networkId: 103,
    address: MAPNETTOADDRESS[CONTRACT_ADDRESSES.WETH_ADDRESS],
    funcType: 'burnWETH',
    balance: '0',
  },
];

export const initialSwapSelect: SelectType = {
  type: 'input',
  listType: 'tokenList',
  token: 'WETH',
  tokenIcon: ETHTokenIcon,
  network: 'Ethereum',
  networkIcon: EthereumIcon,
  address: MAPNETTOADDRESS[CONTRACT_ADDRESSES.WETH_ADDRESS],
  isOpen: false,
  value: '',
  openHandler: () => {},
  changeSelect: () => {},
} as const;

export const initialBridgeSelect: ListItemType = {
  token: 'ETH',
  tokenIcon: ETHTokenIcon,
  network: 'Ethereum',
  networkIcon: EthereumIcon,
  networkId: 1,
  address: MAPNETTOADDRESS[CONTRACT_ADDRESSES.ETH_ADDRESS],
};
