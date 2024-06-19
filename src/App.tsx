import Router from './Router';
import './App.css';
import InitUser from 'pages/authentication/initUser';

const App = () => {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Nunito+Sans:opsz,wght@6..12,300;6..12,600&display=swap"
        rel="stylesheet"
      ></link>
      <InitUser />
      <Router />;
    </>
  );
};

export default App;
