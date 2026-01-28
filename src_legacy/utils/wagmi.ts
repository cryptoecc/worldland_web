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
    etherscan: { name: 'WLscan', url: 'https://scan.worldland.foundation' },
    default: { name: 'WLscan', url: 'https://scan.worldland.foundation' },
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

export const sepolia_custom = {
  id: 11155111,
  name: 'sepolia-custom',
  network: 'sepolia-custom',
  nativeCurrency: {
    decimals: 18,
    name: 'Sepolia ETH',
    symbol: 'Sepolia ETH',
  },
  rpcUrls: {
    public: { http: ['https://sepolia.infura.io/v3/ef552e15a99640269292b3ec67869520'] },
    default: { http: ['https://sepolia.infura.io/v3/ef552e15a99640269292b3ec67869520'] },
  },
  blockExplorers: {
    etherscan: { name: 'SepoliaTestnet', url: 'https://sepolia.etherscan.io/' },
    default: { name: 'SepoliaTestnet', url: 'https://sepolia.etherscan.io/' },
  },
} as const satisfies Chain;

export const local_1 = {
  id: 1337,
  name: 'local_1',
  network: 'local_1',
  nativeCurrency: {
    decimals: 18,
    name: 'ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: { http: ['http://localhost:8545'] },
    default: { http: ['http://localhost:8545'] },
  },
  blockExplorers: {
    etherscan: { name: 'LocalTestnet', url: 'https://sepolia.etherscan.io/' },
    default: { name: 'LocalTestnet', url: 'https://sepolia.etherscan.io/' },
  },
} as const satisfies Chain;

export const local_2 = {
  id: 31337,
  name: 'local_2',
  network: 'local_2',
  nativeCurrency: {
    decimals: 18,
    name: 'ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: { http: ['http://localhost:8546'] },
    default: { http: ['http://localhost:8546'] },
  },
  blockExplorers: {
    etherscan: { name: 'LocalTestnet', url: 'https://sepolia.etherscan.io/' },
    default: { name: 'LocalTestnet', url: 'https://sepolia.etherscan.io/' },
  },
} as const satisfies Chain;

export const chainImages = {
  103: 'https://lv-storage1.s3.amazonaws.com/logo_2.svg',
};

export const gasLimit = BigInt(3000000);
