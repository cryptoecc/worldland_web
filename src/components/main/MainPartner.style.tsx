import { theme } from 'style/theme';
import styled from 'styled-components';
import { maxQuery } from 'utils/breakpoints';

const PartnerContainer = styled.div`
  display: flex;
  width: 100%;
  padding: 40px 0px;
  justify-content: center;
  align-items: center;
  align-content: center;
  flex-wrap: wrap;
  padding: 40px;

  /* Media query for screens with a maximum width of 600px */
  ${maxQuery.tablet} {
    padding: 20px; /* Adjust the padding for smaller screens */
  }
`;

const Contact1 = styled.div`
  display: flex;
  /* height: auto; */
  width: 100%;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  ${maxQuery.tablet} {
    width: 100%;
  }
`;

const IconWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 50px;
  flex-wrap: wrap;

  svg {
    color: ${theme.colors.white80};
    height: 28px;
  }

  /* Media query for screens with a maximum width of 600px */
  ${maxQuery.tablet} {
    margin: 100px 0; /* Adjust the margin-top for smaller screens */
    flex-direction: row; /* Stack the icons vertically */
    align-items: center; /* Center the icons horizontally */
    gap: 32px;
    flex: 1 0 0;
    flex-wrap: wrap;

    svg,
    img {
      height: 24px;
      width: auto;
    }
  }
`;

const Icon = styled.img`
  height: auto;
  width: 25px;
`;

const Icon2 = styled.img`
  height: auto;
  width: 100px;
`;

const Icon3 = styled.img`
  height: auto;
  width: 70px;
`;

const Icon4 = styled.img`
  height: auto;
  width: 80px;
`;

const Icon5 = styled.img`
  height: auto;
  width: 80px;
`;
const Icon6 = styled.img`
  height: auto;
  width: 80px;
`;
const Icon7 = styled.img`
  height: auto;
  width: 70px;
`;

const Icon8 = styled.img`
  height: auto;
  width: 25px;
`;

const Icon9 = styled.img`
  height: auto;
  width: 52px;
`;

export { PartnerContainer, Contact1, IconWrap, Icon, Icon2, Icon3, Icon4, Icon5, Icon6, Icon7, Icon8, Icon9 };
