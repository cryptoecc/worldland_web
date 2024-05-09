import { Link } from 'react-router-dom';
import { theme } from 'style/theme';
import styled from 'styled-components';
import { maxQuery } from 'utils/breakpoints';

const DashboardContainer = styled.div`
  position: relative; /* Add this to allow absolute positioning of the video and text */
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  min-height: 600px;
  width: 100%;
  background-color: transparent;
  overflow: hidden;

  ${maxQuery.tablet} {
    background-position: center;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding-top: 20px;
  }
`;

const VideoContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;

  /* 숨길 컨트롤 요소들을 선택하여 스타일을 적용합니다. */
  video::-webkit-media-controls-panel,
  video::-webkit-media-controls-overlay-play-button,
  video::-webkit-media-controls-start-playback-button {
    display: none !important;
    opacity: 0;
  }
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ContentContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
  height: 100%;

  ${maxQuery.tablet} {
    flex-direction: column;
  }
`;

const TextContainer = styled.div`
  display: flex;
  align-items: top;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  max-width: 1280px;
  height: auto;
  z-index: 1; /* Add this to ensure the text is above the video */
  padding: 0 40px;

  ${maxQuery.tablet} {
    width: 100%;
    padding: 0 20px;
    text-align: center;
    margin-bottom: 20px;
    order: 3;
  }
`;

const Text = styled.div`
  text-align: center;
  margin-bottom: 30px;
  font-size: 38px;
  color: ${theme.colors.white};
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  line-height: 57px; /* 150% */
  text-transform: capitalize;

  ${maxQuery.tablet} {
    font-size: 1.5rem;
    line-height: calc(1.5rem * 1.5);
  }
`;

const SubText = styled.p`
  text-align: left;
  margin-top: 35px;
  color: #aaa;
  font-family: 'Inter';
  font-size: 22px;
  font-style: normal;
  font-weight: 600;
  line-height: 33px; /* 150% */

  ${maxQuery.tablet} {
    font-size: 0.8rem;
    line-height: calc(0.8rem * 1.5);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  align-items: center;
  order: 1;
  margin-top: 20px;

  ${maxQuery.tablet} {
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top: 10px;

    button {
      padding: 8px 16px;
      font-size: 14px;
    }
  }
`;

const LearnBtn = styled(Link)`
  display: flex;
  width: 145px;
  text-align: center;
  padding: 12px 24px;
  flex-direction: column;
  border-radius: 6px;
  background: #f4f4f4;
  font-family: 'Inter';
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  text-decoration: none; /* Add this to remove underline */

  &:hover {
    background-color: ${theme.colors.white80};
    color: ${theme.colors.white};
    transition:
      color 0.3s,
      background 0.3s;
  }
`;

const DocsBtn = styled(Link)`
  display: flex;
  width: 145px;
  text-align: center;
  padding: 12px 24px;
  flex-direction: column;
  border-radius: 6px;
  border: 1px solid #f4f4f4;
  color: #f4f4f4;
  font-family: 'Inter';
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  text-decoration: none; /* Add this to remove underline */

  &:hover {
    background-color: ${theme.colors.white80};
    border: 1px solid ${theme.colors.white80};
    transition:
      background 0.3s,
      border 0.3s;
  }
`;

const PdfBtn = styled.a`
  display: flex;
  width: 145px;
  text-align: center;
  padding: 12px 24px;
  flex-direction: column;
  border-radius: 6px;
  background: #f4f4f4;
  font-family: 'Inter';
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  text-decoration: none; /* Add this to remove underline */

  &:hover {
    background-color: ${theme.colors.white80};
    color: ${theme.colors.white};
    transition:
      color 0.3s,
      background 0.3s;
  }
`;

const WhiteBtn = styled.a`
  display: flex;
  width: 150px;
  text-align: center;
  padding: 12px 24px;
  flex-direction: column;
  border-radius: 6px;
  border: 1px solid #f4f4f4;
  color: #f4f4f4;
  font-family: 'Inter';
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  text-decoration: none; /* Add this to remove underline */

  &:hover {
    background-color: ${theme.colors.white80};
    color: ${theme.colors.white};
    transition:
      color 0.3s,
      background 0.3s;
  }
`;

export {
  DashboardContainer,
  VideoContainer,
  Video,
  ContentContainer,
  TextContainer,
  Text,
  SubText,
  ButtonContainer,
  DocsBtn,
  LearnBtn,
  PdfBtn,
  WhiteBtn,
};
