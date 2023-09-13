import { learnMenus } from 'constants/learnMenus';
import { useLocation } from 'react-router-dom';
import { Menu, Nav } from './index.style';

const LearnNav = ({ menus = learnMenus }) => {
  const excludedValues = ['About WorldLand', 'Technology'];
  const location = useLocation();

  return (
    <Nav $size={121}>
      <ul>
        {menus.map((menu) => {
          return (
            <li key={`${menu.type}_${menu.value}`}>
              <Menu
                to={menu.path}
                $menuType={menu.type}
                $active={!excludedValues.includes(menu.value) && location.pathname === menu.path}
              >
                {menu.value}
              </Menu>
            </li>
          );
        })}
      </ul>
    </Nav>
  );
};

export default LearnNav;
