import MainDashboard from 'components/main/MainDashboard';
import MainStatistics from 'components/main/MainStatistics';
import MainData from 'components/main/MainData';
import AppFooter from 'components/layout/AppFooter';
import AppHeader from 'components/layout/AppHeader';
import MainPartner from 'components/main/MainPartner';
import { Outlet } from 'react-router-dom';

const Main = () => {
  return (
    <>
      <MainDashboard />
      <MainStatistics />
      <MainData />
      <MainPartner />
    </>
  );
};

export default Main;
