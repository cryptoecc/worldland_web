import { theme } from 'style/theme';
import styled from 'styled-components';
import { maxQuery } from 'utils/breakpoints';

const StatisticsContainer = styled.div`
  font-family: 'Inter';
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  background: transparent;
  color: ${theme.colors.white};
  overflow: hidden;
  width: 100%;
  margin: 0 auto;
  align-items: center;
  padding: 80px 0;
  margin-top: 150px;
  margin-bottom: 50px;
  /* border-top: 5px solid ${theme.colors.white};
  border-bottom: 5px solid ${theme.colors.white}; */

  ${maxQuery.tablet} {
    padding: 20px;
  }
`;

const StatisticsDetails = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.5em;
  width: 100%;
  max-width: 1280px;
  padding: 0 40px;

  ${maxQuery.tablet} {
    flex-direction: column;
    align-items: center;
    gap: 40px;
  }
`;

const StatisticsDetail = styled.div`
  text-align: center;
  font-size: 91px;
  background: ${theme.colors.white};
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;

  ${maxQuery.tablet} {
    font-size: 40px;
    margin-bottom: 10px;
  }
`;

const DetailDescription = styled.div`
  text-align: center;
  font-size: 14px;
  /* font-family: 'Dsemi', monospace; */
  color: ${theme.colors.white800};
`;

const StatisticContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

export { StatisticsContainer, StatisticsDetails, StatisticsDetail, DetailDescription, StatisticContainer };
