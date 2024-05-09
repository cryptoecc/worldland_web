import { hover } from '@testing-library/user-event/dist/hover';
import {
  Menu,
  Dropdown,
  MenuItem,
  CommunityDropdown,
  OutlineDown,
  OutlineUp,
  SpaceLink,
  Strong,
  Network,
  User,
  Divider,
  Learn,
  Contack,
  MenuItemWrapper,
} from './MainMenu.style';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Discord } from 'assets/header/Header';
import AddNetworkButton from 'components/web3/AddNetworkButton';
import axios from 'axios';
// import { EVM } from 'assets/main/Main_core';

const MainMenu = () => {
  const [activeMenu, setActiveMenu] = useState(null);

  const handleMenuClick = (menu: any) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const handleLinkClick = (message: string) => {
    alert('서비스 준비중입니다.');
  };

  const Eventpath = () => {
    window.open('https://open.kakao.com/o/gK0OM0zf', '_blank');
  };

  return (
    <Menu>
      <MenuItemWrapper>
        <MenuItem data-isactive={activeMenu === 'Learn'} onClick={() => handleMenuClick('Learn')}>
          <Link to={'/learn'}>
            <Learn>Learn</Learn>
          </Link>
          {/* <Dropdown data-isvisible={activeMenu === 'Learn'}>
            <div style={{ display: 'flex', margin: '20px 0' }}>
              <AiOutlineGlobal style={{ color: '#f9a109', paddingRight: '5px' }} /> HERE TO LEARN
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <SpaceLink href="https://www.worldland.space/">
                <Strong>BlockChain and WorldLand</Strong>
                <div>The basics on all things WorldLand and web3.</div>
              </SpaceLink>
              <SpaceLink href="https://www.worldland.space/Learn/">
                <Strong>Intro to WorldLand</Strong>
                <div>Introduction : What is WorldLand</div>
              </SpaceLink>
            </div>
          </Dropdown> */}
        </MenuItem>
        <MenuItem
          isSelected={activeMenu === 'User' ? true : undefined}
          data-isactive={activeMenu === 'User'}
          onClick={() => handleMenuClick('User')}
        >
          User
          <Dropdown data-isvisible={activeMenu === 'User'}>
            <User>
              <div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <SpaceLink
                    href="https://docs.worldland.foundation/user/wallet"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Strong>Connect Worldland</Strong>
                  </SpaceLink>
                  <SpaceLink
                    href="https://docs.worldland.foundation/miner/install-and-run-geth"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Strong>Run node</Strong>
                  </SpaceLink>
                  <AddNetworkButton />
                </div>
              </div>
              <Divider></Divider>
              <div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {/* <SpaceLink onClick={() => handleLinkClick('서비스 준비중입니다.')}>
                    <Strong>Bridge</Strong>
                  </SpaceLink> */}
                  <SpaceLink href="https://scan.worldland.foundation/" target="_blank">
                    <Strong>Scan</Strong>
                  </SpaceLink>
                  <SpaceLink href="https://ai.worldland.foundation/" target="_blank">
                    <Strong>My AI</Strong>
                  </SpaceLink>
                </div>
              </div>
            </User>
          </Dropdown>
        </MenuItem>
        <MenuItem
          isSelected={activeMenu === 'Develop' ? true : undefined}
          data-isactive={activeMenu === 'Develop'}
          onClick={() => handleMenuClick('Develop')}
        >
          Developer
          <Dropdown data-isvisible={activeMenu === 'Develop'}>
            <Network>
              <div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <SpaceLink href="https://docs.worldland.foundation/" target="_blank" rel="noopener noreferrer">
                    <Strong>Docs</Strong>
                  </SpaceLink>
                  <SpaceLink href="https://github.com/cryptoecc/ETH-ECC" target="_blank" rel="noopener noreferrer">
                    <Strong>GitHub</Strong>
                  </SpaceLink>
                </div>
              </div>
            </Network>
          </Dropdown>
        </MenuItem>
        <MenuItem
          isSelected={activeMenu === 'AI-DEX' ? true : undefined}
          data-isactive={activeMenu === 'AI-DEX'}
          onClick={() => handleMenuClick('AI-DEX')}
        >
          AI-Dex
          <Dropdown data-isvisible={activeMenu === 'AI-DEX'}>
            <Network>
              <div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <SpaceLink href="/bridge">
                    <Strong>Bridge</Strong>
                  </SpaceLink>
                  <SpaceLink href="/swap">
                    <Strong>Swap</Strong>
                  </SpaceLink>
                  <SpaceLink href="/pool">
                    <Strong>Pool</Strong>
                  </SpaceLink>
                </div>
              </div>
            </Network>
          </Dropdown>
        </MenuItem>
        <MenuItem
          isSelected={activeMenu === 'Community' ? true : undefined}
          data-isactive={activeMenu === 'Community'}
          onClick={() => handleMenuClick('Community')}
        >
          Community
          <CommunityDropdown className="community" data-isvisible={activeMenu === 'Community'}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <SpaceLink
                href="https://dao.worldland.foundation"
                target="_blank"
                rel="noopener noreferrer"
                // onClick={() => handleLinkClick('서비스 준비중입니다.')} // DAO Vote 버튼 클릭 시 handleLinkClick 함수 실행
              >
                <Strong>DAO Vote</Strong>
              </SpaceLink>
              {/* <SpaceLink>
                <Strong>Help Center</Strong>
              </SpaceLink> */}
              <SpaceLink href="https://medium.com/@worldland-official" target="_blank" rel="noopener noreferrer">
                <Strong>Medium</Strong>
              </SpaceLink>
              <SpaceLink href="https://www.youtube.com/@Worldland-2023" target="_blank" rel="noopener noreferrer">
                <Strong>YouTube</Strong>
              </SpaceLink>
              <SpaceLink href="https://twitter.com/Worldland_space" target="_blank" rel="noopener norefeerer">
                <Strong>
                  <Twitter />
                  {'   '}Twitter
                </Strong>
              </SpaceLink>
              <SpaceLink href="https://discord.gg/yJERYVnE6a" target="_blank" rel="noopener noreferrer">
                <Strong>
                  <Discord /> Discord
                </Strong>
              </SpaceLink>
            </div>
          </CommunityDropdown>
        </MenuItem>
        <MenuItem data-isactive={activeMenu === 'Contact'} onClick={() => handleMenuClick('Contact')}>
          <Link to={'/contact'}>
            <Learn>Contact</Learn>
          </Link>
        </MenuItem>
      </MenuItemWrapper>
    </Menu>
  );
};

export default MainMenu;
