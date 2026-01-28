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

// 홀수 자리 마스킹
export const replaceOddIndexCharacters = (inputStr: string): string => {
  let newStr: string = '';

  for (let i = 0; i < inputStr.length; i++) {
    if (i % 2 == 1) {
      newStr += '*';
    } else {
      newStr += inputStr.charAt(i);
    }
  }

  return newStr;
};

// email 규칙 체크
export const validateEmail = (email: string): boolean => {
  const regExp =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regExp.test(String(email).toLowerCase());
};

// 8자 이상, 영문, 숫자, 특수문자를 최소 한가지씩 조합
export const validatePassword = (pw: string): boolean => {
  const regExp = /(?=.*[0-9]{1,})(?=.*[~`!@#$%\^&*()-+=]{1,})(?=.*[a-zA-Z]{1,}).{8,}$/;

  return regExp.test(pw); // 형식에 맞는 경우 true 리턴
};

export const validatePIN = (pin: string): boolean => {
  const regExp = /[0-9]{6,6}$/;

  return regExp.test(pin); // 형식에 맞는 경우 true 리턴
};

// 숫자
export const validateOnlyNumber = (pin: string): boolean => {
  const regExp = /^[0-9]*$/;

  return regExp.test(pin); // 형식에 맞는 경우 true 리턴
};
