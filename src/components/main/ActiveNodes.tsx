import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { theme } from 'style/theme';
import { ChartContainer, CustomAreaChart, DetailDescription } from './ActiveNodes.style';

const data = [
  { day: '', Miner_Nodes: 44 },
  { day: '', Miner_Nodes: 42 },
  { day: '', Miner_Nodes: 39 },
  { day: '', Miner_Nodes: 40 },
  { day: '', Miner_Nodes: 38 },
  { day: '', Miner_Nodes: 41 },
];

const MainAreaChart = () => {
  return (
    <ChartContainer>
      <CustomAreaChart width={1200} height={300} data={data}>
        <XAxis dataKey="day" />
        <YAxis dataKey="Miner_Nodes" />
        <CartesianGrid stroke="none" />
        <Tooltip />
        <Legend />
        <defs>
          <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={theme.colors.white} />
            <stop offset="100%" stopColor={theme.colors.black} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="Miner_Nodes"
          stroke="gray"
          strokeWidth={3.5}
          fill="url(#areaColor)"
          dot={false}
          activeDot={{ stroke: 'white', r: 4 }}
        />
      </CustomAreaChart>
      <br />
      {/* <DetailDescription>Active Nodes</DetailDescription> */}
    </ChartContainer>
  );
};

export default MainAreaChart;
