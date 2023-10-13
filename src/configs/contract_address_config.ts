import { SEPOLIA_ADDRESSES, WLD_ADDRESSES } from './contract_addresses';
import { nettype } from './nettype';

let NETTYPES = {
  testnet: SEPOLIA_ADDRESSES,
  mainnet: WLD_ADDRESSES,
};

export const MAPNETTOADDRESS = NETTYPES[nettype];
