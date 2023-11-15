import { styled } from 'styled-components';
import { theme } from 'style/theme';

export const Container = styled.article<{ width?: string }>`
  position: absolute;
  background-color: ${theme.colors.black75};
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: ${({ width }) => (width && width) || '27.5rem'};
  padding: 2rem;
  gap: 2rem;
`;

export const Title = styled.h2`
  color: ${theme.colors.white5};
  font-size: 1rem;
  font-weight: 700;
`;

export const SwapWrapper = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 1rem;
`;

export const Button = styled.button`
  width: 100%;
  display: flex;
  justify-content: center;
  color: ${theme.colors.white10};
  background-color: ${theme.colors.red};
  padding: 0.5rem 0;
  border: none;
  border-radius: 0.75rem;
  font-weight: 700;
`;
