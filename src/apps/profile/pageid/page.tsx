'use client';

import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Grid, Box, Card } from '@mui/material';
import PageContainer from '../../../components/container/PageContainer';

import MenuProfile from '../../../components/profile/menu';
import InfoProfile from '../../../components/profile/personal-information';
import EmailProfile from '../../../components/profile/change-email';
import MobileProfile from '../../../components/profile/change-mobile';
import NicknameProfile from '../../../components/profile/change-nickname';
import PasswordProfile from '../../../components/profile/change-password';
import WalletProfile from '../../../components/profile/change-wallet';
import InitUser from 'pages/authentication/initUser';

const ProfileSub = () => {
  const params = useParams();
  const pageid = params?.pageid as string;
  const router = useNavigate();

  useEffect(() => {
    if (pageid) {
      if (
        !(
          pageid === 'personal-information' ||
          pageid === 'change-email' ||
          pageid === 'change-mobile' ||
          pageid === 'change-nickname' ||
          pageid === 'change-password' ||
          pageid === 'change-wallet'
        )
      ) {
        router('/api/apps/profile/personal-information');
      }
    }
  }, [pageid, router]);

  return (
    <PageContainer>
      <Grid container spacing={2} sx={{ height: '100vh', marginTop: '150px' }}>
        <Grid item xs={12} md={3}>
          <Box
            sx={{
              width: '100%',
              p: 2,
              bgcolor: 'background.paper',
              borderRight: 1,
              borderColor: 'divider',
              height: '100%',
              backgroundColor: '#333',
            }}
          >
            <MenuProfile />
          </Box>
        </Grid>

        <Grid item xs={12} md={9}>
          <Card sx={{ p: 4, backgroundColor: '#333' }}>
            {pageid === 'personal-information' && <InfoProfile />}
            {pageid === 'change-email' && <EmailProfile />}
            {pageid === 'change-mobile' && <MobileProfile />}
            {pageid === 'change-nickname' && <NicknameProfile />}
            {pageid === 'change-password' && <PasswordProfile />}
            {pageid === 'change-wallet' && <WalletProfile />}
          </Card>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default ProfileSub;
