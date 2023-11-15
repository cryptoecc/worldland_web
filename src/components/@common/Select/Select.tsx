import * as S from './Select.style';

import { Children, HTMLAttributes, PropsWithChildren, ReactElement, cloneElement, createElement } from 'react';
import { SelectListType, Type } from 'types/select';

import { DownArrowIcon } from 'assets';
import { useSwapContext } from 'contexts/SwapProvider';

export interface SelectProps {
  maxWidth?: string;
  borderRadius?: string;
  gap?: string;
  text: string;
  children?: ReactElement;
  type: Type;
  listType: SelectListType;
}

const Select = ({
  maxWidth,
  borderRadius,
  gap,
  text,
  children,
  type,
}: PropsWithChildren<SelectProps> & HTMLAttributes<HTMLDivElement>) => {
  const { input, output, openHandler } = useSwapContext();

  const getState = (type: Type) => {
    if (type === 'input') return input;
    if (type === 'output') return output;
  };

  const child = Children.only<ReactElement<Partial<SelectProps>>>(children as ReactElement);

  const handleOpen = (type: Type) => {
    if (type === null) return;
    openHandler(type);
  };

  return (
    <S.Layout maxWidth={maxWidth} borderRadius={borderRadius}>
      <S.Label>{text}</S.Label>
      <S.Container text={text}>
        <S.SelectContainer gap={gap}>
          <S.SelectWrapper onClick={() => handleOpen(type)}>
            <S.Select>
              {createElement(getState(type)?.networkIcon || input.networkIcon)}
              {getState(type)?.token}
            </S.Select>
            <DownArrowIcon />
          </S.SelectWrapper>
          {cloneElement(child, { type, ...child.props })}
        </S.SelectContainer>
      </S.Container>
    </S.Layout>
  );
};

export default Select;
