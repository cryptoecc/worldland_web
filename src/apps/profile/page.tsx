'use client';

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // 예시로 Redux를 사용한 경우
import { useAppSelector } from 'store/store';

const Profile = () => {
  const router = useNavigate();
  const user = useAppSelector((state) => state.userReducer);

  useEffect(() => {
    router('/apps/profile/personal-information');
  }, [router]);

  return null;
};
export default Profile;
