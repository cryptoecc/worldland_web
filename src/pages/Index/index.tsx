import AppFooter from 'components/layout/AppFooter';
import AppHeader from 'components/layout/AppHeader';
import { Outlet } from 'react-router-dom';

const Index = () => {
  return (
    <>
      <AppHeader />
      <Outlet />
      <AppFooter />
    </>
  );
};

export default Index;
