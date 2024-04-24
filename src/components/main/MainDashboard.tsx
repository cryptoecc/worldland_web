import {
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
} from './MainDashboard.style';

const MainDashboard = () => {
  return (
    <DashboardContainer>
      <ContentContainer>
        <TextContainer>
          <Text>
            Let us build a global digital land called WorldLand.
            <SubText>
              We the people of WorldLand aim to establish a global free trade digital land. This will be a platform on
              which people from the five oceans and six continents can come and participate in one productive economy.
            </SubText>
          </Text>
          <ButtonContainer>
            <LearnBtn to="https://worldland.foundation/learn">Learn</LearnBtn>
            <DocsBtn to="https://docs.worldland.foundation/">Docs</DocsBtn>
            {/* <PdfBtn href="/WorldLand_Flier_V2_Word_English.pdf" download={'WorldLand_Flier.pdf'}> */}
            <PdfBtn href="/WorldLand_Flier.pdf" download={'WorldLand_Flier.pdf'}>
              About Us
            </PdfBtn>
            <WhiteBtn href="/WorldLand_Whitepaper.pdf" download={'WorldLand_Whitepaper.pdf'}>
              White Paper
            </WhiteBtn>
          </ButtonContainer>
        </TextContainer>

        <VideoContainer>
          <Video autoPlay loop muted playsInline>
            <source src="/videos/MainVideo.mp4" />
            Your browser does not support the video tag.
          </Video>
        </VideoContainer>
      </ContentContainer>
    </DashboardContainer>
  );
};

export default MainDashboard;
