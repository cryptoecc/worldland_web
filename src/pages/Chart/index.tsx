import VideoContainer from 'components/VideoContainer';
import Video from 'components/Video';
import Running from 'components/Chart/Running_accounts';
import { styled } from 'styled-components';
import Backdrop from 'components/Backdrop';

const Contact = () => {
  return (
    <Container>
      {/* <Backdrop intensity={5} /> */}
      <VideoContainer>
        <Video autoPlay loop muted playsInline>
          <source src="/videos/MainVideo.mp4" />
          Your browser does not support the video tag.
        </Video>
      </VideoContainer>
      <Running />
    </Container>
  );
};

export default Contact;

const Container = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  /* flex-direction: column; */
  height: 100vh;
  position: relative;
`;
