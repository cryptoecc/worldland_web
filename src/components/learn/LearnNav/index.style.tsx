import { styled } from 'styled-components';
import { Link } from 'react-router-dom';
import { maxQuery } from 'utils/breakpoints';

interface ContainerProps {
  $size: number;
}

const Nav = styled.nav<ContainerProps>`
  width: 100%;
  max-width: ${({ $size }) => `${$size}px`};
  font-size: var(--text-size-primary);
  margin: 0 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;

  ul {
    display: flex;
    flex-direction: column;
    gap: 16px;

    li {
      font-family: 'Inter';
      list-style-type: none;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 8px;

      & :hover {
        color: #f4f4f4;
      }
    }
  }

  ${maxQuery.tablet} {
    width: 100%;
    max-width: 100%;
    padding-right: 32px;
    flex-direction: row;

    ul {
      flex-direction: row;
      overflow-x: auto;

      li {
        flex-direction: row;
        align-items: center;
        flex: none;

        a {
          margin-bottom: 35px;
          padding-left: 0;
        }
      }
    }

    ::-webkit-scrollbar {
      width: 16px;
    }

    ::-webkit-scrollbar-thumb {
      background: #f4f4f4;
      border-radius: 20px;
    }
  }
`;

const Menu = styled(Link)<{ active: string }>`
  ${(props) => {
    const { active, theme } = props;
    const color = active === 'true' ? theme.colors.white : theme.colors.white90;
    const textUnderline = active === 'true' ? 'underline' : '';

    return `
      color: ${color};
      text-decoration-line: ${textUnderline};
      font-weight: 500;
    `;
  }}
`;

const SubMenu = styled(Link)<{ active: string }>`
  ${(props) => {
    const { active, theme } = props;
    const color = active === 'true' ? theme.colors.white : theme.colors.white80;
    const textUnderline = active === 'true' ? 'underline' : '';

    return `
      color: ${color};
      text-decoration-line: ${textUnderline};
      padding-left: 16px;
      font-weight: 400;
    `;
  }}
`;

export { Nav, Menu, SubMenu };
