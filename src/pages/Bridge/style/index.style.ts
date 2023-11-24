import { styled } from 'styled-components';
import { theme } from 'style/theme';

export const Container = styled.article<{ width?: string }>`
  position: absolute;
  background-color: ${theme.colors.black75};
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: ${({ width }) => (width && width) || '27.5rem'};
  width: 100%;
  padding: 2rem;
  gap: 1rem;
  font-family: 'Inter', sans-serif;
  user-select: none;
`;

export const Label = styled.p`
  color: ${theme.colors.white80};
  font-size: 1.7rem;
  margin-bottom: 1.1rem;
`;
export const SubLabel = styled.p`
  color: ${theme.colors.white80};
  font-size: 0.7rem;
  font-weight: 700;
`;

export const Title = styled.h2`
  color: ${theme.colors.white5};
  font-size: 1rem;
  font-weight: 700;
`;

export const Button = styled.button`
  width: 100%;
  display: flex;
  justify-content: center;
  color: ${theme.colors.white10};
  background-color: ${theme.colors.red};
  padding: 0.7rem 0;
  border: none;
  border-radius: 0.75rem;
  font-weight: 700;
  margin: 0.5rem 0;
  cursor: pointer;

  &:disabled {
    background-color: ${({ disabled }) => (disabled ? theme.colors.black70 : theme.colors.red)};
  }
`;

export const InputWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  column-gap: 0.625rem;
  max-width: 100%;
  width: 100%;
  padding: 10px;
  border-top: 1px solid ${theme.colors.white90};
`;

export const Input = styled.input`
  max-width: 100%;
  width: 100%;
  background-color: transparent;
  border: none;
  color: ${theme.colors.black5};
  text-align: right;
  font-size: 1.7rem;
  font-weight: 900;

  &&::placeholder {
    color: ${theme.colors.white90};
  }
  &&::-webkit-inner-spin-button,
  -webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

export const MaxBtn = styled.button`
  border: none;
  background-color: transparent;
  color: ${theme.colors.red};
  font-size: 0.75rem;
  cursor: pointer;
`;

export const Chain = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px;
`;

export const ChainNameWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

export const B = styled.p`
  font-weight: 600;
  color: ${theme.colors.black70};
  font-size: 0.8rem;
  text-align: center;

  span {
    font-weight: 700;
    color: ${theme.colors.black};
  }
`;

export const ParentWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  padding: 5px;
  border-radius: 10px;
  background-color: ${theme.colors.white70};
`;

export const TokenWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 5.7rem;
  width: 100%;
  position: relative;

  span {
    position: absolute;
    right: -1rem;
    height: 2.6rem;
    width: 1px;
    background-color: ${theme.colors.white90};
  }
`;

export const SubTokenWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

export const ToggleIconHolder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

export const ToggleIconWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.white80};
  border-radius: 50%;
`;
