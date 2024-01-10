import MainDashboard from 'components/main/MainDashboard';
import MainStatistics from 'components/main/MainStatistics';
import MainData from 'components/main/MainData';
import MainPartner from 'components/main/MainPartner';
import MainAreaChart from 'components/main/ActiveNodes';

const Main = () => {
  return (
    <>
      <MainDashboard />
      <MainStatistics />
      <MainAreaChart />
      <MainData />
      <MainPartner />
    </>
  );
};

export default Main;
