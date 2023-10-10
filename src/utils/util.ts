const Web3 = require('web3');
const { web3_wld: web3 } = require('../configs/web3-wld');
export const from_wei = (val: string) => Web3.utils.fromWei('' + val, 'ether');
export const to_wei = (val: string) => Web3.utils.toWei('' + val, 'ether');

export function putCommaAtPrice(data: number | string, precision: number | string) {
  let str;

  if (data !== undefined) {
    data = Number(data);

    if (Number.isFinite(+precision)) {
      data = data.toFixed(+precision);
    }
    // if (data < 1000)
    //   return data.toFixed(3);

    str = data.toString().split('.');

    str[0] = `${str[0]}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return str.join('.');
  }
  return 0;
}

export async function getBlockNumber() {
  const latest = (await web3.eth.getBlock('latest')).number;
  const current = latest + 1;
  const next = current + 1;
  return { latest: latest, current: current, next: next };
}

export async function setDeadline(expiry: number) {
  const blockGenerationTime = 15;
  const latestTimeStamp = (await web3.eth.getBlock('latest')).timestamp;
  return latestTimeStamp + blockGenerationTime + expiry;
}
