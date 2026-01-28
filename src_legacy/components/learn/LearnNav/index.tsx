import { learnMenus } from 'constants/learnMenus';
import { useLocation } from 'react-router-dom';
import { Menu, Nav, SubMenu } from './index.style';

const LearnNav = ({ menus = learnMenus }) => {
  const excludedValues = ['About WorldLand', 'Technology'];
  const location = useLocation();

  return (
    <Nav $size={121}>
      <ul>
        {menus.map((menu, index) => {
          return (
            <li key={`${menu.menuType}_${index}`}>
              {menu.menuType === 'menu' ? (
                <Menu
                  to={menu.path}
                  active={
                    excludedValues.includes(menu.value) ? 'false' : location.pathname === menu.path ? 'true' : 'false'
                  }
                >
                  {menu.value}
                </Menu>
              ) : (
                <SubMenu to={menu.path} active={location.pathname === menu.path ? 'true' : 'false'}>
                  {menu.value}
                </SubMenu>
              )}
            </li>
          );
        })}
      </ul>
    </Nav>
  );
};

export default LearnNav;
