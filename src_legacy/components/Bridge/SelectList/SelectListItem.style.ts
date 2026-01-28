import { SelectListItemProps } from './SelectListItem';
import { styled } from 'styled-components';
import { theme } from 'style/theme';

export const List = styled.li`
  list-style: none;
  display: flex;
  flex-direction: row;
  row-gap: 1rem;
  column-gap: 0.5rem;
  cursor: pointer;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: 0.5rem;

  svg {
    width: 2rem;
    height: 2rem;
  }
`;

export const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Text = styled.div<Pick<SelectListItemProps, 'size'>>`
  color: ${({ size }) => (size === 'sm' ? theme.colors.white80 : theme.colors.white5)};
  font-size: ${({ size }) => (size === 'sm' ? '0.75rem' : '1rem')};
  font-weight: ${({ size }) => (size === 'sm' ? 300 : 500)};
`;
