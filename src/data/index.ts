import eth_logo from 'assets/static/coin-logo/eth-logo.png';
import aave_logo from 'assets/static/coin-logo/aave-logo.png';
import dai_logo from 'assets/static/coin-logo/dai-logo.png';
import usdc_logo from 'assets/static/coin-logo/usdc-logo.png';
import wETH_logo from 'assets/static/coin-logo/wETH-logo.png';
// token address import
import { SEPOLIA_ADDRESSES } from 'configs/contract_addresses';
import { CONTRACT_ADDRESSES } from 'utils/enum';

export const crypto_list = [
  {
    symbol: 'ETH',
    title: 'ETHER',
    icon: eth_logo,
    amount: '0',
    address: SEPOLIA_ADDRESSES[CONTRACT_ADDRESSES.TOKENA],
  },
  {
    symbol: 'DAI',
    title: 'Dai',
    icon: dai_logo,
    amount: '0',
    address: SEPOLIA_ADDRESSES[CONTRACT_ADDRESSES.TOKENB],
  },
  // {
  //   symbol: 'WETH',
  //   title: 'Wrapped Ether',
  //   icon: wETH_logo,
  // },
  // {
  //   symbol: 'AAVE',
  //   title: 'Aave',
  //   icon: aave_logo,
  // },
  // {
  //   symbol: 'USDC',
  //   title: 'USDC',
  //   icon: usdc_logo,
  // },
  // {
  //   symbol: 'DAI',
  //   title: 'Dai',
  //   icon: dai_logo,
  // },
  // {
  //   symbol: 'USDC',
  //   title: 'USDC',1
  //   icon: usdc_logo,
  // },
];

export const mapMessageToObject: any = {
  0: 'Enter an amount',
  1: (token: TokenProps) => `Insufficient ${token.symbol} balance`,
  2: 'Approve',
  3: 'Add liquidity',
};
