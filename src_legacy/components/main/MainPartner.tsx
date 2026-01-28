import gg56 from '../../assets/main/images/gg56.png';
import AIICPG from '../../assets/main/images/AIICPG.png';
import gist from '../../assets/main/images/gist.svg';
import consensys from '../../assets/main/images/consensys.svg';
import gwangju from '../../assets/main/images/gwangju.svg';
import NRF from '../../assets/main/images/NRF.svg';
import national from '../../assets/main/images/national.svg';
import msit from '../../assets/main/images/msit.svg';
import ADD from '../../assets/main/images/ADD.svg';
import {
  PartnerContainer,
  Contact1,
  IconWrap,
  Icon,
  Icon2,
  Icon3,
  Icon4,
  Icon5,
  Icon6,
  Icon7,
  Icon8,
  Icon9,
} from './MainPartner.style';
import { AicaIcon, Gg56Icon, GistIcon } from 'assets';

const MainPartner = () => {
  return (
    <PartnerContainer>
      <Contact1>
        <IconWrap>
          {/* Add your icons here */}
          {/* <Icon src={gg56} alt="Icon 1" /> */}
          <Gg56Icon />
          {/* <Icon2 src={AIICPG} alt="Icon 2" /> */}
          <AicaIcon />
          {/* <Icon3 src={gist} alt="Icon 3" /> */}
          <GistIcon />
          <Icon4 src={consensys} alt="Icon 4" />
          <Icon5 src={msit} alt="Icon 5" />
          <Icon6 src={ADD} alt="Icon 6" />
          <Icon7 src={national} alt="Icon 7" />
          <Icon8 src={NRF} alt="Icon 5" />
          <Icon9 src={gwangju} alt="Icon 6" />
        </IconWrap>
      </Contact1>
    </PartnerContainer>
  );
};

export default MainPartner;
