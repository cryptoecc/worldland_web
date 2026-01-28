import { styled } from 'styled-components';
import { CgClose } from 'react-icons/cg';
import { AiOutlineSearch } from 'react-icons/ai';
import { selectList } from 'constants/select';
import { createElement, useEffect, useState } from 'react';
import { ListItemType } from 'types/select';



const TokenModal = ({ close, handleTokenClick }: TokenModalProps) => {
  //   const [selectedToken, setSelectedToken] = useState(null);

  const handleTokenClicks = (token: ListItemType) => {
    handleTokenClick(token);
    close(false);
  };


  return (
    <Container>
      <section className="first-block">
        <p>Select a token</p>
        <CgClose onClick={() => close(false)} className="close-btn" color="#ffffff" size={25} />
      </section>
      <div className="input-hold">
        <AiOutlineSearch color="#ffffff" size={25} />
        <input type="text" placeholder="Search name or paste address" />
      </div>
      <ul className="often-selected-crypto">
        {selectList.map((el, i) => (
          <li key={i} onClick={() => handleTokenClicks(el)}>
            {createElement(selectList[i].tokenIcon)}
            {el.token}
          </li>
        ))}
      </ul>
      <ul className="crypto-select-list">
        {selectList.map((el, i) => (
          <li key={i} onClick={() => handleTokenClicks(el)}>
            <div className="list-item">
              {createElement(selectList[i].tokenIcon)}
              <div className="title-wrap">
                <p className="title">{el.token}</p>
                <p className="symbol">{el.token}</p>
              </div>
            </div>
            <p className="balance">0</p>
          </li>
        ))}
      </ul>
    </Container>
  );
};

export default TokenModal;

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
  max-height: 600px;
  font-family: 'Nunito Sans', sans-serif;
  padding: 10px 0 0 0;
  opacity: 0.9;

  .first-block {
    display: inherit;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 15px;
    p {
      font-weight: 600;
      font-size: 18px;
      color: #ffffff;
    }
    .close-btn {
      cursor: pointer;
    }
  }
  .input-hold {
    display: inherit;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin: 0 15px;
    width: 100%;
    max-width: 95%;
    padding: 7px 10px;
    background-color: #131a2a;
    border-radius: 10px;
    border: 1px solid #2e374f;
    input {
      background: transparent;
      border: none;
      outline: none;
      width: 100%;
      color: #ffffff;
      font-size: 18px;
    }
    input::placeholder {
      color: #363f59;
      font-weight: 700;
    }
  }
  .input-hold:hover {
    background-color: #0e111c;
  }

  .often-selected-crypto {
    display: inherit;
    align-items: flex-start;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 10px;
    margin: 15px;

    li {
      display: inherit;
      align-items: center;
      justify-content: center;
      list-style-type: none;
      border: 1px solid #2e374f;
      border-radius: 16px;
      color: #ffffff;
      font-size: 14px;
      padding: 8px 7px;
      gap: 5px;
      cursor: pointer;

      img {
        width: 25px;
        height: 25px;
      }
    }
    li:hover {
      background-color: #212839;
      border: 1px solid #3d65be;
    }
  }
  .crypto-select-list {
    display: inherit;
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: column;
    border-top: 1px solid #2e374f;
    width: 100%;
    overflow-y: scroll;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* Internet Explorer 11 */
    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 10px 15px;
      cursor: pointer;
      .list-item {
        display: flex;
        align-items: center;
        justify-content: center;
        list-style-type: none;
        color: #ffffff;
        font-size: 14px;
        gap: 10px;

        .title-wrap {
          display: inherit;
          align-items: flex-start;
          justify-content: flex-start;
          flex-direction: column;
          gap: 5px;

          .symbol {
            color: #2e374f;
          }
        }

        img {
          width: 40px;
          height: 40px;
        }
      }

      .balance {
        color: #ffffff;
      }
    }
    li:hover {
      background-color: #181d29;
    }
  }
  .crypto-select-list::-webkit-scrollbar {
    display: none;
  }
`;
