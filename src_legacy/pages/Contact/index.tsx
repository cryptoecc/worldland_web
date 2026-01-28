import VideoContainer from 'components/VideoContainer';
import Video from 'components/Video';
import InputTab from 'components/Contact/inputTab';
import { styled } from 'styled-components';

const Contact = () => {
  return (
    <Container>
      <VideoContainer>
        <Video autoPlay loop muted playsInline>
          <source src="/videos/MainVideo.mp4" />
          Your browser does not support the video tag.
        </Video>
      </VideoContainer>
      <InputTab />
    </Container>
  );
};

export default Contact;

const Container = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100vh;
  position: relative;
`;
