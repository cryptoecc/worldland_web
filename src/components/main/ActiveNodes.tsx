import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { theme } from 'style/theme';
import { ChartContainer, CustomAreaChart, DetailDescription } from './ActiveNodes.style';
import axios from 'axios';

interface DataItem {
  id: number;
  date: string;
  node_count: number;
}

const MainAreaChart = () => {
  const [nodeCount, setNodeCount] = useState();

  useEffect(() => {
    const getNodeCount = async () => {
      try {
        const request = await axios.get('https://be.worldland.foundation/api/node/count');
        console.log(request.data);

        const filteredData = request.data.filter((data: any) => {
          const day = parseInt(data.date.split('/')[1], 10);
          return day === 15 || day === 30;
        });

        console.log('gd', filteredData);

        setNodeCount(filteredData);
      } catch (error) {
        console.error('데이터 가져오기 오류', error);
      }
    };

    getNodeCount();
  }, []);

  return (
    <ChartContainer>
      <DetailDescription>Active Nodes</DetailDescription>

      <ResponsiveContainer width="100%" height={300}>
        <CustomAreaChart data={nodeCount}>
          <XAxis dataKey="date" tick={{ fontSize: 14 }} tickFormatter={(value) => `${value}일`} />
          <YAxis dataKey="node_count" tick={{ fontSize: 14 }} tickFormatter={(value) => `${value}`} />
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
            dataKey="node_count"
            stroke="gray"
            strokeWidth={3.5}
            fill="url(#areaColor)"
            dot={false}
            activeDot={{ stroke: 'black', r: 4 }}
          />
        </CustomAreaChart>
      </ResponsiveContainer>
      <br />
      <br />

      <DetailDescription>
        Active Nodes : Node Counts that have successfully mined more than once on the Worldland Network in 7days.
      </DetailDescription>
      <br />
    </ChartContainer>
  );
};

export default MainAreaChart;
