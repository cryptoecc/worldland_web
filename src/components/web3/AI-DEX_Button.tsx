import { FC, useState, useEffect } from 'react';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import { contractABI, contractAddress } from '../../utils/ChainLink_goerli';
import { MAP_STR_ABI } from '../../configs/abis';
import { ABI, CHAINDS, CONTRACT_ADDRESSES, FUNCTION, Field } from '../../utils/enum';
import { WLD_ADDRESSES } from 'configs/contract_addresses';
import { Spin, Space } from 'antd';
import styled from 'styled-components';
import { MAPNETTOADDRESS } from 'configs/contract_address_config';
import { web3_eth } from 'configs/web3-eth';
import { web3_wld } from 'configs/web3-wld';

interface Props {
  onAccountConnected: (account: string) => void;
}

const StyledButton = styled.button`
  display: flex;
  width: 200px;
  color: #ffffff;
  font-family: 'Inter';
  font-size: 14px;
  font-weight: bold;
  justify-content: space-around;

  :hover {
    cursor: pointer;
  }
`;

export const AiDexButton: FC<Props> = ({ onAccountConnected }) => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [latestRound, setLatestRound] = useState('');
  const [loading, setLoading] = useState(false);
  const [txloading, setTxloading] = useState(false);
  // const [priceList, setPriceList] = useState<string[]>([]);
  const [amountOut, setAmountOut] = useState('');
  const [predPrice, setPredPrice] = useState();

  const [account, setAccount] = useState<string | null>(null);

  // 렌더링 시 chainlink에서 가격 가져오기
  useEffect(() => {
    getData();
    let sepolia_web3 = web3_eth; //testnet
    setWeb3(sepolia_web3);

    if (sepolia_web3) {
      try {
        setAccount(account);
      } catch (error) {
        console.error('메타마스크 연결에 실패 : ', error);
      }
    }
    const interval = setInterval(() => {
      getData();
    }, 60000);

    return () => clearInterval(interval);
  }, [web3]);

  // useEffect(() => {
  //   getData();
  //   const interval = setInterval(() => {
  //     getData();
  //   }, 35000)

  //   return () => clearInterval(interval)
  // }, [])

  const getData = async () => {
    //(1) 가격 가져오기
    if (web3) {
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      try {
        //latestRound 호출

        const roundIDList: string[] = [];
        console.log('여기');
        const result: any = await contract.methods.latestRound().call();
        console.log('1 :', result);
        const roundID = new BigNumber(result);
        console.log('2 :', roundID);
        const roundID_str = roundID.toString();
        console.log('latestRound :', roundID_str);

        setLatestRound(roundID_str);

        //가장 최근 기준으로 과거 9개의 roundId 삽입
        for (let i = 9; i >= 1; i--) {
          const roundIDMinus = roundID.minus(i);
          console.log({ roundIDMinus });
          roundIDList.push(roundIDMinus.toString());
        }
        roundIDList.push(roundID_str);

        //getAnswer 호출
        const answer = new BigNumber(await (contract.methods.getAnswer as any)(roundID_str).call());
        const BIG_TEN = new BigNumber(10);
        const answer_Big = answer.dividedBy(BIG_TEN.pow(8)).toFixed(2); // 10^8로 나누고, 소수점 두 자리까지
        const answer_str = answer_Big.toString();
        console.log('언제냐 getAnswer :', answer_str);
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
        console.log('roundlist', roundIDList);
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
        console.log('templist다', tempPriceList);
        fetchData(tempPriceList);
        setLoading(false);
      } catch (error) {
        console.error('호출 중 오류 발생:', error);
      }
    }
  };

  //(2) 예측모델로 가격 정보 보내고, 예측값 가져오기
  const fetchData = async (priceList: string[]) => {
    // txloading spinner
    setTxloading(true);

    //Django 서버의 PredictView URL
    console.log(priceList);

    // let url = 'http://13.125.45.171:8000/predict/?';
    let url = 'https://aim.worldland.foundation/?';
    // let url = 'http://52.79.47.70:8000/predict/?';
    //let url = "http://localhost:8000/predict/?";

    //priceList의 10개의 값을 쿼리 파라미터로 추가
    if (priceList && priceList.length > 0) {
      priceList.forEach((price, index) => {
        url += `&input_data_${index}=${price}`;
      });
    }

    console.log(url);
    //fetch로 GET요청
    try {
      const response = await fetch(url);
      console.log(response);
      const data = await response.json();
      console.log(data);
      if (data) {
        console.log('123');
        const tempPredList = data.prediction;
        console.log(tempPredList);

        await sendTransaction(tempPredList);

        // setLoading(true);
      }
    } catch (error) {
      console.error('예측 모델 요청 중 오류 발생:', error);
    }
  };

  // 모델 값 트랜잭션 보내기
  const sendTransaction = async (tempPredList: any) => {
    let worldland_web3 = web3_wld;
    if (worldland_web3) {
      const contract = await new worldland_web3.eth.Contract(
        MAP_STR_ABI[ABI.LVSWAPV2_ROUTER],
        MAPNETTOADDRESS[CONTRACT_ADDRESSES.ROUTER],
      );
      const accounts = await worldland_web3.eth.getAccounts();
      console.log('계정 :', accounts);

      const privateKey = process.env.REACT_APP_PRIVATE_KEY;

      const account: string = process.env.REACT_APP_ACCOUNT as string;

      // const token0 = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6';
      const token0 = WLD_ADDRESSES[CONTRACT_ADDRESSES.ETH_TOKEN_ADDRESS]; // eth token address
      const token1 = WLD_ADDRESSES[CONTRACT_ADDRESSES.DAI_TOKEN_ADDRESS];
      const BlockNumber = await worldland_web3.eth.getBlockNumber();
      let PredictedPrice = [];
      for (let i = 0; i < 10; i++) {
        PredictedPrice.push(worldland_web3.utils.toWei(Number([tempPredList[i]]), 'ether'));
      }
      let nonce = await worldland_web3.eth.getTransactionCount(account);
      console.log({ nonce });
      const txObject = {
        from: account,
        to: MAPNETTOADDRESS[CONTRACT_ADDRESSES.ROUTER],
        data: (contract.methods.setMarketPricesAtPool as any)(token0, token1, BlockNumber, PredictedPrice).encodeABI(),
        gasPrice: '100000000000',
        gas: 3000000,
        nonce: nonce,
      };

      try {
        if (privateKey) {
          const signedTx = await worldland_web3.eth.accounts.signTransaction(txObject, privateKey);
          const receipt = await worldland_web3.eth.sendSignedTransaction(signedTx.rawTransaction);
          console.log('Transaction Hash', receipt.transactionHash);
        } else {
          console.error('개인 키가 정의되어 있지 않습니다');
        }

        let amountIn = worldland_web3.utils.toWei(1, 'ether');
        console.log('@address error? ', MAP_STR_ABI[ABI.UNISWAPV2_ROUTER], WLD_ADDRESSES[CONTRACT_ADDRESSES.ROUTER]);

        const response = await (contract.methods.getAmountOut as any)(
          MAPNETTOADDRESS[CONTRACT_ADDRESSES.FACTORY],
          amountIn,
          WLD_ADDRESSES[CONTRACT_ADDRESSES.ETH_TOKEN_ADDRESS],
          WLD_ADDRESSES[CONTRACT_ADDRESSES.DAI_TOKEN_ADDRESS],
        ).call();

        console.log('amountsOut :', response);
        const fromwei = worldland_web3.utils.fromWei(response, 'ether');

        const amount = Number(fromwei).toFixed(7);
        console.log('fromwei : ', amount);

        // setPredList(fromwei);
        setPredPrice(tempPredList[0]);
        setAmountOut(amount);
        setTxloading(false);
      } catch (e) {
        console.error(e);
      }
    }
  };

  //가격 조회+예측모델로 전송+예측값 받아오기 한 번에 실행
  const handleOneClick = async () => {
    if (!loading) {
      getData();
    } else {
      console.log('error');
    }
  };

  useEffect(() => {
    // 컴포넌트가 마운트될 때 로컬 스토리지에서 계정 정보 불러오기
    const storedAccount = localStorage.getItem('connectedAccount');
    if (storedAccount) {
      setAccount(storedAccount);
    }
  }, []);

  // const antIcon = <LoadingOutlined style={{ fontSize: 25 }} spin />;

  return (
    <div>
      <StyledButton onClick={handleOneClick}>
        {txloading == true ? (
          <Space size="large">
            <Spin />
          </Space>
        ) : (
          <div></div>
        )}
        {/* 
        {amountOut !== '' ? (
          <div>
            AmountOut
            {amountOut === '' ? '' : <p>{amountOut}</p>}
          </div>
        ) : (
          <div></div>
        )} */}
      </StyledButton>
    </div>
  );
};
