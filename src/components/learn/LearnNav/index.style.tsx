import { styled } from 'styled-components';
import { Link } from 'react-router-dom';
import { maxQuery } from 'utils/breakpoints';
import { theme } from 'style/theme';

interface Props {
  $size: number;
  $active: boolean;
  $menuType: 'menu' | 'subMenu';
}

const Nav = styled.nav<Pick<Props, '$size'>>`
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

const getStyle = ({ $menuType, $active }: Omit<Props, '$size'>) => {
  if ($menuType === 'menu') {
    const color = $active ? theme.colors.white : theme.colors.white900;
    return { color };
  }

  if ($menuType === 'subMenu') {
    const color = $active ? theme.colors.white : theme.colors.white800;
    return { color };
  }
};

const Menu = styled(Link)<Omit<Props, '$size'>>`
  ${({ $menuType, $active }) => getStyle({ $menuType, $active })};
  text-decoration-line: ${({ $active }) => ($active ? 'underline' : '')};
  font-weight: ${({ $menuType }) => ($menuType === 'menu' ? 500 : 400)};
  padding-left: ${({ $menuType }) => $menuType === 'subMenu' && '16px'};
`;

export { Nav, Menu };
