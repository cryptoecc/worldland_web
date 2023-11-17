import * as S from './index.style';

import Bridge from 'components/Bridge/Bridge';
import BridgeProvider from 'contexts/BridgeProvider';
import Layout from 'components/@common/Layout/Layout';

const BridgePage = () => {
  return (
    <Layout>
      <S.Bridge>
        <S.Title>Bridge</S.Title>
        <BridgeProvider>
          <S.BridgeWrapper>
            <Bridge type="input" text="From" />
            <Bridge type="output" text="To" />
          </S.BridgeWrapper>
        </BridgeProvider>
        <S.Button type="button">Connect Wallet</S.Button>
      </S.Bridge>
    </Layout>
  );
};

export default BridgePage;
