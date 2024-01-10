import React, { useState, useRef, useEffect, useCallback } from 'react';
import CountUp from 'react-countup';
import { web3 } from '../web3/useWeb3';
import axios from 'axios';

import {
  StatisticsContainer,
  StatisticsDetails,
  StatisticsDetail,
  DetailDescription,
  StatisticContainer,
} from './MainStatistics.style';

function MainStatistics() {
  const [time, setTime] = useState<number>(0);
  const [totalBlocks, setTotalBlocks] = useState<number>(0);
  const [totalWalletCount, setTotalWalletCount] = useState<number>(0);
  const statisticsRef = useRef<HTMLDivElement>(null);

  const formatValue = (value: number) => {
    return `${value.toFixed(1)}s`;
  };

  const listAccount = async () => {
    const response = await axios.post(
      `https://scan.worldland.foundation/api?module=account&action=listaccounts&offset=700`,
    );

    const response2 = response.data.result.length;
    setTotalWalletCount(response2);
  };

  const fetchBlockData = useCallback(async () => {
    try {
      // Total Blocks
      // const [latestBlockNumber, listBlock] = await Promise.all([
      //   await web3.eth.getBlockNumber(),
      //   await axios.post(`https://scan.worldland.foundation/api?module=account&action=listaccounts&offset=500`),

      //   // await web3.eth.getBlock(latestBlockNumber),
      // ]);
      const latestBlockNumber = await web3.eth.getBlockNumber();
      // console.log('@블록번호', latestBlockNumber);
      // const response = listBlock.data.result.length;
      // setTotalWalletCount(response);
      setTotalBlocks(Number(latestBlockNumber));

      // Average Block Time
      const latestBlock = await web3.eth.getBlock(latestBlockNumber);
      const startBlock = await web3.eth.getBlock(Number(latestBlockNumber) - 7200);
      const averageTime = (Number(latestBlock.timestamp) - Number(startBlock.timestamp)) / 7200;

      // Update "time" state only if it's different from the current value
      if (time !== averageTime) {
        setTime(averageTime);
      }
    } catch (error) {
      console.log('Error fetching block data:', error);
    }
  }, [time]);

  useEffect(() => {
    const interval = setInterval(fetchBlockData, 1000);

    // Initial fetch
    fetchBlockData();
    listAccount();

    return () => clearInterval(interval);
  }, [fetchBlockData]);

  return (
    <StatisticsContainer ref={statisticsRef}>
      <StatisticsDetails>
        <StatisticContainer>
          <StatisticsDetail>
            <CountUp end={time} duration={0.5} decimals={1} formattingFn={formatValue} />
          </StatisticsDetail>
          <DetailDescription>Average Block Time</DetailDescription>
        </StatisticContainer>
        <StatisticContainer>
          <StatisticsDetail>
            <CountUp end={totalBlocks} duration={0.5} />
          </StatisticsDetail>
          <DetailDescription>Block Numbers</DetailDescription>
        </StatisticContainer>
        <StatisticContainer>
          <StatisticsDetail>
            <CountUp end={totalWalletCount} duration={0.5} />
          </StatisticsDetail>
          <DetailDescription>Total Wallet Count</DetailDescription>
        </StatisticContainer>
      </StatisticsDetails>
    </StatisticsContainer>
  );
}

export default MainStatistics;
