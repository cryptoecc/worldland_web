import { ListItemType, SelectType, FundType } from 'types/select';
import { CONTRACT_ADDRESSES } from 'utils/enum';
import { MAPNETTOADDRESS, MAPNETTOADDRESS_CHAIN1, MAPNETTOADDRESS_CHAIN2 } from 'configs/contract_address_config';
import { DAITokenIcon, DAIIcon, ETHTokenIcon, EthereumIcon, WldChainIcon } from 'assets';
import { NETWORKS } from 'configs/networks';

export const FundTypes: { COIN: FundType; TOKEN: FundType } = {
  COIN: 'coin',
  TOKEN: 'token',
};

export const selectList: ListItemType[] = [
  {
    id: 0,
    token: 'WETH',
    tokenIcon: ETHTokenIcon,
    network: 'Worldland',
    networkIcon: EthereumIcon,
    networkId: NETWORKS.CHAIN_2,
    address: MAPNETTOADDRESS[CONTRACT_ADDRESSES.WETH_ADDRESS],
  },
  {
    id: 1,
    token: 'DAI',
    tokenIcon: DAITokenIcon,
    network: 'Worldland',
    networkIcon: DAIIcon,
    networkId: NETWORKS.CHAIN_2,
    address: MAPNETTOADDRESS[CONTRACT_ADDRESSES.DAI_ADDRESS],
  },
];

// coin / tokens should be passed in a parallel order to both bridgeSelectListETH and bridgeSelectListWLD respectively

export const bridgeSelectListETH: ListItemType[] = [
  {
    id: 0,
    token: 'ETH',
    tokenIcon: ETHTokenIcon,
    network: 'Sepolia',
    networkIcon: EthereumIcon,
    networkId: NETWORKS.CHAIN_1,
    address: MAPNETTOADDRESS_CHAIN1[CONTRACT_ADDRESSES.WWLC_ADDRESS],
    funcType: 'lockETH',
    fundType: 'coin',
    balance: '0',
  },
  {
    id: 1,
    token: 'WWLC',
    tokenIcon: ETHTokenIcon,
    network: 'Sepolia',
    networkIcon: EthereumIcon,
    networkId: NETWORKS.CHAIN_1,
    address: MAPNETTOADDRESS_CHAIN1[CONTRACT_ADDRESSES.WWLC_ADDRESS],
    funcType: 'burnWETH',
    fundType: 'token',
    balance: '0',
  },
];
// coin / tokens should be passed in a parallel order to both bridgeSelectListETH and bridgeSelectListWLD respectively

export const bridgeSelectListWLD: ListItemType[] = [
  {
    id: 1,
    token: 'WLC',
    tokenIcon: WldChainIcon,
    network: 'Worldland',
    networkIcon: WldChainIcon,
    networkId: NETWORKS.CHAIN_2,
    address: MAPNETTOADDRESS_CHAIN2[CONTRACT_ADDRESSES.WETH_ADDRESS],
    funcType: 'lockETH',
    fundType: 'coin',
    balance: '0',
  },
  {
    id: 0,
    token: 'WETH',
    tokenIcon: WldChainIcon,
    network: 'Worldland',
    networkIcon: WldChainIcon,
    networkId: NETWORKS.CHAIN_2,
    address: MAPNETTOADDRESS_CHAIN2[CONTRACT_ADDRESSES.WETH_ADDRESS],
    funcType: 'burnWETH',
    fundType: 'token',
    balance: '0',
  },
];

export const initialSwapSelect: SelectType = {
  id: 0,
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
  id: 0,
  token: 'ETH',
  tokenIcon: ETHTokenIcon,
  network: 'Sepolia',
  networkIcon: EthereumIcon,
  networkId: NETWORKS.CHAIN_1,
  address: MAPNETTOADDRESS_CHAIN1[CONTRACT_ADDRESSES.ETH_ADDRESS],
  funcType: 'lockETH',
  fundType: 'coin',
};
