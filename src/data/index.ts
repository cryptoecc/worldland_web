import { ListItemType } from 'types/select';

export const mapMessageToObject: any = {
  0: 'Enter an amount',
  1: (token: ListItemType) => `Insufficient ${token.token} balance`,
  2: 'Approve',
  3: 'Add liquidity',
  4: 'Connect wallet',
  5: (token: ListItemType) => `Enter ${token.token} amount`,
  6: 'Swap',
  7: 'Switch network',
  8: (token: ListItemType) => `Switch network ${token.network}`,
  9: 'Transfer',
};
