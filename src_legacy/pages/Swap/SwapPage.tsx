import * as S from './SwapPage.style';
import Layout from 'components/@common/Layout/Layout';
import SwapProvider from 'contexts/SwapProvider';
import SwapWrap from './SwapWrap';

const SwapPage = () => {
  return (
    <Layout>
      <S.Container>
        <S.Title>AI Swap</S.Title>
        <SwapProvider>
          <SwapWrap />
        </SwapProvider>
      </S.Container>
    </Layout>
  );
};

export default SwapPage;
