import { url } from './network_urls';
import { nettype } from './nettype';
const { Web3 } = require('web3');

const dynamic_urls = {
  testnet: url['worldland-gwangju'],
  mainnet: url['sepolia-testnet'],
};
const web3 = new Web3(new Web3.providers.HttpProvider(dynamic_urls[nettype]));

export { web3 as web3_eth };
