import React, { useEffect, useState } from 'react';
import { useNodeCount } from 'hooks/useNodeCount';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { theme } from 'style/theme';
import { ChartContainer, CustomAreaChart, DetailDescription } from './ActiveNodes.style';
import axios from 'axios';
import { useCodeWord } from 'hooks/useCodeWord';

interface DataItem {
  id: number;
  date: string;
  node_count: number;
}

const MainAreaChart = () => {
  const [nodeCount, setNodeCount] = useState();
  const { nodeCounts, loading, error } = useNodeCount();
  const { codeWord } = useCodeWord();
  console.log(codeWord);

  useEffect(() => {
    const fetchNodeCount = async () => {
      if (nodeCounts) {
        const request = nodeCounts.filter((data: any) => {
          const day = parseInt(data.date.split('/')[1], 10);
          return day >= 1 && day <= 31;
        });
        setNodeCount(request);
      }
    };
    fetchNodeCount();
  }, [nodeCounts]);

  return (
    <ChartContainer>
      <DetailDescription>Active Nodes</DetailDescription>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={nodeCount}>
          <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={(value) => `${value}`} />
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
        Active Nodes : Active nodes are a number of nodes which have successfully mined at least once in seven days.
        {/* Active Nodes : The number of mining nodes on the Worldland network. */}
      </DetailDescription>
      <br />
    </ChartContainer>
  );
};

export default MainAreaChart;
