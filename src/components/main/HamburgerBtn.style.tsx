import { AiOutlineClose } from 'react-icons/ai';
import { BiMenu } from 'react-icons/bi';
import { theme } from 'style/theme';
import { styled } from 'styled-components';
import { maxQuery } from 'utils/breakpoints';

interface MenuListProps {
  isopen: string;
}

const HamburgerBtnWrapper = styled.nav`
  display: none;

  svg {
    display: none;
  }

  ${maxQuery.tablet} {
    display: flex;

    svg {
      display: flex;
    }
  }
`;

const MenuList = styled.ul<MenuListProps>`
  display: none;
  font-family: 'Inter';

  ${maxQuery.tablet} {
    display: ${(props) => (props.isopen === 'true' ? 'block' : 'none')};
    font-size: 1.1rem;
    /* margin-left: 30px; */
    /* transition: all 0.3s ease-in-out; */
    /* padding-left: 40px; */
    position: absolute;
    top: 64px;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    background-color: black;
    z-index: 6;
    list-style: none;
    /* 나머지 스타일링 */
  }
`;

const Li = styled.li`
  border-bottom: 1px solid hsla(0, 0%, 100%, 0.1);
  font-size: 1.1rem;
`;

const Button = styled.button<{ isSelected?: boolean }>`
  // Button 스타일
  display: flex;
  justify-content: space-between;
  width: 100%;
  color: ${(props) => (props.isSelected ? 'white' : '#848895')};
  padding: 1.3rem 0;
  /* border: none; */
  font-weight: 800;
  font-size: 15px;
  transition: color 0.3s ease-in-out;

  .icon {
    margin-right: 70px;
    font-size: 15px;
    font-weight: bold;
    /* white-space: nowrap; */
  }

  .learn {
    text-decoration: none;
    color: #848895;
    transition: color 0.3s ease-in-out;

    &:hover {
      color: ${theme.colors.white};
    }
  }

  .contact {
    color: white;
    text-decoration: underline;
    cursor: pointer;
  }

  &:hover {
    color: ${theme.colors.white};
  }

  ${maxQuery.tablet} {
    padding: 1.3rem 20px;
    background-color: ${(props) => (props.isSelected ? `${theme.colors.black800}` : 'transparent')};
    box-shadow: ${(props) => (props.isSelected ? '0 0 24px rgba(255, 255, 255, 0.1)' : 'none')};
    z-index: 3;

    .icon {
      margin-right: 0;
    }
  }
`;

const Dropdown = styled.div`
  background: black;
  padding: 25px 25px 15px 25px;
  border: 1px solid #848895;
  // hsla(0, 0%, 100%, 0.1)
  border-radius: 12px;
  margin-right: 70px;
  z-index: 100;

  .user-menu {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
  }

  .user-menu .user {
    padding: 15px;
    border: 1px solid transparent;
    border-radius: 8px;
    transition:
      background-color 0.3s ease-in-out,
      border-color 0.3s ease-in-out;
    text-decoration: none;
    color: white;
    cursor: pointer;

    &:hover {
      background-color: #1e1e1e;
    }
  }

  .divider {
    background: hsla(0, 0%, 100%, 0.1);
    height: 2px;
    margin: 2.5rem --1.625rem;
    margin-bottom: 15px;
  }

  ${maxQuery.tablet} {
    background: transparent;
    border: none;
    padding: 0;
    margin-right: 0;
    font-size: 0.88rem;
    font-weight: 600;

    .user-menu .user {
      padding: 20px;
      background-color: rgba(28, 28, 30, 0.6);
      border-radius: 0;

      &:hover {
      }
    }

    .divider {
      display: none;
      margin: 0;
    }
  }
`;

const HamburgerIcon = styled(BiMenu)`
  display: none;

  ${maxQuery.tablet} {
    display: block;
    position: absolute;
    top: 15px;
    right: 70px;
    z-index: 3;
    font-size: 2em;
    color: white;
    cursor: pointer;
  }
`;

const HamburgerOutIcon = styled(AiOutlineClose)`
  display: none;

  ${maxQuery.tablet} {
    display: block;
    position: absolute;
    top: 15px;
    right: 70px;
    z-index: 3;
    font-size: 2em;
    color: white;
    cursor: pointer;
  }
`;

export { MenuList, Li, Button, Dropdown, HamburgerIcon, HamburgerOutIcon, HamburgerBtnWrapper };
