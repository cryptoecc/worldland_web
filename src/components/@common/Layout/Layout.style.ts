import { styled } from 'styled-components';

export const Container = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
`;

export const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;

  &&::-webkit-media-controls-panel,
  &&::-webkit-media-controls-overlay-play-button,
  &&::-webkit-media-controls-start-playback-button {
    display: none;
    opacity: 0;
  }
`;
