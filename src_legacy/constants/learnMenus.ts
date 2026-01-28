import { PATH } from './path';

export const learnMenus = [
  {
    menuType: 'menu',
    path: `${PATH.LEARN}`,
    value: 'About WorldLand',
  },
  {
    menuType: 'subMenu',
    path: `${PATH.LEARN}`,
    value: 'Charter',
  },
  {
    menuType: 'subMenu',
    path: `${PATH.LEARN_OVERVIEW}`,
    value: 'Overview',
  },
  {
    menuType: 'menu',
    path: `${PATH.LEARN_ECCPOW}`,
    value: 'Technology',
  },
  {
    menuType: 'subMenu',
    path: `${PATH.LEARN_ECCPOW}`,
    value: 'ECCPoW',
  },
  { menuType: 'subMenu', path: `${PATH.LEARN_ASIC_RESISTENCE}`, value: 'Asic resistence' },
  { menuType: 'subMenu', path: `${PATH.LEARN_PQ_SECURITY}`, value: 'PQ Security' },
  { menuType: 'subMenu', path: `${PATH.LEARN_GREEN_VCA}`, value: 'Green VCA' },
  { menuType: 'menu', path: `${PATH.LEARN_DESIGN_PRINCIPLE}`, value: 'Design Principles' },
  { menuType: 'menu', path: `${PATH.LEARN_HOW_WORKS}`, value: 'How works' },
  { menuType: 'menu', path: `${PATH.LEARN_COINOMICS}`, value: 'Coinomics' },
  { menuType: 'menu', path: `${PATH.LEARN_GOVERNANCE}`, value: 'Governance' },
];
