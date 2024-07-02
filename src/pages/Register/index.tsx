import { Grid, Box, Card, Typography, Stack } from '@mui/material';
import AuthRegister from 'components/AuthRegister/AuthRegister';
import { WorldLandLogo } from 'assets';
import LogoImage from '../../assets/header/logo2.svg';

export default function Register() {
  return (
    <Box
      sx={{
        position: 'relative',
        '&:before': {
          content: '""',
          //   background: 'radial-gradient(#d2f1df, #d3d7fa, #bad8f4)',
          backgroundSize: '400% 400%',
          animation: 'gradient 15s ease infinite',
          position: 'absolute',
          height: '100%',
          width: '100%',
          opacity: '0.3',
        },
      }}
    >
      <Grid container spacing={0} justifyContent="center" sx={{ height: '180vh' }}>
        <Grid item xs={12} sm={12} lg={5} xl={4} display="flex" justifyContent="center" alignItems="center">
          <Card
            elevation={9}
            sx={{ p: 4, zIndex: 1, width: '100%', maxWidth: '450px', color: 'black', backgroundColor: 'white' }}
          >
            <Box display="flex" alignItems="center" justifyContent="center">
              <div style={{ width: '90px' }}>
                {/* <WorldLandLogo /> */}
                <img src={LogoImage} />
              </div>

              {/* <img src={LogoImage} alt="World Land Logo" style={{ width: '200px' }} /> */}
            </Box>
            <AuthRegister
              subtext={
                <Typography variant="subtitle1" textAlign="center" color="yellow" mb={1}>
                  Your Social Campaigns
                </Typography>
              }
              subtitle={
                <Stack direction="row" spacing={1} mt={3}>
                  <Typography color="black" fontWeight="400">
                    Already have an Account?
                  </Typography>
                  <Typography
                    component="a"
                    href="/auth/auth2/login"
                    fontWeight="500"
                    sx={{
                      textDecoration: 'none',
                      color: 'primary.main',
                    }}
                  >
                    Sign In
                  </Typography>
                </Stack>
              }
            />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
