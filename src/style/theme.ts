import { DefaultTheme } from 'styled-components';

const colors = {
  blue: '#627EEA',
  red: '#E2554C',
  yellow: '#F4B731',
  black: '#000000',
  black5: '#0f0f0f',
  black90: '#060606',
  black80: '#1C1C1E',
  black75: '#202020',
  black70: '#4c4c4c',
  white90: '#AAAAAA',
  white80: '#B0B0B0',
  white70: '#D0D0D0',
  white15: '#f9f9f9',
  white10: '#F4F4F4',
  white5: '#f0f0f0',
  white: '#ffffff',
  transparent: 'transparent',

  // text
  text1: '#FFFFFF',
  text2: '#C3C5CB',
  text3: '#6C7284',
  text4: '#565A69',
  text5: '#2C2F36',

  // backgrounds / greys
  bg0: '#191B1F',
  bg1: '#1F2128',
  bg2: '#2C2F36',
  bg3: '#525955',
  bg4: '#565A69',
  bg5: '#6C7284',

  //specialty colors
  modalBG: 'rgba(0,0,0,.425)',
  advancedBG: 'rgba(0,0,0,0.1)',

  //primary colors
  primary1: '#2172E5',
  primary2: '#3680E7',
  primary3: '#4D8FEA',
  primary4: '#376bad70',
  primary5: '#153d6f70',

  // color text
  primaryText1: '#6da8ff',

  // secondary colors
  secondary1: '#2172E5',
  secondary2: '#17000b26',
  secondary3: '#17000b26',

  // other
  pink1: '#ff007a',
  red1: '#FD4040',
  red2: '#F82D3A',
  red3: '#D60000',
  green1: '#27AE60',
  yellow1: '#FFE270',
  yellow2: '#F3841E',
  yellow3: '#F3B71E',
  blue1: '#2172E5',
  blue2: '#5199FF',
} as const;

export const theme: DefaultTheme = { colors };
