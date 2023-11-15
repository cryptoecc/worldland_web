import * as S from './Layout.style';

import { MainVideo } from 'assets/static/videos/MainVideo';
import { PropsWithChildren } from 'react';

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <S.Container>
      <S.Video controls loop autoPlay muted>
        <source src={MainVideo} type="video/mp4" />
        Your browser is not supported
      </S.Video>
      {children}
    </S.Container>
  );
};

export default Layout;
