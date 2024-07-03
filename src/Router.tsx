import Main from 'pages/Main';
import Learn from 'pages/Learn';
import Swap from 'pages/Swap';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Charter from 'components/learn/Post/Charter';
import { PATH } from 'constants/path';
import Overview from 'components/learn/Post/Overview';
import EccPow from 'components/learn/Post/ECCPoW';
import ASICResistance from 'components/learn/Post/ASICResistance';
import PQsecurity from 'components/learn/Post/PQsecurity';
import GreenVCA from 'components/learn/Post/GreenVCA';
import DesignPrinciples from 'components/learn/Post/DesignPrinciples';
import Coinomics from 'components/learn/Post/Coinomics';
import HowWorks from 'components/learn/Post/HowWorks';
import Governance from 'components/learn/Post/Governance';
import Index from 'pages/Index';
import Pool from 'pages/Pool';
import AddLiquidity from 'pages/Pool/AddLiquidity';
import Contact from 'pages/Contact';
import SwapPage from './pages/Swap/SwapPage';
import Bridge from 'pages/Bridge';
import Timelock from 'pages/Timelock';
import UserAward from 'pages/Timelock/User_award';
import UserSale from 'pages/Timelock/User_sale';
import ProtectedRoute from 'pages/ProtectedRoute';
import Login2 from 'pages/Login/page';
import Register from 'pages/Register';
import ForgotPassword2 from 'pages/Forgot-password';
import ForgotEmail2 from 'pages/Forgot-email';
import CustomizedSteppers from 'components/AuthRegister/test';
import AdminTokenSale from 'pages/Admin/AdminTokenSale';
import AdminAward from 'pages/Admin/AdminAward';
import ProfileSub from 'apps/profile/pageid/page';

const Router = () => {
  const router = createBrowserRouter([
    {
      path: `${PATH.MAIN}`,
      element: <Index />,
      children: [
        { index: true, element: <Main /> },
        {
          path: `${PATH.LEARN}`,
          element: <Learn />,
          children: [
            { index: true, element: <Charter /> },
            { path: `${PATH.LEARN_OVERVIEW}`, element: <Overview /> },
            { path: `${PATH.LEARN_ECCPOW}`, element: <EccPow /> },
            { path: `${PATH.LEARN_ASIC_RESISTENCE}`, element: <ASICResistance /> },
            { path: `${PATH.LEARN_PQ_SECURITY}`, element: <PQsecurity /> },
            { path: `${PATH.LEARN_GREEN_VCA}`, element: <GreenVCA /> },
            { path: `${PATH.LEARN_DESIGN_PRINCIPLE}`, element: <DesignPrinciples /> },
            { path: `${PATH.LEARN_HOW_WORKS}`, element: <HowWorks /> },
            { path: `${PATH.LEARN_COINOMICS}`, element: <Coinomics /> },
            { path: `${PATH.LEARN_GOVERNANCE}`, element: <Governance /> },
          ],
        },
        { path: `${PATH.SWAP_LEGACY}`, element: <Swap /> },
        { path: `${PATH.SWAP}`, element: <SwapPage /> },
        { path: `${PATH.BRIDGE}`, element: <Bridge /> },
        { path: `${PATH.POOL}`, element: <Pool /> },
        { path: `${PATH.ADD}`, element: <AddLiquidity /> },
        { path: `${PATH.CONTACT}`, element: <Contact /> },
        { path: `${PATH.ADMIN}`, element: <ProtectedRoute /> },
        { path: `${PATH.ADMIN_SALE}`, element: <AdminTokenSale /> },
        { path: `${PATH.ADMIN_AWARD}`, element: <AdminAward /> },
        { path: `${PATH.TIMELOCK_LIST}`, element: <Timelock /> },
        { path: `${PATH.TIMELOCK_USER_AWARD}`, element: <UserAward /> },
        { path: `${PATH.TIMELOCK_USER_SALE}`, element: <UserSale /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
