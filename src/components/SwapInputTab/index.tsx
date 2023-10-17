import styled from 'styled-components';
import { IoMdSettings } from 'react-icons/io';
import { BiChevronDown } from 'react-icons/bi';
import { BsFillArrowDownSquareFill } from 'react-icons/bs';
import { crypto_list } from 'data';
import { Field } from '../../utils/enum';
import Web3Button from 'components/web3/Web3Button';
import { AiDexButton } from 'components/web3/AI-DEX_Button';
import { useEffect, useState } from 'react';
import { AiSwapButton } from 'components/web3/AI-SWAP_Button';
import { from_wei, putCommaAtPrice } from 'utils/util';

const SwapInputTab = ({
  input,
  output,
  open,
  inputHandler,
  selectedToken,
  selected2Token,
  openModalForFirstInput,
  openModalForSecondInput,
  btnState,
  disabled,
  spotlightToken,
  funcExec
}: SwapInputTabProps) => {

  return (
    <Container>
      <ul>
        <li>Swap</li>
        <li>Buy</li>
        <li>
          <AiDexButton
            onAccountConnected={function (account: string): void {
              throw new Error('Function not implemented.');
            }}
          />
        </li>
        <li className="last-index">
          <IoMdSettings color="#53596E" size={25} />
        </li>
      </ul>

      <div className="input-wrap">
        <div className="input-hold">
          <div className="input-and-label">
            <label htmlFor="input">You pay</label>
            <input id="input" type="text" placeholder="0" onChange={(e) => inputHandler(Field.INPUT, e.target.value)} value={input} />
          </div>
          <div onClick={openModalForFirstInput} className="selected-coin">
            <>
              {selectedToken ? (
                <>
                  <img src={selectedToken.icon} alt={selectedToken.icon} />
                  <p>{selectedToken.symbol}</p>
                </>
              ) : (
                <>
                  <img src={crypto_list[0]['icon']} alt={crypto_list[0]['title']} />
                  <p>{crypto_list[0]['symbol']}</p>
                </>
              )}
            </>
            <BiChevronDown color="#ffffff" size={25} />
          </div>
          <BsFillArrowDownSquareFill className="swap-arrow" color="#131A2A" size={45} />
        </div>
        <div className="input-hold">
          <div className="input-and-label">
            <label htmlFor="output">You receive</label>
            <input id="output" readOnly type="text" placeholder="0" value={output ? putCommaAtPrice(from_wei(output), 5) : ""} />
          </div>
          <div onClick={openModalForSecondInput} className="selected-coin-2nd blue-bgd">
            <>
              {selected2Token ? (
                <>
                  <img src={selected2Token.icon} alt={selected2Token.icon} />
                  <p>{selected2Token.symbol}</p>
                </>
              ) : (
                <>1
                  <img src={crypto_list[1]['icon']} alt={crypto_list[1]['title']} />
                  <p>{crypto_list[1]['symbol']}</p>
                </>
              )}
            </>
            <BiChevronDown color="#ffffff" size={25} />
          </div>
        </div>
        <AiSwapButton
          input={input}
          output={output}
          setInputHandler={inputHandler}
          btnState={btnState}
          disabled={disabled}
          spotlightToken={spotlightToken}
          funcExec={funcExec}
        />
      </div>
    </Container>
  );
};

export default SwapInputTab;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  max-width: 440px;
  border: 1px solid #2e374f;
  border-radius: 30px;
  padding: 10px;
  margin: 15px;
  gap: 10px;
  background-color: #0e111c;
  font-family: 'Nunito Sans', sans-serif;
  font-weight: 600;
  z-index: 4;
  opacity: 0.9;

  ul {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    gap: 10px;
    padding: 5px 10px;
    li {
      list-style-type: none;
      color: #53596e;
      font-weight: 600;
      cursor: pointer;
    }
    li:hover {
      color: #ffffff;
    }
    .last-index {
      text-align: right;
      width: 100%;
    }
  }

  .input-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    gap: 5px;
    position: relative;
    .swap-arrow {
      position: absolute;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 11px;
      border: 6px solid #0e111c;
      background-color: #2e374f;
    }
    .input-hold {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      background-color: #131a2a;
      border-radius: 15px;
      padding: 20px;
      height: 120px;

      .input-and-label {
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        flex-direction: column;
        label {
          color: #53596e;
        }
        input {
          font-size: 34px;
          border: none;
          outline: none;
          background: transparent;
          /* width: 80%; */
          width: 230px;
          overflow: hidden;
          color: #ffffff;
          font-weight: 600;
        }
      }

      .selected-coin {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        padding: 0 5px;
        background-color: #293249;
        border-radius: 50px;
        height: 30px;
        cursor: pointer;
        p {
          color: #ffffff;
          font-size: 20px;
          margin: 0;
          padding: 0;
          text-align: center;
        }
        img {
          width: 25px;
          height: 25px;
        }
      }
      .selected-coin-2nd {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        padding: 0 5px;
        background-color: #293249;
        border-radius: 50px;
        height: 30px;
        cursor: pointer;
        /* width: 100%; */
        max-width: 170px;
        p {
          color: #ffffff;
          font-size: 20px;
          margin: 0;
          padding: 0;
          text-align: center;
          white-space: nowrap;
          word-break: normal;
        }
        img {
          width: 25px;
          height: 25px;
        }
      }
      .blue-bgd {
        /* padding: 0 10px; */
        background-color: #4c82fb;
      }
    }
    .input-hold:hover {
      border: 1px solid #2e374f;
    }
  }
`;
const Button = styled.button`
  width: 100%;
  color: #4e7be2;
  background-color: #1e3062;
  padding: 15px;
  font-size: 20px;
  border-radius: 15px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: #1c2232;
  }
`;
