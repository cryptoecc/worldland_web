import React from 'react';
import styled from 'styled-components';
// import twitter from '../../assets/footer/icons/twitter.svg';
// import discord from '../../assets/footer/icons/discord.svg';
// import youtube from '../../assets/footer/icons/youtube.svg';
// import github from '../../assets/footer/icons/github.svg';
import logo from '../../assets/footer/images/Logo.svg';
import { maxQuery } from 'utils/breakpoints';
import { theme } from 'style/theme';

const FooterContainer = styled.footer`
  display: flex;
  padding: 160px 0px;
  flex-direction: column;
  align-items: center;
  align-self: stretch;
  background-color: transparent;

  ${maxQuery.tablet} {
    padding-top: 0;
    padding-bottom: 80px;
  }
`;

const Contact1 = styled.div`
  display: flex;
  gap: 32px;
  width: 80%;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  ${maxQuery.tablet} {
    height: auto;
    gap: 16px;
  }
`;

const ContactWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;

  div {
    width: auto 95px;
    height: auto 19px;
    color: ${theme.colors.white800};
    font-family: 'Inter';
    font-size: 16px;
    font-weight: 400;
    line-height: calc(16px * 1.5);
  }

  ${maxQuery.tablet} {
    div {
      font-size: 14px;
    }
  }
`;

const Logo = styled.img`
  /* Style for the logo image */
  /* background:
    url(<path-to-image>),
    lightgray 50% / cover no-repeat; */
  /* background-color: black; */
  width: 200px;

  ${maxQuery.tablet} {
    width: 160px;
  }
`;

// const IconWrap = styled.div`
//   display: flex;
//   align-items: flex-start;
//   gap: 16px;
// `;

// const Icon = styled.img`
//   width: 32px;
//   height: 32px;
//   /* Style for the icon images */
// `;

const CopyrightText = styled.p`
  color: #aaa;
  font-family: 'Inter';
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  text-transform: capitalize;
  /* Style for the copyright text */

  ${maxQuery.tablet} {
    font-size: 12px;
  }
`;

const AppFooter = () => {
  return (
    <FooterContainer>
      <Contact1>
        <ContactWrap>
          <div>Managed by</div>
          {/* Add your Logo here */}
          <Logo src={logo} alt="Logo" />
        </ContactWrap>
        {/* <IconWrap>
          <Icon src={twitter} alt="Icon 1" />
          <Icon src={discord} alt="Icon 2" />
          <Icon src={youtube} alt="Icon 3" />
          <Icon src={github} alt="Icon 4" />
        </IconWrap> */}
        <CopyrightText>© 2022 - 2023 WorldLand. All rights reserved.</CopyrightText>
      </Contact1>
    </FooterContainer>
  );
};

export default AppFooter;
