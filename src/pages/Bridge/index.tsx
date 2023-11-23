import * as S from './index.style';
import BridgeProvider from 'contexts/BridgeProvider';
import Layout from 'components/@common/Layout/Layout';
import BridgeWrap from './BridgeWrap';

const BridgePage = () => {
  return (
    <Layout>
      <S.Bridge>
        <S.Title>Bridge</S.Title>
        <BridgeProvider>
          <BridgeWrap />
        </BridgeProvider>
        <S.Button type="button">Connect Wallet</S.Button>
      </S.Bridge>
    </Layout>
  );
};

export default BridgePage;
