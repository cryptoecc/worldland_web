import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LabelList } from 'recharts';
import { web3 } from '../web3/useWeb3';
import styled from 'styled-components';
import { Space, Spin } from 'antd';

const LOGGER = console.log;

interface MinerFreq {
  address: string;
  value: number;
}

function BarCharts() {
  const [block_data, setBlockData] = useState<MinerFreq[]>([]);
  const [uniqueAccountCount, setUniqueAccountCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [topMiner, setTopMiner] = useState<MinerFreq | null>(null);

  const AddressInfo = async () => {
    const a = await web3?.eth?.getBlockNumber();
    const array: MinerFreq[] = [];
    const minerSet = a ? new Set<string>() : null;

    for (let i = 0; i < 500; i++) {
      const blockNumber = a ? Number(a) - i : 0;
      const data = await web3?.eth?.getBlock(blockNumber);
      const minerAddress = data.miner;

      if (minerSet && !minerSet.has(minerAddress)) {
        array.push({
          address: minerAddress,
          value: 1,
        });
        minerSet.add(minerAddress);
      } else if (minerSet) {
        const existingIndex = array.findIndex((item) => item.address === minerAddress);
        if (existingIndex !== -1) {
          array[existingIndex].value++;
        }
      }
    }

    array.sort((a, b) => b.value - a.value);

    setBlockData(array);
    setUniqueAccountCount(minerSet ? minerSet.size : 0);
    setTopMiner(array.length > 0 ? array[0] : null);
    setLoading(false); // 데이터 로딩이 완료되면 loading 상태를 false로 업데이트
  };

  useEffect(() => {
    AddressInfo();
  }, []);

  console.log(`@barchart`, block_data);

  return (
    <div>
      <Space size="large">
        {loading ? ( // loading 상태에 따라 로딩 메시지 또는 그래프를 표시
          <Spin />
        ) : (
          <div>
            <BarChart width={600} height={400} data={block_data}>
              <text x={300} y={30} textAnchor="middle" dominantBaseline="middle" fontSize={18} fill="white">
                Recently Miner For 12h
              </text>
              <XAxis dataKey="address" angle={-45} textAnchor="end" />
              <YAxis />
              <Tooltip />
              <CartesianGrid stroke="black" strokeDasharray="3 3" />
              <Bar dataKey="value" fill="#8884d8">
                <LabelList dataKey="value" position="top" content={<></>} />
              </Bar>
            </BarChart>
            {topMiner && (
              <text style={{ color: 'white' }}>
                Top Miner: {topMiner.address} (Count: {topMiner.value})
              </text>
            )}
            <text style={{ color: 'white' }}>Total Unique Accounts: {uniqueAccountCount}</text>
          </div>
        )}
      </Space>
    </div>
  );
}

export default BarCharts;
