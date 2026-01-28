import MainDashboard from 'components/main/MainDashboard';
import MainStatistics from 'components/main/MainStatistics';
import MainData from 'components/main/MainData';
import MainPartner from 'components/main/MainPartner';
import MainAreaChart from 'components/main/ActiveNodes';
import MainCodeWord from 'components/main/CodeWord';
import AppEvent from 'components/layout/AppEvent';

const Main = () => {
  return (
    <>
      {/* <AppEvent /> */}
      <MainDashboard />
      <MainStatistics />
      <MainCodeWord />
      <MainAreaChart />
      <MainData />
      <MainPartner />
    </>
  );
};

export default Main;
