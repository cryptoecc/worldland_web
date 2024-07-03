import { useState, useEffect } from 'react';
import { loadInit, userId, userEmail, userMobile, userLevel } from '../../../store/user/UserSlice';
//import { message } from "antd";

import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { BasicResponse } from 'types';
import TokenService from 'utils/TokenService';
//import { RiErrorWarningLine } from "react-icons/ri";
import { useDispatch, useSelector } from 'react-redux';
//import { NextPage } from "next";
import styled from 'styled-components';
import { theme } from 'style/theme';
import { maxQuery } from 'utils/breakpoints';

import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AppState } from 'store/store';

const LogoutUserMutation = gql`
  mutation lvlogoutUser {
    lvlogoutUser {
      retCode
      retMsg
    }
  }
`;

const StyledButton = styled.button`
  display: flex;
  padding: 6px 15px;
  flex-direction: column;
  margin-right: 30px;
  border-radius: 6px;
  border: 1px solid #f4f4f4;
  color: #f4f4f4;
  font-family: 'Inter';
  font-size: 14px;
  font-weight: bold;
  text-decoration: none; /* Add this to remove underline */
  cursor: pointer;

  &:hover {
    background-color: ${theme.colors.white400};
    border: 1px solid ${theme.colors.white800};
    transition:
      background 0.3s,
      border 0.3s;
  }

  ${maxQuery.tablet} {
    /* margin-left: 400px; */
  }
`;

const LogoutBtn = () => {
  const [isLoading, setIsLoding] = useState(true);
  const user = useSelector((state: AppState) => state.userReducer);
  const dispatch = useDispatch();
  const [logoutUser, { error, data }] = useMutation(LogoutUserMutation);

  const router = useNavigate();
  const value = localStorage.getItem('worldland_ref_id');
  const goToRoot = () => {
    router('/');
  };

  //   logout mutation 실행
  useEffect(() => {
    if (isLoading) {
      if (value) {
        return;
      } else {
        logoutUser()
          .then((response) => {
            console.log('Logout response:', response);
            TokenService.remove(); // 토큰 제거
            dispatch(userId(undefined));
            dispatch(userEmail(undefined));
            dispatch(userMobile(undefined));
            dispatch(userLevel(undefined));
            localStorage.removeItem('worldland_ref_id'); // 로컬 스토리지 항목 제거
            router('/'); // 홈으로 리다이렉트
          })
          .catch((error) => {
            console.error('Logout error:', error);
          });
      }
    }
  }, []);
  const handleLogout = () => {
    logoutUser()
      .then((response) => {
        console.log('Logout response:', response);
        TokenService.remove(); // 토큰 제거
        dispatch(userId(undefined));
        dispatch(userEmail(undefined));
        dispatch(userMobile(undefined));
        dispatch(userLevel(undefined));
        localStorage.removeItem('worldland_ref_id'); // 로컬 스토리지 항목 제거
        router('/'); // 홈으로 리다이렉트
      })
      .catch((error) => {
        console.error('Logout error:', error);
      });
  };

  return <StyledButton onClick={handleLogout}>Logout</StyledButton>;
};

export default LogoutBtn;
