import React, { useState } from 'react';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';

import {
  MenuList,
  Li,
  Button,
  Dropdown,
  HamburgerIcon,
  HamburgerOutIcon,
  HamburgerBtnWrapper,
  ButtonLearn,
} from './HamburgerBtn.style';
import { CloseIcon, MenuIcon } from 'assets';
import { theme } from 'style/theme';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { useWeb3Modal, Web3NetworkSwitch } from '@web3modal/react';

const HamburgerBtn = () => {
  const [isHamburgerOpen, setHamburgerOpen] = useState(false);
  const [menuState, setMenuState] = useState({
    learn: false,
    user: false,
    developer: false,
    aidex: false,
    community: false,
    contactUs: false,
  });

  const { open, close } = useWeb3Modal();

  const toggleHamburgerMenu = () => {
    setHamburgerOpen(!isHamburgerOpen);
  };

  const toggleSubMenu = (menuName: 'learn' | 'user' | 'developer' | 'aidex' | 'community' | 'contactUs') => {
    setMenuState((prevState) => ({
      ...prevState,
      learn: menuName === 'learn' ? !prevState.learn : false,
      user: menuName === 'user' ? !prevState.user : false,
      developer: menuName === 'developer' ? !prevState.developer : false,
      aidex: menuName === 'aidex' ? !prevState.aidex : false,
      community: menuName === 'community' ? !prevState.community : false,
      contactUs: menuName === 'contactUs' ? !prevState.contactUs : false,
    }));
  };

  const handleLinkClick = (message: string) => {
    alert(message);
  };

  const NetworkButton = styled.a``;

  const AddNetworkButton = () => {
    const addNetwork = async () => {
      if (window.ethereum && window.ethereum.request) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x67', // Polygon의 체인 ID
                chainName: 'Seoul Mainnet',
                nativeCurrency: {
                  name: 'WLC',
                  symbol: 'WLC',
                  decimals: 18,
                },
                rpcUrls: ['https://seoul.worldland.foundation/'],
              },
            ],
          });
          console.log('Successfully added Worldland network to MetaMask.');
        } catch (error) {
          console.error('Failed to add Worldland network to MetaMask:', error);
          // 사용자가 요청을 거부한 경우나, 다른 이유로 요청이 실패한 경우를 처리합니다.
        }
      } else {
        console.log('Metamask is not installed');
        // 메타마스크가 설치되어 있지 않은 경우를 처리합니다.
      }
    };

    return (
      <NetworkButton onClick={addNetwork} className="user">
        Add to Wallet
      </NetworkButton>
    );
  };

  const Eventpath = () => {
    window.open('https://open.kakao.com/o/gK0OM0zf', '_blank');
  };

  return (
    <HamburgerBtnWrapper>
      {isHamburgerOpen ? (
        <CloseIcon onClick={toggleHamburgerMenu} style={{ color: `${theme.colors.white}` }} />
      ) : (
        <MenuIcon onClick={toggleHamburgerMenu} style={{ color: `${theme.colors.white}` }} />
      )}
      <MenuList isopen={isHamburgerOpen ? 'true' : 'false'}>
        <Li>
          <Button onClick={() => open()}>Connect</Button>
        </Li>
        <Li>
          <ButtonLearn onClick={() => toggleSubMenu('learn')}>
            <Link className="learn" to="/learn" onClick={() => toggleHamburgerMenu()}>
              Learn
            </Link>
          </ButtonLearn>
        </Li>
        <Li>
          <Button isSelected={menuState.user ? true : undefined} onClick={() => toggleSubMenu('user')}>
            User
            {menuState.user ? <BsChevronUp className="icon" /> : <BsChevronDown className="icon" />}
          </Button>
          {menuState.user && (
            <Dropdown data-isvisible={menuState.user}>
              <div className="user-menu">
                <a
                  href="https://docs.worldland.foundation/user/wallet"
                  className="user"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Connect Worldland
                </a>
                <a
                  href="https://docs.worldland.foundation/miner/start-mining"
                  className="user"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Start Mining
                </a>
                <a
                  href="https://docs.worldland.foundation/miner/install-and-run-geth"
                  className="user"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Node Operator
                </a>
                <AddNetworkButton />
                <div className="user" onClick={() => handleLinkClick('서비스 준비중입니다.')}>
                  Bridge
                </div>
              </div>
              <div className="divider"></div>
              <div className="user-menu">
                <a href="http://scan.worldland.foundation/" className="user" target="_blank" rel="noopener noreferrer">
                  Scan
                </a>
              </div>
            </Dropdown>
          )}
        </Li>
        <Li>
          <Button isSelected={menuState.developer ? true : undefined} onClick={() => toggleSubMenu('developer')}>
            Developer
            {menuState.developer ? <BsChevronUp className="icon" /> : <BsChevronDown className="icon" />}
          </Button>
          {menuState.developer && (
            <Dropdown>
              <div className="user-menu">
                <a
                  href="https://ethworldland.gitbook.io/ethereum-worldland/participate/how-to-start-a-worldland-node."
                  className="user"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Docs
                </a>
                <a href="https://github.com/cryptoecc" className="user" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </div>
            </Dropdown>
          )}
        </Li>
        <Li>
          <Button isSelected={menuState.aidex ? true : undefined} onClick={() => toggleSubMenu('aidex')}>
            AI-DEX
            {menuState.aidex ? <BsChevronUp className="icon" /> : <BsChevronDown className="icon" />}
          </Button>
          {menuState.aidex && (
            <Dropdown>
              <div className="user-menu">
                <Link className="user" to="/swap" onClick={() => toggleHamburgerMenu()}>
                  Swap
                </Link>
                <Link className="user" to="/pool" onClick={() => toggleHamburgerMenu()}>
                  Pool
                </Link>
              </div>
            </Dropdown>
          )}
        </Li>
        <Li>
          <Button isSelected={menuState.community ? true : undefined} onClick={() => toggleSubMenu('community')}>
            Community
            {menuState.community ? <BsChevronUp className="icon" /> : <BsChevronDown className="icon" />}
          </Button>
          {menuState.community && (
            <Dropdown>
              <div className="user-menu">
                <a
                  href="https://dao.worldland.space/#/worldlandtest.eth"
                  className="user"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  DAO
                </a>
                <a
                  href="https://medium.com/@worldland-official"
                  className="user"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Medium
                </a>
                <a
                  href="https://twitter.com/Worldland_space"
                  className="user"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Twitter
                </a>
                <a href="https://discord.gg/yJERYVnE6a" className="user" target="_blank" rel="noopener noreferrer">
                  Discord
                </a>
              </div>
            </Dropdown>
          )}
        </Li>
      </MenuList>
    </HamburgerBtnWrapper>
  );
};

export default HamburgerBtn;
