import React, { useState } from 'react';
import { Box, Button, Card, Typography, Grid, Divider, TextField, Snackbar } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

//graphql
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/client';

//redux-toolkit
import { AppState } from '../../store/store';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';

const LvUserByUserIdQuery = gql`
  query lvUserByUserId($userId: String) {
    lvUserByUserId(userId: $userId) {
      wallet_addr
    }
  }
`;

const updateNewWalletByUserIDMutaion = gql`
  mutation UpdateNewWalletByUserId($userId: String!, $newWallet: String!) {
    updateNewWalletByUserId(userId: $userId, newWallet: $newWallet) {
      retCode
      retMsg
    }
  }
`;

interface UserInfo {
  wallet_addr: string;
}

interface RetData {
  lvUserByUserId: UserInfo;
}

interface Lv_BasicResponse {
  retCode: string;
  retMsg: string;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const WalletProfile = () => {
  const user = useSelector((state: AppState) => state.userReducer);
  const userId = user.userId;
  const [newWallet, setNewWallet] = useState('');
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');

  const router = useNavigate();

  const { loading, error, data, refetch } = useQuery<RetData>(LvUserByUserIdQuery, {
    fetchPolicy: 'cache-and-network',
    variables: { userId: userId },
  });

  const [updateNewWalletByUserId] = useMutation(updateNewWalletByUserIDMutaion);

  const handleWalletChange = async () => {
    try {
      const response = await updateNewWalletByUserId({
        variables: { userId: userId, newWallet: newWallet },
      });
      const result: Lv_BasicResponse = response.data.updateNewWalletByUserId;
      if (result.retCode === '200') {
        setAlertMessage('Wallet address has been successfully registered!');
        setAlertSeverity('success');
        setOpen(true);
        setTimeout(() => {
          setOpen(false);
          router('/api/apps/profile/personal-information');
        }, 3000);
      } else {
        setAlertMessage(result.retMsg);
        setAlertSeverity('error');
        setOpen(true);
      }
    } catch (error) {
      setAlertMessage('An error occurred while registering the wallet address.');
      setAlertSeverity('error');
      setOpen(true);
      console.error(error);
    }
  };

  if (loading) {
    return <div>Loading ...</div>;
  }
  if (error) {
    console.log('personal-infomation useQuery error:', error);
    return <div>Error: {error.message}</div>;
  }

  if (!data || !data.lvUserByUserId) {
    return <div>No data available</div>;
  }

  return (
    <Card sx={{ p: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h5">Regist Wallet Address</Typography>
          <Divider sx={{ mb: 2 }} />
        </Grid>

        <Grid item xs={3}>
          <Typography variant="body1">Current Wallet Address :</Typography>
        </Grid>
        <Grid item xs={7}>
          {data.lvUserByUserId.wallet_addr ? (
            <Typography variant="body1">{data.lvUserByUserId.wallet_addr}</Typography>
          ) : (
            <Typography variant="body1">There is no wallet address currently registered.</Typography>
          )}
        </Grid>

        <Grid item xs={3}>
          <Typography variant="body1">New Wallet Address :</Typography>
        </Grid>
        <Grid item xs={7}>
          <TextField fullWidth variant="outlined" value={newWallet} onChange={(e) => setNewWallet(e.target.value)} />
        </Grid>
        <Grid item xs={2}>
          <Button onClick={handleWalletChange}>Change</Button>
        </Grid>
      </Grid>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setOpen(false)} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Card>
  );
};
export default WalletProfile;
