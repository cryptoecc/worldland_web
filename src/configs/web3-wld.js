import { url } from './network_urls';
import { nettype } from './nettype';
const Web3 = require('web3');
const dynamic_urls = {
  testnet: url['testnet_chain_2'],
  mainnet: url['mainnet_chain_2'],
};
const web3 = new Web3(new Web3.providers.HttpProvider(dynamic_urls[nettype]));

export { web3 as web3_wld };
