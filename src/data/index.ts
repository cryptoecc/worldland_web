import { SwapListItemType } from 'types/select';

export const mapMessageToObject: any = {
  0: 'Enter an amount',
  1: (token: SwapListItemType) => `Insufficient ${token.token} balance`,
  2: 'Approve',
  3: 'Add liquidity',
  4: 'Connect wallet',
  5: (token: SwapListItemType) => `Enter ${token.token} amount`,
  6: 'Swap',
  7: 'Switch network',
};
