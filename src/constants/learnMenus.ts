import { PATH } from './path';

export interface MenuType {
  type: 'menu' | 'subMenu';
  path: string;
  value: string;
}

export const learnMenus: MenuType[] = [
  {
    type: 'menu',
    path: `${PATH.LEARN}`,
    value: 'About WorldLand',
  },
  {
    type: 'subMenu',
    path: `${PATH.LEARN}`,
    value: 'Charter',
  },
  {
    type: 'subMenu',
    path: `${PATH.LEARN_OVERVIEW}`,
    value: 'Overview',
  },
  {
    type: 'menu',
    path: `${PATH.LEARN_ECCPOW}`,
    value: 'Technology',
  },
  {
    type: 'subMenu',
    path: `${PATH.LEARN_ECCPOW}`,
    value: 'ECCPoW',
  },
  { type: 'subMenu', path: `${PATH.LEARN_ASIC_RESISTENCE}`, value: 'Asic resistence' },
  { type: 'subMenu', path: `${PATH.LEARN_PQ_SECURITY}`, value: 'PQ Security' },
  { type: 'subMenu', path: `${PATH.LEARN_GREEN_VCA}`, value: 'Green VCA' },
  { type: 'menu', path: `${PATH.LEARN_DESIGN_PRINCIPLE}`, value: 'Design Principles' },
  { type: 'menu', path: `${PATH.LEARN_HOW_WORKS}`, value: 'How works' },
  { type: 'menu', path: `${PATH.LEARN_COINOMICS}`, value: 'Coinomics' },
  { type: 'menu', path: `${PATH.LEARN_GOVERNANCE}`, value: 'Governance' },
];
