import { ChangeEvent, useEffect, useState } from 'react';
import { styled } from 'styled-components';
import BigNumber from 'bignumber.js';
import { contractABI, contractAddress } from '../../utils/ChainLink_goerli';
import { MAP_STR_ABI } from 'configs/abis';
import { ABI, CONTRACT_ADDRESSES } from '../../utils/enum';
import Web3, { TransactionWithFromAndToLocalWalletIndex } from 'web3';
import { WLD_ADDRESSES } from 'configs/contract_addresses';
import { Spin, Space } from 'antd';
import { web3_eth } from 'configs/web3-eth';
import { web3_wld } from 'configs/web3-wld';
import { MAPNETTOADDRESS } from 'configs/contract_address_config';
import { useToasts } from 'react-toast-notifications';
import { useAccount, useContractWrite, useContractRead, useContractReads } from 'wagmi';
import { gasLimit } from 'utils/wagmi';

const Container = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100vh;
  position: relative;
`;

const InputWrapper = styled.div`
  margin: 10px; /* 입력란 간의 간격 조정 */
  display: flex;
`;

const InputBox = styled.input`
  margin-right: 10px; /* 입력란 간의 간격 조정 */
`;

const CommonDiv = styled.div`
  margin: 10px; /* 입력란 간의 간격 조정 */
  color: white;
`;

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  width: 200px;
  height: 30px;
  color: #ffffff;
  font-family: 'Inter';
  font-size: 14px;
  font-weight: bold;
  justify-content: space-around;
  background-color: gray;

  :hover {
    cursor: pointer;
    background-color: #4b4949;
  }
`;

