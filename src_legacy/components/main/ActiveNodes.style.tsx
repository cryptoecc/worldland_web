import { theme } from 'style/theme';
import styled from 'styled-components';
import { maxQuery } from 'utils/breakpoints';
import { AreaChart } from 'recharts';

const ChartContainer = styled.div`
  font-family: 'Inter';
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  background: transparent;
  color: ${theme.colors.black};
  overflow: hidden;
  width: 80%;
  margin: 0 auto;
  align-items: center;
  padding: 80px 0;
  margin-top: 150px;
  margin-bottom: 50px;

  ${maxQuery.tablet} {
    padding: 20px;
  }
`;

const CustomAreaChart = styled(AreaChart)`
  width: 100%;
  background: linear-gradient(to bottom, ${theme.colors.gray800}, ${theme.colors.black});
`;

const DetailDescription = styled.div`
  text-align: center;
  font-size: 18px;
  color: ${theme.colors.white80};
`;

export { ChartContainer, CustomAreaChart, DetailDescription };
