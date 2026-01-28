import { SelectInputProps } from './SelectInput';
import { styled } from 'styled-components';
import { theme } from 'style/theme';

export const InputWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  column-gap: 0.625rem;
  max-width: 100%;
  width: 100%;
`;

export const Input = styled.input<Pick<SelectInputProps, 'type'>>`
  max-width: 100%;
  width: 100%;
  background-color: transparent;
  border: none;
  color: ${theme.colors.black5};
  text-align: right;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: ${({ type }) => type === 'output' && 'default'};

  &&::placeholder {
    color: ${theme.colors.white70};
  }
`;

export const MaxBtn = styled.button`
  border: none;
  background-color: transparent;
  color: ${theme.colors.red};
  font-size: 0.75rem;
  cursor: pointer;
`;
