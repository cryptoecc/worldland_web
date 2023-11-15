import * as S from './SwapPage.style';

import { ExchangeIcon } from 'assets';
import Layout from 'components/@common/Layout/Layout';
import Swap from 'components/swap/Swap';
import SwapProvider from 'contexts/SwapProvider';

const SwapPage = () => {
  return (
    <Layout>
      <S.Container>
        <S.Title>Swap</S.Title>
        <SwapProvider>
          <S.SwapWrapper>
            <Swap type="input" text="From" listType="tokenList" />
            <ExchangeIcon />
            <Swap type="output" text="To" listType="tokenList" />
          </S.SwapWrapper>
        </SwapProvider>
        <S.Button type="button">Connect Wallet</S.Button>
      </S.Container>
    </Layout>
  );
};

export default SwapPage;
