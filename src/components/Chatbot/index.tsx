// 월드랜드 쪽 프론트에서 추가해야할 사항이 하나 있습니다.

// 챗봇으로 넘어오는 링크가 있는 부분에
// 링크를 누르면 요청에  해당 회원의 id를 헤더에 포함시켜 요청보내는 부분입니다. 이게 있어야 월드랜드에 로그인 한 회원이 챗봇 화면이 보이게 됩니다.

// 첨부한 코드에서
// (1) LV_USER_QUERY 쿼리
// (2) handleRedirect 함수
// 이 두 부분만 챗봇 링크 넘어가는 부분 있는 페이지에 추가해주시면 됩니다.

// 이하 샘플 코드——————————

import React from 'react';
// import type { NextPage } from "next";

import { Row, Col, Button } from 'antd';

import gql from 'graphql-tag';
import { useQuery, useLazyQuery, useMutation } from '@apollo/client';

import { useDispatch, useSelector } from 'react-redux';
import { AppState, useAppSelector } from 'store/store';
import { Link } from 'react-router-dom';
import TokenService from 'utils/TokenService';

// import Breadcrumbs from "../../layout/components/contents/breadcrumbs";
// import ActionButton from "../../layout/components/contents/action-buttons";
// import PageTitle from "../../layout/components/contents/page-title";

//todo : 배포 시 https://law-chats.com으로 변경 필요
const addr = 'https://law-chats.com';

const LV_USER_QUERY = gql`
  query AllLvUser {
    allLvUser {
      userid
      email
      nickname
      mobile
      regdate
      level_code
      country_code
    }
  }
`;

const Chatbot = () => {
  const { loading, error, data } = useQuery(LV_USER_QUERY);

  const loggedInUserId = useAppSelector((state) => state.userReducer.userId);
  //   const user = useSelector((state: AppState) => state.userReducer);

  const handleRedirect = async () => {
    if (!loggedInUserId) {
      console.error('User ID is undefined.');
      return;
    }

    const token = TokenService.get();
    console.log('테스트 페이지 token : ', token);
    console.log('테스트 페이지 로그인한 유저 아이디 : ', loggedInUserId);

    try {
      const response = await fetch(`${addr}/api/save-user-id`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-User-Id': loggedInUserId,
        },
        credentials: 'include',
      });

      if (response.status === 200) {
        window.location.href = addr;
      } else {
        console.error('law-chat으로 리다이렉트 실패 :', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <button onClick={handleRedirect} style={{ color: 'white', fontWeight: '700', gap: '8px', fontSize: '15px' }}>
      Chat Bot
    </button>
  );
};

export default Chatbot;
