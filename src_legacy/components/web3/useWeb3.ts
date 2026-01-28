import Web3 from 'web3';

// const infuraurl = 'https://gwangju.worldland.foundation/';
const infuraurl = 'https://seoul.worldland.foundation/';
const sepolia = 'https://sepolia.infura.io/v3/b9b632f9e59c480fb0f81e446afdfb85';
// const infuraurl = 'https://rpc.lvscan.io';
const provider = new Web3.providers.HttpProvider(infuraurl);
const web3 = new Web3(provider);

export { web3 };