const TestPage = () => {
  const { address } = useAccount();
  const { addToast } = useToasts();
  const [inputValues, setInputValues] = useState(Array(10).fill(''));
  const [priceValues, setPriceValues] = useState(Array(10).fill(''));
  const [txloading, setTxloading] = useState(false);
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [latestRound, setLatestRound] = useState('');
  const [loading, setLoading] = useState(false);
  const [priceList, setPriceList] = useState<string[]>([]);
  const [predPrice, setPredPrice] = useState();
  // const [account, setAccount] = useState();
  const [timestamp, setTimestamp] = useState('');
  const [isButtonVisible, setIsButtonVisible] = useState<boolean>(false);

  const ethereumProvider = window.ethereum;

  async function connectToMetamask() {
    if (ethereumProvider) {
      try {
        // Metamask와 연결 요청
        await ethereumProvider.request({ method: 'eth_requestAccounts' });

        // Metamask로부터 Web3 인스턴스 생성
        const web3 = new Web3(ethereumProvider);

        // 연결 확인 및 사용자 주소 가져오기
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
          const userAddress = accounts[0];
          // setAccount(userAddress);
          return web3; // Metamask와 연결된 Web3 인스턴스 반환
        } else {
          console.error('Metamask로부터 사용자 주소를 가져올 수 없습니다.');
          return null;
        }
      } catch (error) {
        console.error('Metamask 연결 중 오류 발생:', error);
        return null;
      }
    } else {
      console.error('Metamask가 설치되지 않았거나 사용할 수 없습니다.');
      return null;
    }
  }

  const setInputValuesFromTempList = () => {
    setInputValues([...priceList.slice(0, 10)]);
  };

  // console.log(account);
  const getData = async () => {
    //(1) 가격 가져오기
    if (web3) {
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      try {
        //latestRound 호출
        const roundIDList: string[] = [];
        const result: any = await contract.methods.latestRound().call();
        const roundID = new BigNumber(result);
        const roundID_str = roundID.toString();

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

        setLoading(false);
      } catch (error) {
        console.error('호출 중 오류 발생:', error);
      }
    }
  };

  //(2) 예측모델로 가격 정보 보내고, 예측값 가져오기
  const fetchData = async () => {
    let url = 'https://aim.worldland.foundation/?';

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
        setPriceValues(tempPredList);

        setLoading(false);

        // await sendTransaction(tempPredList);
      }
    } catch (error) {
      console.error('예측 모델 요청 중 오류 발생:', error);
    }
  };
  const sendTransaction = async (priceValues: any) => {
    let worldland_web3 = web3_wld;

    if (worldland_web3) {
      const contract = new worldland_web3.eth.Contract(
        MAP_STR_ABI[ABI.LVSWAPV2_ROUTER],
        MAPNETTOADDRESS[CONTRACT_ADDRESSES.ROUTER],
      );

      const token0 = WLD_ADDRESSES[CONTRACT_ADDRESSES.ETH_TOKEN_ADDRESS]; // eth token address
      const token1 = WLD_ADDRESSES[CONTRACT_ADDRESSES.DAI_TOKEN_ADDRESS];
      const BlockNumber = await worldland_web3.eth.getBlockNumber();

      let PredictedPrice = [];
      for (let i = 0; i < 10; i++) {
        PredictedPrice.push(worldland_web3.utils.toWei(Number([priceList[i]]), 'ether'));
      }

      try {
        setMarketPrice({
          args: [token0, token1, BlockNumber, PredictedPrice],
        });
      } catch (error: any) {
        console.error('트랜잭션을 보내는 중에 오류 발생:', error);
      }
    }
  };

  const { write: setMarketPrice } = useContractWrite({
    address: MAPNETTOADDRESS[CONTRACT_ADDRESSES.ROUTER],
    abi: MAP_STR_ABI[ABI.LVSWAPV2_ROUTER],
    functionName: 'setMarketPricesAtPool',
    gas: gasLimit,
    onSuccess(data) {
      console.log({ setMarketPrice: data });
    },
    onError(err) {
      window.alert('트랜잭션을 보내는 중에 오류 발생: ' + err.message.substring(0, 103));
      addToast('트랜잭션 처리 중 오류가 발생했습니다.', {
        appearance: 'error', // 오류 메시지 스타일
        autoDismiss: true, // 자동 닫기
      });
      console.log({ setMarketPrice: err });
    },
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      const newPriceValues = [...priceValues];
      newPriceValues[index] = value;
      setPriceValues(newPriceValues);
    }
  };

  //가격 조회+예측모델로 전송+예측값 받아오기 한 번에 실행
  const handleOneClick = async () => {
    if (!loading) {
      fetchData();
    } else {
      console.log('error');
    }
  };

  // 렌더링 시 chainlink에서 가격 가져오기
  useEffect(() => {
    setLoading(true);
    getData();
    connectToMetamask();
    let sepolia_web3 = web3_eth; //testnet
    setWeb3(sepolia_web3);
    if (sepolia_web3) {
      try {
        // setAccount(account);
      } catch (error) {
        console.error('메타마스크 연결에 실패 : ', error);
      }
    }
  }, [web3]);

  return (
    <Container>
      <CommonDiv color="white">
        <br />
        테스트 목적
        <br />
        <br /> AI-Swap SmartContract를 배포한 계정만
        <br />
        <br /> AI-Predicted Price를 기반으로 시장가격을 설정할 수 있고
        <br />
        <br /> 다른계정일 경우 시장가격을 설정할 수 없습니다.
        <br />
        <br /> 기대결과 :
        <br />
        <br />
        트랜잭션을 보내는 중에 오류 발생: Returned error: execution reverted: caller is not owner
        <br />
        <br />
        <br /> Test setting
        <br />
        <br />
        <a
          href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
          target="_blank"
          style={{ color: 'white', textDecoration: 'none' }}
          rel="noreferrer"
        >
          1. 메타마스크 설치 및 계정생성 Link
        </a>
        <br />
        <br /> 2. 우측 상단 Connect 버튼으로 메타마스크 연동
        <br />
      </CommonDiv>
      <br />

      <CommonDiv color="white"></CommonDiv>

      {Array.from({ length: 2 }, (_, rowIndex) => (
        <InputWrapper key={rowIndex}>
          {Array.from({ length: 5 }, (_, colIndex) => {
            const index = rowIndex * 5 + colIndex;
            return (
              <InputBox
                key={index}
                type="text"
                placeholder={`Market Price ${index + 1}`}
                value={inputValues[index]}
                onChange={(e) => handleInputChange(e, index)}
              />
            );
          })}
        </InputWrapper>
      ))}
      <StyledButton onClick={setInputValuesFromTempList}>
        {loading === true ? (
          <Space size="large">
            <Spin />
          </Space>
        ) : (
          <div>
            1. 현재 시장가 버튼
            {predPrice === '' ? '' : <p>{predPrice}</p>}
          </div>
        )}
      </StyledButton>
      <br />
      {Array.from({ length: 2 }, (_, rowIndex) => (
        <>
          <InputWrapper key={rowIndex}>
            {Array.from({ length: 5 }, (_, colIndex) => {
              const index = rowIndex * 5 + colIndex;
              return (
                <InputBox
                  key={index}
                  type="text"
                  placeholder={`Predicted Price ${index + 1}`}
                  value={priceValues[index]}
                  onChange={(e) => handleInputChange(e, index)}
                />
              );
            })}
          </InputWrapper>
        </>
      ))}
      <StyledButton onClick={() => handleOneClick()}>
        <div>2. AI 가격 예측 버튼</div>
      </StyledButton>
      <br />
      <StyledButton onClick={sendTransaction}>3. 예측된 시장가 입력</StyledButton>
      {/* <StyledButton onClick={connectToSepoliaNetwork}>ds</StyledButton> */}
    </Container>
  );
};

export default TestPage;
