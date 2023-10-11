import { SEPOLIA_ADDRESSES, WLD_ADDRESSES } from './contract_addresses';
import { nettype } from './nettype';

let nettypes = {
  testnet: SEPOLIA_ADDRESSES,
  mainnet: WLD_ADDRESSES,
};

export const mapNetToAddress = nettypes[nettype];
