import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import { styled } from 'styled-components';
import { CgClose } from 'react-icons/cg';
import { AiOutlineArrowDown, AiOutlineQuestionCircle } from 'react-icons/ai';
import { selectList } from 'constants/select';
import { IoCloseSharp } from 'react-icons/io5';
import { createElement, useEffect, useState } from 'react';
import { useAccount, useContractWrite } from 'wagmi';
import { from_wei, putCommaAtPrice, setDeadline, to_wei } from 'utils/util';
import { MAPNETTOADDRESS } from 'configs/contract_address_config';
import { ABI, CONTRACT_ADDRESSES, FUNCTION } from 'utils/enum';
import { MAP_STR_ABI } from 'configs/abis';
import { gasLimit } from 'utils/wagmi';

interface IDisabled {
  approve?: boolean;
  remove?: boolean;
}

const RemoveLiquidityModal = ({ close, selectedPair, allowance, handleApprove }: IRemoveLiquidity) => {
  const { address } = useAccount();
  const [value, setValue] = useState<number>(30);
  const customValues = [25, 50, 75, 100];
  const [disabled, setDisabled] = useState<IDisabled>({ approve: true, remove: true });

  const { data: liquidityRemovalData, write: removeLiquidity } = useContractWrite({
    address: MAPNETTOADDRESS[CONTRACT_ADDRESSES.ROUTER],
    abi: MAP_STR_ABI[ABI.LVSWAPV2_ROUTER],
    functionName: FUNCTION.REMOVELIQUIDITY,
    gas: gasLimit,
    onSuccess(data) {
      console.log({ removalLiquidity: data });
    },
    onError(err) {
      console.log({ removalLiquidity: err });
    },
  });

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  };

  async function handleRemoveLiquidity() {
    let calcLiquidityPercentageToAmount = ((parseFloat(from_wei(selectedPair?.balance)) / 100) * value).toString();
    console.log({ REMOVALAMOUNT: to_wei(calcLiquidityPercentageToAmount) });
    let deadline = await setDeadline(3600);
    console.log('@selected', selectedPair?.token0);
    console.log('@selected', selectedPair?.token1);
    removeLiquidity({
      args: [
        selectedPair?.token0,
        selectedPair?.token1,
        to_wei(calcLiquidityPercentageToAmount),
        to_wei('1'),
        to_wei('1'),
        address,
        deadline,
      ],
    });
  }

  useEffect(() => {
    console.log({
      ALLOWANCE: Math.floor(parseFloat(from_wei(allowance))),
      BALANCE: Math.floor(parseFloat(from_wei(selectedPair?.balance as string))),
    });
    if (Math.floor(parseFloat(from_wei(selectedPair?.balance as string))) === 0) {
      // user has 0 of LP token balance
      setDisabled(() => ({
        approve: true,
        remove: true,
      }));
    } else if (
      Math.floor(parseFloat(from_wei(allowance))) < Math.floor(parseFloat(from_wei(selectedPair?.balance as string)))
    ) {
      // if allowance is less than user's pair balance
      setDisabled(() => ({
        approve: false,
        remove: true,
      }));
    } else if (
      Math.floor(parseFloat(from_wei(allowance))) >= Math.floor(parseFloat(from_wei(selectedPair?.balance as string)))
    ) {
      // if allowance is more than user's pair balance
      setDisabled(() => ({
        approve: true,
        remove: false,
      }));
    }
  }, [allowance, selectedPair, liquidityRemovalData]);

  return (
    <Container>
      <div className="header">
        <IoCloseSharp onClick={() => close(false)} color="#b4b4b4" size={25} style={{ cursor: 'pointer' }} />
        <h1>Remove liquidity</h1>
        <AiOutlineQuestionCircle color="#b4b4b4" size={15} style={{ cursor: 'pointer' }} />
      </div>
      <section className="first-element">
        <div className="inner-wrap-row">
          <p className="tab">Amount</p>
          <p className="tab">Detailed</p>
        </div>
        <div className="inner-wrap-column">
          <h1>{value}%</h1>
          <Box sx={{ width: '100%', maxWidth: 320 }}>
            <Slider aria-label="Volume" value={value} onChange={handleChange} />
          </Box>
          <div className="percentage-box">
            {customValues.map((el, i) => (
              <span onClick={() => setValue(el)} key={i}>
                {el === 100 ? 'Max' : `${el}%`}
              </span>
            ))}
          </div>
        </div>
      </section>
      <AiOutlineArrowDown color="#b4b4b4" size={15} style={{ cursor: 'pointer' }} />
      <section className="second-element">
        <div className="inner-wrap">
          <p className="price">{putCommaAtPrice(selectedPair?.pooledA ? selectedPair?.pooledA : 0, 5)}</p>
          <div className="coin-info-wrap">
            {createElement(selectList[0].tokenIcon)}
            <p>{selectList[0].token}</p>
          </div>
        </div>
        <div className="inner-wrap">
          <p className="price">{putCommaAtPrice(selectedPair?.pooledB ? selectedPair?.pooledB : 0, 5)}</p>
          <div className="coin-info-wrap">
            {createElement(selectList[1].tokenIcon)}
            <p>{selectList[1].token}</p>
          </div>
        </div>
      </section>
      <section className="third-element">
        <p className="price">Price: </p>
        <div className="rate-wrap">
          <p className="token">1 DAI = {putCommaAtPrice(from_wei(selectedPair?.BtoA), 5)} ETH</p>
          <p className="token">1 ETH = {putCommaAtPrice(from_wei(selectedPair?.AtoB), 5)} DAI</p>
        </div>
      </section>
      <section className="btn-wrap">
        <button onClick={handleApprove} disabled={disabled['approve']}>
          Approve
        </button>
        <button onClick={handleRemoveLiquidity} disabled={disabled['remove']}>
          Remove
        </button>
      </section>
    </Container>
  );
};

