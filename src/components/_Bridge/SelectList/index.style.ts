import { styled } from 'styled-components';
import { theme } from 'style/theme';

export const Container = styled.div<{ isOpen: boolean }>`
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border-radius: 1.25rem;
  background-color: ${theme.colors.black75};
  flex-direction: column;
  padding: 2rem;
  row-gap: 2rem;
`;

export const Title = styled.h2`
  color: ${theme.colors.white5};
  font-size: 1rem;
  font-weight: 700;
`;

export const ItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
`;
