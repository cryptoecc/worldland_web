import { styled } from 'styled-components';

interface PageProps {
  $size: number;
}

const Container = styled.main<PageProps>`
  width: 100%;
  max-width: ${({ $size }) => `${$size}px`};
  display: flex;
  flex-direction: column;
  margin: 0 auto;
`;

export { Container };
