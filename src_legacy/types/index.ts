export interface BasicResponse {
  retCode: string;
  retMsg?: string | undefined;
}

export interface PageItemSub {
  id: string;
  title: string | JSX.Element;
  icon?: JSX.Element;
  navLink?: string;
  hasSub: boolean;
  sub?: PageItemSub[];
}

export interface PageItem {
  header: string;
  title?: string | JSX.Element;
  navLink?: string;
  subMenu: PageItemSub[];
}
