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
    token: 'WETH',
    tokenIcon: ETHTokenIcon,
    network: 'Worldland',
    networkIcon: EthereumIcon,
    networkId: NETWORKS.CHAIN_2,
    address: MAPNETTOADDRESS[CONTRACT_ADDRESSES.WETH_ADDRESS],
  },
  {
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
    token: 'ETH',
    tokenIcon: ETHTokenIcon,
    network: 'Ethereum',
    networkIcon: EthereumIcon,
    networkId: NETWORKS.CHAIN_1,
    address: MAPNETTOADDRESS_CHAIN1[CONTRACT_ADDRESSES.WWLC_ADDRESS],
    funcType: 'lockETH',
    fundType: 'coin',
    balance: '0',
  },
  {
    token: 'WWLC',
    tokenIcon: ETHTokenIcon,
    network: 'Ethereum',
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
  {
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
  networkId: NETWORKS.CHAIN_1,
  address: MAPNETTOADDRESS_CHAIN1[CONTRACT_ADDRESSES.ETH_ADDRESS],
  funcType: 'lockETH',
  fundType: 'coin',
};
