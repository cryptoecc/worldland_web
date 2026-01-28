import { styled } from 'styled-components';

const Footer = styled.footer`
  margin: 100px auto 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 32px;

  color: #aaa;
  font-family: 'Inter';
  font-size: var(--text-size-medium);
  font-style: normal;
  font-weight: 600;
  line-height: normal;

  a {
    cursor: pointer;
    padding: 12px 24px;
    gap: 6px;
    border-radius: 6px;
    background: #f4f4f4;
    color: #000;

    font-family: 'Inter';
    font-size: var(--text-size-medium);
    font-weight: 600;
    line-height: normal;

    &:hover {
      background: rgba(244, 244, 244, 0.8);
      transition: background 0.3s;
    }
  }
`;

export { Footer };
