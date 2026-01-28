'use client';
import { Grid, Box, Card, Typography } from '@mui/material';
import LogoImage from '../../assets/header/logo2.svg';
// import PageContainer from '@/app/components/container/PageContainer';
import AuthForgotEmail from '../../components/AuthForm/AuthForgotEmail';

export default function ForgotEmail2() {
  return (
    <Box
      sx={{
        position: 'relative',
        '&:before': {
          content: '""',
          backgroundSize: '400% 400%',
          animation: 'gradient 15s ease infinite',
          position: 'absolute',
          // height: '100%',
          // width: '100%',
          opacity: '0.3',
        },
      }}
    >
      <Grid container spacing={0} justifyContent="center" sx={{ height: '100vh' }}>
        <Grid item xs={12} sm={12} lg={4} xl={3} display="flex" justifyContent="center" alignItems="center">
          <Card elevation={9} sx={{ p: 4, zIndex: 1, width: '100%', maxWidth: '500px', backgroundColor: 'white' }}>
            <Box display="flex" alignItems="center" justifyContent="center">
              <div style={{ width: '90px', marginBottom: '20px' }}>
                {/* <WorldLandLogo /> */}
                <img src={LogoImage} />
              </div>
            </Box>
            <Typography color="#black" textAlign="center" variant="subtitle2" fontWeight="400">
              Please enter the mobile number associated with your account and We will let you know your Email.
            </Typography>
            <AuthForgotEmail />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
