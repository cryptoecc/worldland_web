import styled from 'styled-components';
import { DecentralizedIcon, EnergyEfficiencyIcon, EvmCompatibilityIcon, PqSecurityIcon } from 'assets';
import { maxQuery } from 'utils/breakpoints';
import { theme } from 'style/theme';
import { Helmet } from 'react-helmet';

const ContainerData = styled.div`
  font-family: 'Inter';
  width: 100%;
  background-color: transparent;
  color: ${theme.colors.white};
  overflow: hidden;
  max-width: 1280px;
  margin: 0 auto;
  padding: 120px 40px;

  ${maxQuery.tablet} {
    padding: 60px 20px;
  }
`;

const Head = styled.div`
  width: 100%;
  font-weight: bold;
  font-size: 48px;
  margin: 0 auto;
  margin-bottom: 20px;

  ${maxQuery.tablet} {
    font-size: 1.4rem;
  }
`;

const Section = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  gap: 32px;

  ${maxQuery.tablet} {
    gap: 40px;

    div:nth-child(2n) {
      flex-direction: column-reverse;
    }
  }
`;

const Core = styled.div`
  display: flex;
  /* width: 90%; */
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;

  ${maxQuery.tablet} {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 16px;
    margin-top: 0;

    svg {
      max-width: 40vw;
    }
  }
`;

const Content = styled.div`
  gap: 16px;
  flex: 0.5;
  /* padding-top: 150px; */

  ${maxQuery.tablet} {
    justify-content: center;
  }
`;

const Body = styled.div`
  display: flex;
  font-size: 88px;
  font-weight: 700;
  margin-bottom: 1.5rem;

  ${maxQuery.tablet} {
    justify-content: center;
    font-size: 1.2rem;
  }
`;

const Child = styled.div`
  color: #aaa;
  font-size: 20px;
  font-weight: 400;
  line-height: 24px;

  ${maxQuery.tablet} {
    text-align: center;
    font-size: 14px;
  }
`;

function MainData() {
  return (
    <>
      <div>
        <Helmet>
          <title>Worldland foundation</title>
          <meta name="description" content="We are Worldland Main Network" />
          <meta property="og:url" content="https://worldland.foundation" />
          <meta property="og:title" content="Worldland" />
          <meta property="og:description" content="We are Worldland Main Network" />
          <meta property="og:image" content="https://lv-storage1.s3.amazonaws.com/logo.png" />
          <meta name="twitter:title" content="twitter" />
          <meta name="twitter:description" content="twitter description" />
          <meta name="twitter:image" content="https://lv-storage1.s3.amazonaws.com/logo.png" />
        </Helmet>
      </div>
      <ContainerData>
        <Head>Core Features</Head>
        <Section>
          <Core>
            <EvmCompatibilityIcon />
            <Content>
              <Body>EVM Compatibility</Body>
              <Child>
                Worldland is fully compatible with EVM, allowing all dApps and smart contracts on EVM to operate.
                <br />
                Experience your Ethereum dApp in a new way on Worldland.
              </Child>
            </Content>
          </Core>
          <Core>
            <Content>
              <Body>PQ Security</Body>
              <Child>
                Worldland's ECCPoW consensus algorithm utilizes coding theory to ensure robust security against attacks
                from quantum computers
              </Child>
            </Content>
            <PqSecurityIcon />
          </Core>
          <Core>
            <EnergyEfficiencyIcon />
            <Content>
              <Body>Energy Efficiency</Body>
              <Child>
                Worldland's Green VCA technology significantly reduces energy consumption in the mining process by
                randomly selecting miners.
              </Child>
            </Content>
          </Core>
          <Core>
            <Content>
              <Body>Decentralized</Body>
              <Child>
                The existing Proof of Work (POW) system faces issues of centralization due to ASIC devices. However,
                Worldland's network based on ECCPow reduces the efficiency of ASICS, defending the blockchain from
                centralization by ASIC devices
              </Child>
            </Content>
            <DecentralizedIcon />
          </Core>
        </Section>
      </ContainerData>
    </>
  );
}

export default MainData;
