import styled from '@emotion/styled';
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { theme } from 'style/theme';
import { maxQuery } from 'utils/breakpoints';

const Menu = styled.div`
  display: flex;
  width: 100%;
  max-width: 550px;
  justify-content: space-between;
  /* height: 25px; */
  height: 100vh;
  align-items: center;
  cursor: pointer;

  ${maxQuery.tablet} {
    display: none;
  }
`;

const MenuItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 250px;
`;

const MenuItem = styled.div<{ isSelected?: boolean }>`
  /* margin: 0px 25px; */
  position: relative;
  transition: color 0.3s ease-in-out;
  align-items: center;
  font-size: 18px;
  margin-right: 30px;
  white-space: nowrap;
  color: ${(props) => (props.isSelected ? 'white' : '#848895')};
  cursor: pointer;

  &:hover {
    color: white;
  }
`;

const Dropdown = styled.div`
  display: block;
  position: absolute;
  background-color: black;
  font-size: 14px;
  color: ${theme.colors.white};
  top: calc(100% + 1rem);
  border-radius: 12px;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.5);
  transition:
    opacity 0.3s ease-in-out,
    transform 0.3s ease-in-out,
    visibility 0.3s;
  transform: translateY(${(props: any) => (props['data-isvisible'] ? '0' : '-10px')});
  opacity: ${(props: any) => (props['data-isvisible'] ? '1' : '0')};
  visibility: ${(props: any) => (props['data-isvisible'] ? 'visible' : 'hidden')};
  border: 1px solid #858895;
  // hsla(0, 0%, 100%, 0.1)
  padding: 25px;
  white-space: nowrap;
  backdrop-filter: blur(10px);
  z-index: 4;
`;

const CommunityDropdown = styled(Dropdown)`
  /* overflow-x: hidden; */
`;

const OutlineDown = styled(AiOutlineDown)`
  width: 16px;
  height: 16px;
  vertical-align: middle;
`;

const OutlineUp = styled(AiOutlineUp)`
  width: 16px;
  height: 16px;
  vertical-align: middle;
`;

const Learn = styled.div`
  /* text-decoration: none; */
  color: #848895;
  transition: color 0.3s ease-in-out;

  &:hover {
    color: white;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  padding: 5px 30px 5px 5px;
  border: 1px solid transparent;
  border-radius: 8px;
  transition:
    border-color 0.3s ease-in-out,
    background-color 0.3s ease-in-out;
  line-height: 25px;

  &:hover {
    background-color: #1e1e1e;
    font-weight: bold;
  }
`;

const SpaceLink = styled.a`
  text-decoration: none;
  padding: 5px 30px 5px 5px;
  border: 1px solid transparent;
  border-radius: 8px;
  transition:
    border-color 0.3s ease-in-out,
    background-color 0.3s ease-in-out;
  line-height: 25px;
  cursor: pointer;

  &:hover {
    background-color: #1e1e1e;
    font-weight: bold;
  }
`;

const TimelockSectionWrap = styled.section`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  gap: 5px;
`

const UnorderedList = styled.ul<{ active: boolean }>`
  display: ${({ active }) => active ? 'flex' : 'hidden'};
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  list-style-type: disc;
  gap: 10px;
  list-style-position: outside;
  padding-left: 42px;
  /* transition: opacity 0.3s visibility 0.3s ease-in-out; */
  transition: opacity 0.3s ease-in-out;
  opacity: ${({ active }) => active ? 1 : 0};
  visibility: ${({ active }) => active ? '' : 'hidden'};
`
const List = styled.li`
  width: 100%;
  font-size: 12px;
  text-indent: -20px;
`

const SpaceSpanLink = styled.span`
  text-decoration: none;
  padding: 5px 30px 5px 5px;
  border: 1px solid transparent;
  border-radius: 8px;
  transition:
    border-color 0.3s ease-in-out,
    background-color 0.3s ease-in-out;
  line-height: 25px;

  &:hover {
    background-color: #1e1e1e;
    font-weight: bold;
  }
`;

const Strong = styled.div`
  color: #ffffff;
  font-weight: bold;
  padding: 0 20px;
  display: flex;
  gap: 8px;
  align-items: center;
`;

const SlightStrong = styled.p`
  color: #ffffff;
  padding: 0 20px;
  &:hover {
    color: #b6b6b6;
  }
`;

const Network = styled.div`
  display: flex;
  flex-direction: row;
  transition: all 0.3s ease;
`;

const User = styled.div`
  display: flex;
  flex-direction: row;
  transition: all 0.3s ease;
`;

const Divider = styled.div`
  width: 1px;
  height: auto;
  color: red;
  /* margin: -1rem, 2.5rem; */
  /* margin-right: -20px; */
  margin-left: 18px;
  margin-right: 20px;
  background: hsla(0, 0%, 100%, 0.1);
`;

const Contack = styled.div`
  /* margin: 0px 25px; */
  /* padding: 0px 25px; */
  /* position: relative; */
  transition: color 0.3s ease-in-out;
  align-items: center;
  color: white;
  text-decoration: underline;
  cursor: pointer;
`;

export {
  Menu,
  MenuItemWrapper,
  Dropdown,
  MenuItem,
  CommunityDropdown,
  OutlineDown,
  OutlineUp,
  Learn,
  SpaceLink,
  SpaceSpanLink,
  Strong,
  Network,
  User,
  Divider,
  Contack,
  StyledLink,
  SlightStrong,
  UnorderedList,
  TimelockSectionWrap,
  List
};
