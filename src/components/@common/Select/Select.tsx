import * as S from './Select.style';

import { ChangeEvent, Children, Dispatch, HTMLAttributes, PropsWithChildren, ReactElement, SetStateAction, cloneElement, createElement } from 'react';
import { Provider, SelectListType, Type } from 'types/select';

import { useContextType } from 'hooks/useContextType';

export interface SelectProps {
  maxWidth?: string;
  borderRadius?: string;
  gap?: string;
  text: string;
  children?: ReactElement;
  type: Type;
  listType: SelectListType;
  input?: string;
  output?: string;
  eventHandler?: (e: ChangeEvent<HTMLInputElement>) => void;
  provider?: Provider;
}

const Select = ({
  maxWidth,
  borderRadius,
  gap,
  text,
  children,
  type,
  listType = 'tokenList',
  provider,
}: PropsWithChildren<SelectProps> & HTMLAttributes<HTMLDivElement>) => {
  const { input, output, openHandler } = useContextType(provider ?? 'Bridge');

  const getState = (type: Type) => {
    if (type === 'input') return input;
    if (type === 'output') return output;
  };

  const child = Children.only<ReactElement<Partial<SelectProps>>>(children as ReactElement);

  const handleOpen = (type: Type, listType: SelectListType) => {
    if (type === null || listType === 'networkList') return;
    openHandler(type);
  };

  const icon =
    listType === 'networkList'
      ? input.tokenIcon
      : input.tokenIcon;

  return (
    <S.Layout width={maxWidth} radius={borderRadius} list={listType}>
      <S.Label>{text}</S.Label>
      <S.Container>
        <S.SelectContainer gap={gap}>
          <S.SelectWrapper onClick={() => handleOpen(type, listType)} list={listType}>
            <S.Select list={listType}>
              {createElement(icon)}
              {getState(type)?.token}
            </S.Select>
            <S.Icon list={listType} />
          </S.SelectWrapper>
          {listType === 'tokenList' && cloneElement(child, { type, ...child.props })}
        </S.SelectContainer>
      </S.Container>
    </S.Layout>
  );
};

export default Select;
