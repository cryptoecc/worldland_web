import { web3_wld as web3 } from 'configs/web3-wld';
import { mapMessageToObject } from 'data';
import { Web3 } from 'web3';
import { ListItemType } from 'types/select';
export const from_wei = (val?: string) => (val ? Web3.utils.fromWei('' + val, 'ether') : '');
export const to_wei = (val?: string) => (val ? Web3.utils.toWei('' + val, 'ether') : '');

export function putCommaAtPrice(data: number | string, precision: number) {
  let str;

  if (data === '') {
    return '';
  }
  if (data !== undefined) {
    str = data.toString().split('.');

    str[0] = `${str[0]}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    if (str.length > 1) str[1] = str[1].slice(0, +precision);
    return str.join('.');
  }
  return '';
}

export async function getBlockNumber() {
  const latest = (await web3.eth.getBlock('latest')).number;
  const current = latest + BigInt(1);
  const next = current + BigInt(1);
  return { latest: latest, current: current, next: next };
}

export async function setDeadline(expiry: number) {
  const blockGenerationTime = 15;
  const latestTimeStamp = (await web3.eth.getBlock('latest')).timestamp;
  return latestTimeStamp + BigInt(blockGenerationTime) + BigInt(expiry);
}

export function handleAddLiquidityBtnState(state: number, token?: ListItemType | null) {
  if (state === 1) {
    return mapMessageToObject[state](token);
  }
  return mapMessageToObject[state];
}
export function handleBtnState(state: number, token?: ListItemType | null) {
  if (state === 1 || state === 5 || state === 8) {
    return mapMessageToObject[state](token);
  }
  return mapMessageToObject[state];
}

export function testInput(val: string) {
  return /^[0-9]*[.,]?[0-9]*$/.test(val);
}
