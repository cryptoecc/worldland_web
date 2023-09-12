import { FC, useState, useEffect } from 'react';
import Web3 from 'web3';
import { useAccount } from 'wagmi';
import BigNumber from 'bignumber.js';
import { contractABI, contractAddress } from '../../utils/ChainLink_goerli';

import styled from 'styled-components';

interface Props {
  onAccountConnected: (account: string) => void;
}

const StyledButton = styled.button`
  color: #f4f4f4;
  font-family: 'Inter';
  font-size: 14px;
  font-weight: bold;
`;

export const AiDexButton: FC<Props> = ({ onAccountConnected }) => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [latestRound, setLatestRound] = useState('');
  const [answer, setAnswer] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [priceList, setPriceList] = useState<string[]>([]);
  const [predList, setPredList] = useState<string[]>([]);

  const [account, setAccount] = useState<string | null>(null);

  //가격 조회+예측모델로 전송+예측값 받아오기 한 번에 실행
  const handleOneClick = async () => {
    let currentWeb3 = web3;

    if (!currentWeb3 && typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      currentWeb3 = new Web3(window.ethereum);
      setWeb3(currentWeb3);
    }

    if (currentWeb3) {
      try {
        setAccount(account);
      } catch (error) {
        console.error('메타마스크 연결에 실패 : ', error);
      }
    }

    //(1) 가격 가져오기
    if (web3) {
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      try {
        //latestRound 호출
        const roundIDList: string[] = [];

        const result: any = await contract.methods.latestRound().call();
        const roundID = new BigNumber(result);
        const roundID_str = roundID.toString();
        console.log('latestRound :', roundID_str);

        setLatestRound(roundID_str);

        //가장 최근 기준으로 과거 9개의 roundId 삽입
        for (let i = 9; i >= 1; i--) {
          const roundIDMinus = roundID.minus(i);
          roundIDList.push(roundIDMinus.toString());
        }
        roundIDList.push(roundID_str);

        //getAnswer 호출
        const answer = new BigNumber(await (contract.methods.getAnswer as any)(roundID_str).call());
        const BIG_TEN = new BigNumber(10);
        const answer_Big = answer.dividedBy(BIG_TEN.pow(8)).toFixed(2); // 10^8로 나누고, 소수점 두 자리까지
        const answer_str = answer_Big.toString();
        console.log('getAnswer :', answer_str);
        //setAnswer(answer_str);

        //getTimestamp 호출
        const timestamp = new BigNumber(await (contract.methods.getTimestamp as any)(roundID_str).call());

        const date = new Date(timestamp.toNumber() * 1000); //1000곱해서 밀리초로 변환
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        const formattedDate = `${year}년 ${month}월 ${day}일 ${hours}:${minutes}:${seconds}`;

        console.log('getTimestamp :', formattedDate);
        //setTimestamp(formattedDate);

        //10개의 roundId에 대한 가격 데이터
        const tempPriceList: string[] = [];
        for (let i = 0; i < roundIDList.length; i++) {
          try {
            const price = new BigNumber(await (contract.methods.getAnswer as any)(roundIDList[i]).call());
            const price_Big = price.dividedBy(BIG_TEN.pow(8)).toFixed(2);
            const price_str = price_Big.toString();
            tempPriceList.push(price_str);
          } catch (error) {
            console.error(`getAnswer 호출 중 오류 발생한 roundID ${roundIDList[i]}:`, error);
          }
        }
        setPriceList(tempPriceList);
      } catch (error) {
        console.error('호출 중 오류 발생:', error);
      }
    }

    //(2) 예측모델로 가격 정보 보내고, 예측값 가져오기

    //Django 서버의 PredictView URL
    let url = 'http://52.79.47.70:8000/predict/?';
    //let url = "http://localhost:8000/predict/?";

    //priceList의 10개의 값을 쿼리 파라미터로 추가
    if (priceList && priceList.length > 0) {
      priceList.forEach((price, index) => {
        url += `&input_data_${index}=${price}`;
      });
    }

    //fetch로 GET요청
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data) {
        const tempPredList = data.prediction;
        setPredList(tempPredList);
      }
    } catch (error) {
      console.error('예측 모델 요청 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    // 컴포넌트가 마운트될 때 로컬 스토리지에서 계정 정보 불러오기
    const storedAccount = localStorage.getItem('connectedAccount');
    if (storedAccount) {
      setAccount(storedAccount);
    }
  }, []);

  useEffect(() => {
    handleOneClick();
  }, [predList[0]]);

  return (
    <div>
      <StyledButton onClick={handleOneClick}>
        Predict
        {String(predList[0]) === '1051.24' ? '' : <p>{predList[0]}</p>}
      </StyledButton>
    </div>
  );
};