export default RemoveLiquidityModal;

const Container = styled.section`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  border: 1px solid #2e374f;
  border-radius: 15px;
  background-color: #0e111c;
  position: absolute;
  z-index: 999;
  width: 100%;
  max-width: 400px;
  gap: 10px;
  font-weight: 700;
  height: 100%;
  max-height: 650px;
  font-family: 'Nunito Sans', sans-serif;
  padding: 10px 0 0 0;
  opacity: 0.9;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin: 20px 0;
    padding: 0 20px;

    h1 {
      color: #ffffff;
      font-size: 20px;
      font-weight: 600;
    }
  }
  .first-element {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 34px;
    padding: 20px;
    flex-direction: column;
    width: 90%;
    border: 1px solid rgb(255, 255, 255, 0.1);
    border-radius: 15px;

    .inner-wrap-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;

      .tab {
        color: #ffffff;
      }
    }
    .inner-wrap-column {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 24px;
      flex-direction: column;
      width: 100%;
      h1 {
        color: #ffffff;
        font-size: 52px;
        width: 100%;
        text-align: left;
      }

      .percentage-box {
        display: flex;
        align-items: center;
        justify-content: space-around;
        gap: 10px;
        width: 100%;
        span {
          background-color: rgb(58, 113, 221, 0.2);
          color: rgb(58, 113, 221);
          padding: 10px;
          border-radius: 8px;
          cursor: pointer;
        }
      }
    }
  }
  .second-element {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    padding: 20px;
    flex-direction: column;
    width: 90%;
    border: 1px solid rgb(255, 255, 255, 0.1);
    border-radius: 15px;

    .inner-wrap {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      .price {
        color: #ffffff;
        font-size: 25px;
      }
      .coin-info-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        p {
          color: #ffffff;
          font-size: 25px;
        }
        img {
          width: 25px;
          height: 25px;
        }
      }
    }
  }
  .third-element {
    display: flex;
    align-items: top;
    justify-content: space-between;
    padding: 20px 10px 0;
    width: 90%;

    .price {
      color: #b4b4b4;
    }

    .rate-wrap {
      text-align: right;
      color: #b4b4b4;
      line-height: 20px;
    }
  }
  .btn-wrap {
    display: flex;
    align-items: top;
    justify-content: space-between;
    width: 90%;
    padding: 20px 0;

    button {
      padding: 15px;
      width: 100%;
      max-width: 170px;
      border-radius: 10px;
      color: #ffffff;
      font-weight: 600;
      font-size: 16px;
      cursor: pointer;
      background-color: rgb(58, 113, 221);

      &:disabled {
        background-color: rgb(66, 68, 78, 0.5);
        color: rgb(255, 255, 255, 0.1);
        cursor: not-allowed;
      }
    }
  }
`;
