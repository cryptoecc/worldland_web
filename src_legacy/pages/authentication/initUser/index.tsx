import { useEffect } from 'react';
import {
  loadInit as loadInitAction,
  userId as userIdAction,
  userEmail as userEmailAction,
  userMobile as userMobileAction,
  userLevel as userLevelAction,
} from '../../../store/user/UserSlice';
//import { message } from "antd";

import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { AuthPayLoad } from '../../../types/AuthPayload';
import TokenService from 'utils/TokenService';
//import { RiErrorWarningLine } from "react-icons/ri";
import { useAppDispatch, useAppSelector } from '../../../store/store';
//import { NextPage } from "next";

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
const InitUser: React.FC = () => {
  const user = useAppSelector((state) => state.userReducer);
  const dispatch = useAppDispatch();
  const [initLvAccessToken, { error, data }] = useMutation(InitLvAccessTokenMutation);

  //user info 초기 load
  useEffect(() => {
    //const refToken = Boolean(localStorage.getItem("peta_ref_id"));
    const oldToken = TokenService.get();
    const refToken = localStorage.getItem('worldland_ref_id') === 'true' ? true : false;
    console.log('InitUser refToken:', refToken);
    console.log(user.loadInit);
    if (!user.loadInit && refToken) {
      initLvAccessToken({
        variables: {
          value: oldToken == undefined ? '' : oldToken,
        },
      })
        .then((res) => {
          const authPayload: AuthPayLoad = res.data.initLvAccessToken;
          console.log('InitUser authPayload:', authPayload);
          if (authPayload.token) {
            TokenService.set(authPayload.token);
            dispatch(userIdAction(authPayload.userId));
            dispatch(userEmailAction(authPayload.userEmail));
            dispatch(userMobileAction(authPayload.userMobile));
            dispatch(userLevelAction(authPayload.userLevel));
          }
        })
        .catch((res) => {
          console.log('여기~');
          localStorage.removeItem('worldland_ref_id'); //refresh token 존재 여부 초기화
          /*           const errors = res.graphQLErrors.map((error: any) => {
            message.info({
              content: error.message,
              icon: <RiErrorWarningLine className="remix-icon" />,
            });
            console.log(error.message);
          }); */
        })
        .finally(() => {
          dispatch(loadInitAction(true));
          console.log('InitUser refreshAccessToken user.loadInit <set true>');
        });
    } else {
      dispatch(loadInitAction(true));
      console.log('InitUser user.loadInit <set true>');
    }
  }, []);

  return <></>;
};

export default InitUser;
