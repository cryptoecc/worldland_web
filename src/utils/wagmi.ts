import { Chain } from 'wagmi';

export const worldland = {
  id: 103,
  name: 'Worldland',
  network: 'worldland',
  nativeCurrency: {
    decimals: 18,
    name: 'WLC',
    symbol: 'WLC',
  },
  rpcUrls: {
    public: { http: ['https://seoul.worldland.foundation/'] },
    default: { http: ['https://seoul.worldland.foundation/'] },
  },
  blockExplorers: {
    etherscan: { name: 'WLscan', url: 'http://scan.worldland.foundation' },
    default: { name: 'WLscan', url: 'http://scan.worldland.foundation' },
  },
} as const satisfies Chain;

export const worldland_testnet = {
  id: 10395,
  name: 'Worldland Testnet',
  network: 'worldland_testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'WLC',
    symbol: 'WLC',
  },
  rpcUrls: {
    public: { http: ['https://gwangju.worldland.foundation/'] },
    default: { http: ['https://gwangju.worldland.foundation/'] },
  },
  blockExplorers: {
    etherscan: { name: 'WLscan', url: 'http://testscan.worldland.foundation' },
    default: { name: 'WLscan', url: 'http://testscan.worldland.foundation' },
  },
} as const satisfies Chain;

export const chainImages = {
  103: 'https://lv-storage1.s3.amazonaws.com/logo_2.svg',
};
