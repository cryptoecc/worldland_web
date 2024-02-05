import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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

        const filteredData = request.data.filter((data: any) => {
          const day = parseInt(data.date.split('/')[1], 10);
          return day >= 1 && day <= 31;
        });

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
        <LineChart data={nodeCount}>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 14 }}
            tickFormatter={(value, index) => {
              if (index / 3) {
                // if (index % 2 === 0) {
                return `${value}일`;
              } else {
                return '';
              }
            }}
          />
          {/* <XAxis
            dataKey="date"
            tick={{ fontSize: 14 }} // x축 텍스트 색상을 녹색으로 변경
            tickFormatter={(value, index) => {
              if (index % 15 === 0) {
                return `${value}일`;
              } else {
                return '';
              }
            }}
          /> */}
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
          <Line
            type="monotone"
            dataKey="node_count"
            stroke="silver" // 파란색으로 변경
            strokeWidth={3.5}
            dot={false}
            activeDot={{ stroke: 'black', r: 4 }}
            fillOpacity={0}
          />
        </LineChart>
      </ResponsiveContainer>
      <br />
      <br />

      <DetailDescription>
        {/* Active Nodes : Node Counts that have successfully mined more than once on the Worldland Network in 2 Month. */}
        Active Nodes : The number of mining nodes on the Worldland network.
      </DetailDescription>
      <br />
    </ChartContainer>
  );
};

export default MainAreaChart;
