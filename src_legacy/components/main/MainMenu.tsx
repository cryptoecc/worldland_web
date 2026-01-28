import { hover } from '@testing-library/user-event/dist/hover';
import {
  Menu,
  Dropdown,
  MenuItem,
  CommunityDropdown,
  OutlineDown,
  OutlineUp,
  SpaceLink,
  SpaceDiv,
  Strong,
  Network,
  User,
  Divider,
  Learn,
  Contack,
  MenuItemWrapper,
  SpaceSpanLink,
  SlightStrong,
  UnorderedList,
  TimelockSectionWrap,
  List,
} from './MainMenu.style';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Discord } from 'assets/header/Header';
import AddNetworkButton from 'components/web3/AddNetworkButton';
import axios from 'axios';
import Chatbot from 'components/Chatbot';
// import { EVM } from 'assets/main/Main_core';

const MainMenu = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState<boolean>(false);

  const handleMenuClick = (menu: any) => {
    setActiveMenu(activeMenu === menu ? null : menu);
    setActiveDropdown(false);
  };

  return (
    <Menu>
      <MenuItemWrapper>
        <MenuItem data-isactive={activeMenu === 'Learn'} onClick={() => handleMenuClick('Learn')}>
          <Link to={'/learn'}>
            <Learn>Learn</Learn>
          </Link>
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
                  <TimelockSectionWrap>
                    <SpaceSpanLink
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdown((prev) => !prev);
                      }}
                    >
                      <Strong>Timelock Contracts</Strong>
                    </SpaceSpanLink>
                    <UnorderedList active={activeDropdown}>
                      <List>
                        <Link to="/timelock-contracts/award" target="_blank">
                          <SlightStrong>Award Distributer</SlightStrong>
                        </Link>
                      </List>
                      <List>
                        <Link to="/timelock-contracts/sale" target="_blank">
                          <SlightStrong>Token Sale</SlightStrong>
                        </Link>
                      </List>
                    </UnorderedList>
                  </TimelockSectionWrap>
                </div>
              </div>
              <Divider></Divider>
              <div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <SpaceLink href="https://scan.worldland.foundation/" target="_blank">
                    <Strong>Scan</Strong>
                  </SpaceLink>
                  {/* <SpaceLink href="https://ai.worldland.foundation/" target="_blank">
                    <Strong>My AI</Strong>
                  </SpaceLink>
                  <SpaceDiv>
                    <Strong>
                      <Chatbot />
                    </Strong>
                  </SpaceDiv> */}
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
                  <SpaceLink href="https://github.com/cryptoecc/WorldLand" target="_blank" rel="noopener noreferrer">
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
              <SpaceLink href="https://dao.worldland.foundation" target="_blank" rel="noopener noreferrer">
                <Strong>DAO Vote</Strong>
              </SpaceLink>

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
