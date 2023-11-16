import * as S from './index.style';

import Bridge from 'components/Bridge/Bridge';
import Layout from 'components/@common/Layout/Layout';

const BridgePage = () => {
  return (
    <Layout>
      <S.Bridge>
        <S.Title>Bridge</S.Title>
        <Bridge type="input" text="From" />
        <Bridge type="output" text="To" />
      </S.Bridge>
    </Layout>
  );
};

export default BridgePage;
