'use client';

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const router = useNavigate();
  useEffect(() => {
    router('/apps/profile/personal-information');
  }, [router]);

  return null;
};
export default Profile;
