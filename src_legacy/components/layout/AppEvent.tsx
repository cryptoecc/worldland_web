import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { maxQuery } from 'utils/breakpoints';
import { theme } from 'style/theme';
import { web3 } from 'components/web3/useWeb3';

const EventContainer = styled.div`
  position: fixed;
  width: 100%;
  margin-top: 60px;
  display: flex;
  /* padding: 20px 0px; */
  padding: 20px;
  gap: 10px;
  flex-direction: column;
  text-align: center;
  align-items: center;
  background: ${theme.colors.black};
  z-index: 4;

  @media (max-width: 768px) {
    padding-top: 20px; /* 모바일에서 상단 여백을 줄입니다. */
    padding-bottom: 20px; /* 모바일에서 하단 여백을 줄입니다. */
  }
  /* ${maxQuery.tablet} {
    padding-top: 0;
    padding-bottom: 80px;
  } */
`;

const EventContainer2 = styled.div`
  position: fixed;
  width: 100%;
  margin-top: 65px;
  display: flex;
  /* padding: 20px 0px; */
  padding: 10px;
  gap: 10px;
  flex-direction: row;
  text-align: center;
  align-items: center;
  background: ${theme.colors.white};
  z-index: 4;

  @media (max-width: 768px) {
    padding-top: 20px; /* 모바일에서 상단 여백을 줄입니다. */
    padding-bottom: 20px; /* 모바일에서 하단 여백을 줄입니다. */
  }
  /* ${maxQuery.tablet} {
    padding-top: 0;
    padding-bottom: 80px;
  } */
`;

const EventBox = styled.div`
  color: #ffffff;
  width: 100%;
  /* margin-top: 20px; */
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Inter';
  font-size: 18px;
  font-weight: 600;
  line-height: center;
  gap: 24px;

  @media (max-width: 768px) {
    font-size: 14px; /* 모바일에서 텍스트 크기를 줄입니다. */
  }
  /* ${maxQuery.tablet} {
    font-size: 12px;
  } */
`;

const Text2 = styled.div`
  font-size: 16px;
  color: black;
`;

const LastButton = styled.a`
  background-color: #a01424;
  font-size: 16px;
  font-weight: 600;
  line-height: 22px;
  width: 250px;
  color: white;
  padding: 12px;
  border-radius: 8px;
  display: inline-block;

  &:hover {
    background-color: #fde3d3;
  }
`;

LastButton.defaultProps = {
  target: '_blank',
  rel: 'noopener noreferrer',
};

const EventText = styled.p`
  color: #ffffff;
  width: 100%;
  /* margin-top: 20px; */
  font-family: 'Inter';
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  text-transform: capitalize;

  @media (max-width: 768px) {
    font-size: 14px; /* 모바일에서 텍스트 크기를 줄입니다. */
  }
  /* ${maxQuery.tablet} {
    font-size: 12px;
  } */
`;

const TimeDiv = styled.div`
  /* width: 500px; */
  /* margin: 0 auto; */
  display: flex;
  align-items: center;
  width: 100%;
  /* justify-content: space-around; */
  /* font-weight: 400; */
`;

const DTime = styled.div`
  /* width: 500px; */
  width: 100%;
  display: flex;
  margin-left: 280px;
  /* margin: 0 auto; */
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* flex-grow: 1; */

  .timeLeft {
    font-weight: 700;
    font-size: 18px;
  }
`;

const Text = styled.div`
  font-size: 16px;
  padding-bottom: 10px;
  color: #f5967c;
`;

const ButtonDiv = styled.div`
  display: flex;
  justify-content: flex-end; // 버튼을 오른쪽 끝으로 정렬
  /* width: 100%; // 필요에 따라 조정 */
  align-items: center; // 수직 중앙 정렬
  /* margin-left: 100px; */
`;

const Button = styled.a`
  background-color: #fde3d3;
  font-size: 18px;
  font-weight: 600;
  line-height: 22px;
  width: 250px;
  color: black;
  padding: 16px;
  border-radius: 8px;
  display: inline-block;

  &:hover {
    background-color: #fde3d3;
  }
`;

Button.defaultProps = {
  target: '_blank',
  rel: 'noopener noreferrer',
};

const TimeLeft = styled.div`
  display: flex;
  font-weight: 400;
  font-size: 18px;
  width: 600px;
  justify-content: space-around;
`;

const AppEvent = () => {
  const [timeLeft, setTimeLeft] = useState('');
  const [lastBlocks, setLastBlocks] = useState(0);
  const [leftBlocks, seLeftBlocks] = useState(0);
  const [timeout, setTimeout] = useState<boolean>(false);

  const fetchLatestBlockNumber = async () => {
    const blockNumber = await web3.eth.getBlockNumber();
    setLastBlocks(Number(blockNumber));
  };

  // 하드포크 D-day까지의 남은 시간 계산
  const calculateTimeLeft = async () => {
    const targetBlock = 2520000;
    const blocksPerDay = 10022;
    const secondsPerDay = 24 * 60 * 60;
    const latestBlockNumber = await web3.eth.getBlockNumber();
    const blocksLeft = targetBlock - Number(latestBlockNumber);

    seLeftBlocks(blocksLeft);

    const secondsLeft = (blocksLeft / blocksPerDay) * secondsPerDay;

    if (secondsLeft <= 0 || blocksLeft <= 0) {
      setTimeout(true);
    }

    console.log(blocksLeft);
    return secondsLeft;
  };

  const formatTimeLeft = (seconds: any) => {
    const days = Math.floor(seconds / (3600 * 24));
    seconds -= days * 3600 * 24;
    const hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;
    const minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;

    return `${days}d ${hours}h ${minutes}m ${Math.floor(seconds)}s`;
  };

  const formatNumber = (num: Number) => {
    return num.toLocaleString(); // 숫자를 로컬 문자열 형식으로 변환
  };

  useEffect(() => {
    fetchLatestBlockNumber();
    const timer = setInterval(async () => {
      fetchLatestBlockNumber();
      const seconds = await calculateTimeLeft();
      setTimeLeft(formatTimeLeft(seconds));
    }, 1000);

    return () => clearInterval(timer);
  }, [lastBlocks, timeout]);

  if (timeout) {
    return (
      <EventContainer2>
        <EventBox>
          <Text2>The Annapurna Hardfork has been completed!</Text2>
          <LastButton href="https://worldland-official.medium.com/important-node-required-update-annapurna-hardfork-block-changed-a031dbd26a3a">
            Get Latest Node
            <span style={{ fontSize: '18px', marginTop: '10px', fontWeight: '500' }}> → </span>
          </LastButton>
        </EventBox>
      </EventContainer2>
    );
  }

  return (
    <EventContainer>
      <EventText>
        <TimeDiv>
          <DTime>
            <Text>Annapurna Hardfork</Text>
            <TimeLeft>
              <div>
                D-day : <span className="timeLeft">{timeLeft}</span>
              </div>
              <div>
                D-block : <span className="timeLeft">{formatNumber(Number(leftBlocks))}</span>
              </div>
            </TimeLeft>
          </DTime>
          <ButtonDiv>
            <Button href="https://worldland-official.medium.com/important-node-required-update-annapurna-hardfork-block-changed-a031dbd26a3a">
              Get Latest Node
            </Button>
          </ButtonDiv>
        </TimeDiv>
      </EventText>
    </EventContainer>
  );
};

export default AppEvent;
