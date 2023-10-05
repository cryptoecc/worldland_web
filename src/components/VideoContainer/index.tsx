import styled from "styled-components";

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

export default VideoContainer;