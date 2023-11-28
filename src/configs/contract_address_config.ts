import { SEPOLIA_ADDRESSES, WLD_ADDRESSES } from './contract_addresses';
import { nettype } from './nettype';

type NETWORKTOCHAIN = {
  [key: number]: ADDRESS_TYPE;
};

const NETTYPES = {
  testnet: SEPOLIA_ADDRESSES,
  mainnet: WLD_ADDRESSES,
};

export const MAPNETTOADDRESS = NETTYPES[nettype];

export const MAPNETWORKTOCHAINID: NETWORKTOCHAIN = {
  1: SEPOLIA_ADDRESSES,
  103: WLD_ADDRESSES,
};
