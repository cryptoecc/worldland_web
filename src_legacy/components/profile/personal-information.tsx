import React, { useEffect } from 'react';
import { Box, Button, Card, Typography, Grid, Divider, useMediaQuery } from '@mui/material';

//graphql
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';

//redux-toolkit
import { AppState } from '../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import TokenService from 'utils/TokenService';
import { AuthPayLoad } from 'types/AuthPayload';
import {
  loadInit as loadInitAction,
  userId as userIdAction,
  userEmail as userEmailAction,
  userMobile as userMobileAction,
  userLevel as userLevelAction,
} from '../../store/user/UserSlice';

const LvUserByUserIdQuery = gql`
  query lvUserByUserId($userId: String) {
    lvUserByUserId(userId: $userId) {
      email
      nickname
      mobile
      country {
        name
        calling_code
      }
      userpw
      wallet_addr
      ref_id
    }
  }
`;

interface Country {
  name: string;
  calling_code: string;
}

interface UserInfo {
  email: string;
  nickname: string;
  mobile: string;
  country: Country;
  userpw: string;
  wallet_addr: string;
  ref_id: string;
}

interface RetData {
  lvUserByUserId: UserInfo;
}

const InitLvAccessTokenMutation = gql`
  mutation InitLvAccessToken($value: String!) {
    initLvAccessToken(value: $value) {
      token
      userId
      userEmail
      userMobile
      userLevel
    }
  }
`;

const InfoProfile = () => {
  const isSmallScreen = useMediaQuery('(max-width:1350px)');

  const user = useSelector((state: AppState) => state.userReducer);
  const userId = user.userId;
  console.log('123', user);

  const dispatch = useDispatch();
  const router = useNavigate();

  const gotoChange = (pageId: string) => {
    router(`/api/apps/profile/${pageId}`);
  };

  // const [initLvAccessToken, {}] = useMutation(InitLvAccessTokenMutation);

  // //user info 초기 load
  // useEffect(() => {
  //   //const refToken = Boolean(localStorage.getItem("peta_ref_id"));
  //   const refToken = localStorage.getItem('worldland_ref_id') === 'true' ? true : false;
  //   console.log('InitUser refToken:', refToken);
  //   console.log(user.loadInit);
  //   if (!user.loadInit && refToken) {
  //     initLvAccessToken()
  //       .then((res) => {
  //         const authPayload: AuthPayLoad = res.data.initLvAccessToken;
  //         console.log('InitUser authPayload:', authPayload);
  //         if (authPayload.token) {
  //           TokenService.set(authPayload.token);
  //           dispatch(userIdAction(authPayload.userName));
  //           dispatch(userEmailAction(authPayload.userEmail));
  //           dispatch(userMobileAction(authPayload.userMobile));
  //           dispatch(userLevelAction(authPayload.userLevel));
  //         }
  //       })
  //       .catch((res) => {
  //         localStorage.removeItem('worldland_ref_id'); //refresh token 존재 여부 초기화
  //         /*           const errors = res.graphQLErrors.map((error: any) => {
  //           message.info({
  //             content: error.message,
  //             icon: <RiErrorWarningLine className="remix-icon" />,
  //           });
  //           console.log(error.message);
  //         }); */
  //       })
  //       .finally(() => {
  //         dispatch(loadInitAction(true));
  //         console.log('InitUser refreshAccessToken user.loadInit <set true>');
  //       });
  //   } else {
  //     dispatch(loadInitAction(true));
  //     console.log('InitUser user.loadInit <set true>');
  //   }
  // }, []);

  const { loading, error, data, refetch } = useQuery<RetData>(LvUserByUserIdQuery, {
    fetchPolicy: 'cache-and-network',
    variables: { userId: userId },
  });

  if (loading) {
    return <div>Loading ...</div>;
  }
  if (error) {
    console.log(userId);
    console.log('personal-infomation useQuery error:', error);
    return <div>Error: {error.message}</div>;
  }

  if (!data || !data.lvUserByUserId) {
    return <div>No data available</div>;
  }

  const formatPhoneNumber = (phoneNumber: string, callingCode: string) => {
    const numberWithoutCountryCode = phoneNumber.slice(callingCode.length - 1);
    const formattedNumber = `0${numberWithoutCountryCode}`;
    return formattedNumber.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  };

  const formatWalletAddress = (walletAddress: string) => {
    if (isSmallScreen) {
      return `${walletAddress.slice(0, 7)}...${walletAddress.slice(-5)}`;
    }
    return walletAddress;
  };

  return (
    <Card sx={{ p: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h5">Personal Information</Typography>
          <Divider sx={{ mb: 2 }} />
        </Grid>

        <Grid item xs={3}>
          <Typography variant="body1">Email:</Typography>
        </Grid>
        <Grid item xs={7}>
          <Typography variant="body1">{data.lvUserByUserId.email}</Typography>
        </Grid>
        <Grid item xs={2}>
          <Button onClick={() => gotoChange('change-email')}>변경</Button>
        </Grid>

        <Grid item xs={3}>
          <Typography variant="body1">Nickname:</Typography>
        </Grid>
        <Grid item xs={7}>
          <Typography variant="body1">{data.lvUserByUserId.nickname}</Typography>
        </Grid>
        <Grid item xs={2}>
          <Button onClick={() => gotoChange('change-nickname')}>변경</Button>
        </Grid>

        <Grid item xs={3}>
          <Typography variant="body1">Mobile:</Typography>
        </Grid>
        <Grid item xs={7}>
          <Typography variant="body1">{data.lvUserByUserId.country.name}</Typography>
          <Typography variant="body1">{data.lvUserByUserId.country.calling_code}</Typography>
          <Typography variant="body1">
            {formatPhoneNumber(data.lvUserByUserId.mobile, data.lvUserByUserId.country.calling_code)}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Button onClick={() => gotoChange('change-mobile')}>변경</Button>
        </Grid>

        {/* <Grid item xs={3}>
          <Typography variant="body1">Password:</Typography>
        </Grid>
        <Grid item xs={7}>
          <Typography variant="body1">{data.lvUserByUserId.userpw}</Typography>
        </Grid>
        <Grid item xs={2}>
          <Button onClick={() => gotoChange('change-password')}>변경</Button>
        </Grid> */}

        <Grid item xs={3}>
          <Typography variant="body1">Wallet:</Typography>
        </Grid>
        <Grid item xs={7}>
          {data.lvUserByUserId.wallet_addr ? (
            <Typography variant="body1">{formatWalletAddress(data.lvUserByUserId.wallet_addr)}</Typography>
          ) : (
            <Typography variant="body1">There is no wallet address currently registered.</Typography>
          )}
        </Grid>
        <Grid item xs={2}>
          <Button onClick={() => gotoChange('change-wallet')}>변경</Button>
        </Grid>

        <Grid item xs={3}>
          <Typography variant="body1">Referral ID:</Typography>
        </Grid>
        <Grid item xs={7}>
          <Typography variant="body1">{data.lvUserByUserId.ref_id}</Typography>
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
    </Card>
  );
};
export default InfoProfile;
