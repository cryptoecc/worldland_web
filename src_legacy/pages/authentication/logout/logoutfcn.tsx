// src/utils/authFunctions.js 또는 적절한 위치에 로그아웃 함수 생성

import TokenService from 'utils/TokenService';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadInit, userId, userEmail, userMobile, userLevel } from '../../../store/user/UserSlice';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

const LogoutUserMutation = gql`
  mutation lvlogoutUser {
    lvlogoutUser {
      retCode
      retMsg
    }
  }
`;

const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // 올바른 네비게이션 훅 사용
  const [logoutUser] = useMutation(LogoutUserMutation); // 로그아웃 뮤테이션

  const logout = () => {
    logoutUser()
      .then((response) => {
        console.log('Logout response:', response);
        TokenService.remove(); // 토큰 제거
        dispatch(loadInit(false));
        dispatch(userId(undefined)); // 사용자 ID 제거
        dispatch(userEmail(undefined)); // 이메일 상태 제거
        dispatch(userMobile(undefined)); // 모바일 번호 상태 제거
        dispatch(userLevel(undefined)); // 사용자 레벨 상태 제거
        localStorage.removeItem('worldland_ref_id'); // 로컬 스토리지 클리어
        navigate('/'); // 홈으로 리다이렉트
      })
      .catch((error) => {
        console.error('Logout error:', error);
      });
  };

  return logout; // 로그아웃 함수 반환
};

export default useLogout;
