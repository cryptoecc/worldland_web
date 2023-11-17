import * as S from './SelectListItem.style';

import { SelectType } from 'types/select';
import { createElement } from 'react';

export interface SelectListItemProps
  extends Pick<SelectType, 'tokenIcon' | 'token' | 'network' | 'networkIcon' | 'listIcon'> {
  size?: 'sm';
  onClick: () => void;
}

const SelectListItem = ({
  size = 'sm',
  onClick,
  tokenIcon,
  token,
  network,
  listIcon,
  ...props
}: SelectListItemProps) => {
  return (
    <S.List onClick={onClick} {...props}>
      <S.Container>{createElement(listIcon)}</S.Container>
      <S.TextWrapper>
        <S.Text>{token}</S.Text>
        <S.Text size={size}>{network}</S.Text>
      </S.TextWrapper>
    </S.List>
  );
};

export default SelectListItem;
