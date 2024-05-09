import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { maxQuery } from 'utils/breakpoints';
import { theme } from 'style/theme';

const EventContainer = styled.div`
  position: fixed;
  width: 100%;
  margin-top: 50px;
  display: flex;
  padding: 20px 0px;
  flex-direction: column;
  text-align: center;
  align-items: center;
  align-self: stretch;
  /* background-color: transparent; */
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

const EventText = styled.p`
  color: #ffffff;
  width: 100%;
  margin-top: 20px;
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

const AppEvent = () => {
  const [timeLeft, setTimeLeft] = useState('');

  // 하드포크 D-day까지의 남은 시간 계산
  const calculateTimeLeft = () => {
    const hardforkDate = new Date('2024-05-19T12:00:00');
    const currentDate = new Date();
    const differenceInTime = hardforkDate.getTime() - currentDate.getTime();

    if (differenceInTime > 0) {
      const days = Math.floor(differenceInTime / (1000 * 60 * 60 * 24));
      const hours = Math.floor((differenceInTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((differenceInTime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((differenceInTime % (1000 * 60)) / 1000);
      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    } else {
      setTimeLeft('하드포크가 시작되었습니다!');
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      calculateTimeLeft();
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <EventContainer>
      <EventText>WorldLand Mainnet Hardfork D - day : {timeLeft}</EventText>
    </EventContainer>
  );
};

export default AppEvent;
