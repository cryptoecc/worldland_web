import { MouseEventHandler } from 'react';


interface AssetsProps {
  style?: React.CSSProperties;
}

interface HeaderIconProps extends AssetsProps {
  onClick: MouseEventHandler<SVGSVGElement>;
}

export type { AssetsProps, HeaderIconProps };
