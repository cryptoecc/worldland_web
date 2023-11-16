import { styled } from 'styled-components';
import { theme } from 'style/theme';

export const Bridge = styled.article<{ width?: string }>`
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
