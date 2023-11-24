import * as S from './SelectListItem.style';

import { SwapSelectType } from 'types/select';
import { createElement } from 'react';

export interface SelectListItemProps
    extends Pick<SwapSelectType, 'tokenIcon' | 'token' | 'listIcon'> {
    size?: 'sm';
    onClick: () => void;
}

const SwapSelectListItems = ({
    size = 'sm',
    onClick,
    tokenIcon,
    token,
    listIcon,
    ...props
}: SelectListItemProps) => {
    return (
        <S.List onClick={onClick} {...props}>
            <S.Container>{createElement(listIcon)}</S.Container>
            <S.TextWrapper>
                <S.Text>{token}</S.Text>
                <S.Text size={size}>{token}</S.Text>
            </S.TextWrapper>
        </S.List>
    );
};

export default SwapSelectListItems;
