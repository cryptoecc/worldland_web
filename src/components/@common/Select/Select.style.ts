import { DownArrowIcon } from 'assets';
import { SelectListType } from 'types/select';
import { SelectProps } from './Select';
import { styled } from 'styled-components';
import { theme } from 'style/theme';

interface StyleProps {
  width?: string;
  radius?: string;
  gap?: string;
  list: SelectListType;
}

export const Layout = styled.div<StyleProps>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  row-gap: 0.625rem;
  max-width: ${({ width }) => width ?? '100%'};
  width: 100%;
  padding: 1rem;
  background-color: ${theme.colors.white5};
  border: 1px solid ${theme.colors.white80};
  border-radius: ${({ radius }) => radius ?? '0.75rem'};
  border-left: ${({ list }) => list === 'networkList' && 'none'};
`;

export const Label = styled.p`
  color: ${theme.colors.white80};
  font-size: 0.5rem;
`;

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const SelectContainer = styled.div<Pick<SelectProps, 'gap'>>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  column-gap: ${({ gap }) => gap ?? '0.75rem'};
  width: 100%;
`;

export const SelectWrapper = styled.div<StyleProps>`
  display: flex;
  align-items: center;
  column-gap: ${({ list }) => (list === 'networkList' ? 'none' : '0.5rem')};
  cursor: ${({ list }) => (list === 'tokenList' ? 'pointer' : 'default')};
  width: 100%;
`;

export const Icon = styled(DownArrowIcon)<StyleProps>`
  display: ${({ list }) => (list === 'networkList' ? 'none' : 'default')};
`;

export const Select = styled.span<StyleProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  column-gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 700;

  svg {
    background-color: ${({ list }) => list === 'networkList' && theme.colors.white15};
    border-radius: ${({ list }) => list === 'networkList' && '0.5rem'};
  }
`;
