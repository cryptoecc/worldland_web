import { DefaultTheme } from 'styled-components';

const colors = {
  brandColor: '#DF3128',
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
} as const;

export const theme: DefaultTheme = { colors };
