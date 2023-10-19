import { web3_eth } from './web3-eth';
import { web3_wld } from './web3-wld';
import { MAP_STR_ABI } from './abis';

const chains = {
  1: web3_eth,
  2: web3_wld,
};

export const chain_query = async (jargs) => {
  let { chain, contract_address, abikind, methodname, f_args } = jargs;
  contract_address = contract_address.toLowerCase();
  const contract = new chains[chain].eth.Contract(MAP_STR_ABI[abikind], contract_address);
  console.log({ contract });
  console.log({ jargs });
  // return new Promise(async (resolve, reject) => {
  //   await contract.methods[methodname](...f_args)
  //     .call((err, resp) => {
  //       if (err) {
  //         resolve(null);
  //         return;
  //       }
  //       resolve(resp);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       resolve(null);
  //     });
  // });
  let result = await contract.methods[methodname](...f_args).call();
  console.log(result);
  return result;
};

export const getabist_forfunction = async (jargs) => {
  try {
    let { chain, contract_address, abikind, methodname, f_args } = jargs;
    contract_address = contract_address.toLowerCase();
    const contract = new chains[chain].eth.Contract(MAP_STR_ABI[abikind], contract_address);
    let _contract;
    if (f_args.length > 0) {
      _contract = contract.methods[methodname](...f_args);
    } else {
      _contract = contract.methods[methodname]();
    }
    return _contract.encodeABI();
  } catch (err) {
    console.log(err);
  }
};

//...f_args
export const send_transaction = async (jdata) => {
  let { privateKey, chain, from, to, data, value, gas } = jdata;
  console.log({ jdata });
  let txObject = {
    from, // wallet_address
    to, // contract_address
    data, // abi
    value: value || '0x00', // "0x00" // value that is sent to a contract (ex: if you call a payable function need to specify pay amount here)
    gas: gas || '250000',
  };
  const signedTx = await chains[chain].eth.accounts.signTransaction(txObject, privateKey);
  let resp = await chains[chain].eth.sendSignedTransaction(signedTx.rawTransaction).catch((err) => {
    console.log(err);
  });
  return resp;
};
