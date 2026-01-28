import styled from 'styled-components';
import HamburgerBtn from 'components/main/HamburgerBtn';
import MainMenu from 'components/main/MainMenu';
import { Link } from 'react-router-dom';
import { maxQuery } from 'utils/breakpoints';
import { theme } from 'style/theme';
import { WorldLandLogo } from 'assets';
import Web3ConnectButton from 'components/web3/Web3Button';
import LoginButton from 'components/LoginBtn/login_btn';
import AddNetworkButton from 'components/web3/AddNetworkButton';
import MobileMetamask from 'components/web3/MobileAddNetwork';

const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 5;
  font-family: 'Inter';
  height: 65px;
  background: ${theme.colors.black};
  font-size: 14px;
  color: ${theme.colors.white};
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  width: 100%;

  ${maxQuery.tablet} {
    flex-direction: row;
    position: fixed;
    width: 100%;
    justify-content: space-between;
    z-index: 6;

    svg {
      cursor: pointer;
    }
  }
`;

const Header = styled.div`
  width: 100%;
  max-width: 1280px;
  padding: 0 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  ${maxQuery.tablet} {
    padding: 0 20px;
  }
`;

const LogoWrapper = styled.div`
  /* margin-left: 100px; */
  color: ${theme.colors.white};

  svg {
    height: 26px;
  }

  ${maxQuery.tablet} {
    margin-left: 0;

    svg {
      height: 12px;
    }
  }
`;

function AppHeader() {
  return (
    <HeaderWrapper>
      <Header>
        <Link to={'/'}>
          <LogoWrapper>
            <WorldLandLogo />
          </LogoWrapper>
        </Link>
        <MainMenu />
        {/* <LoginButton /> */}
        <Web3ConnectButton
          onAccountConnected={function (account: string): void {
            throw new Error('Function not implemented.');
          }}
        />
        <HamburgerBtn />
      </Header>
    </HeaderWrapper>
  );
}

export default AppHeader;
