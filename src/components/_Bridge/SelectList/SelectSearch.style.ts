import { styled } from 'styled-components';
import { theme } from 'style/theme';

export const Container = styled.form`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 3rem;
  column-gap: 0.625rem;
  background-color: ${theme.colors.white5};
  border-radius: 0.5rem;
  padding: 1rem;
  border: 0.0625rem solid ${theme.colors.white80};

  svg {
    height: 0.8rem;
    width: 0.8rem;
  }
`;

export const Input = styled.input`
  width: 100%;
  height: 2.8rem;
  background-color: transparent;
  border: none;
  font-size: 1rem;

  &&::placeholder {
    color: ${theme.colors.white80};
  }
`;
