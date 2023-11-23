import { DAIIcon, DAIListIcon, ETHIcon, ETHListIcon, WETHIcon, WETHListIcon } from 'assets';
import { SwapListItemType, BridgeListItemType, SwapSelectType, BridgeSelectType } from 'types/select';
import { CONTRACT_ADDRESSES } from 'utils/enum';
import { MAPNETTOADDRESS } from 'configs/contract_address_config';

export const swapSelectList: SwapListItemType[] = [
  {
    token: 'WETH',
    listIcon: ETHListIcon,
    tokenIcon: ETHIcon,
    address: MAPNETTOADDRESS[CONTRACT_ADDRESSES.WETH_ADDRESS],
  },
  {
    token: 'DAI',
    listIcon: DAIListIcon,
    tokenIcon: DAIIcon,
    address: MAPNETTOADDRESS[CONTRACT_ADDRESSES.DAI_ADDRESS],
  },
];

export const bridgeSelectList: BridgeListItemType[] = [
  // Ethereum
  {
    token: 'ETH',
    tokenIcon: ETHIcon,
    network: 'Ethereum',
    networkIcon: WETHIcon,
    listIcon: ETHIcon,
    address: MAPNETTOADDRESS[CONTRACT_ADDRESSES.WETH_ADDRESS],
  },
  {
    token: 'WWLC',
    tokenIcon: ETHIcon,
    network: 'Ethereum',
    networkIcon: WETHIcon,
    listIcon: WETHListIcon,
    address: MAPNETTOADDRESS[CONTRACT_ADDRESSES.WETH_ADDRESS],
  },
  // Worldland
  {
    token: 'WLC',
    tokenIcon: ETHIcon,
    network: 'Worldland',
    networkIcon: WETHIcon,
    listIcon: ETHIcon,
    address: MAPNETTOADDRESS[CONTRACT_ADDRESSES.WETH_ADDRESS],
  },
  {
    token: 'WETH',
    tokenIcon: ETHIcon,
    network: 'Worldland',
    networkIcon: WETHIcon,
    listIcon: WETHListIcon,
    address: MAPNETTOADDRESS[CONTRACT_ADDRESSES.WETH_ADDRESS],
  },
];

export const initialSwapSelect: SwapSelectType = {
  type: 'input',
  provider: 'Swap',
  listType: 'tokenList',
  token: 'ETH',
  listIcon: ETHListIcon,
  tokenIcon: ETHIcon,
  isOpen: false,
  value: '',
  openHandler: () => {},
  changeSelect: () => {},
  address: MAPNETTOADDRESS[CONTRACT_ADDRESSES.WETH_ADDRESS],
} as const;

export const initialBridgeSelect: BridgeSelectType = {
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
  address: MAPNETTOADDRESS[CONTRACT_ADDRESSES.WETH_ADDRESS],
} as const;
