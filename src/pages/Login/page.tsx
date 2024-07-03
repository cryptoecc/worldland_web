'use client';

import { Grid, Box, Card, Stack, Typography } from '@mui/material';

// components
// import Logo from '@/app/(DashboardLayout)/layout/shared/logo/Logo';
import LogoImage from '../../assets/header/logo2.svg';
import PageContainer from '../../components/container/PageContainer';
import AuthLogin from '../../components/AuthLogin/AuthLogin';

export default function Login2() {
  return (
    <PageContainer title="Login Page" description="this is Sample page">
      <Box
        sx={{
          position: 'relative',
          '&:before': {
            content: '""',
            backgroundSize: '400% 400%',
            animation: 'gradient 15s ease infinite',
            position: 'absolute',
            height: '100%',
            width: '100%',
            opacity: '0.3',
          },
        }}
      >
        <Grid container spacing={0} justifyContent="center" sx={{ height: '100vh' }}>
          <Grid item xs={12} sm={12} lg={5} xl={4} display="flex" justifyContent="center" alignItems="center">
            <Card elevation={9} sx={{ p: 4, zIndex: 1, width: '100%', maxWidth: '450px', backgroundColor: '#fff' }}>
              {/* <Box display="flex" alignItems="center" justifyContent="center">
                <Logo />
              </Box> */}
              <Box display="flex" alignItems="center" justifyContent="center">
                <div style={{ width: '90px' }}>
                  {/* <WorldLandLogo /> */}
                  <img src={LogoImage} />
                </div>
              </Box>
              <AuthLogin />
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
}
