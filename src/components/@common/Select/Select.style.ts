import { SelectProps } from './Select';
import { styled } from 'styled-components';
import { theme } from 'style/theme';

export const Layout = styled.div<Pick<SelectProps, 'maxWidth' | 'borderRadius' | 'text'>>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  row-gap: 0.625rem;
  max-width: ${({ maxWidth }) => maxWidth ?? '100%'};
  width: 100%;
  padding: 1rem;
  background-color: ${theme.colors.white5};
  border: 1px solid ${theme.colors.white80};
  border-radius: ${({ borderRadius }) => borderRadius ?? '0.75rem'};
  border-left: ${({ text }) => text === 'Network' && 'none'};
`;

export const Label = styled.p`
  color: ${theme.colors.white80};
  font-size: 0.5rem;
`;

export const Container = styled.div<Pick<SelectProps, 'text'>>`
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

export const SelectWrapper = styled.div<Pick<SelectProps, 'text'>>`
  display: flex;
  align-items: center;
  column-gap: ${({ text }) => (text === 'Network' ? 'none' : '0.5rem')};
  justify-content: ${({ text }) => text === 'Network' && 'space-between'};
  width: 100%;
  cursor: pointer;
`;

export const Select = styled.span<Pick<SelectProps, 'text'>>`
  display: flex;
  justify-content: center;
  align-items: center;
  column-gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 700;

  svg {
    background-color: ${({ text }) => text === 'Network' && theme.colors.white15};
    border-radius: ${({ text }) => text === 'Network' && '0.5rem'};
  }
`;
