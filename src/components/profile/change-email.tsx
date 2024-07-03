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
// import { useRouter } from "next/navigation";

const LvUserByUserIdQuery = gql`
  query lvUserByUserId($userId: String) {
    lvUserByUserId(userId: $userId) {
      email
    }
  }
`;

const updateNewEmailByUserIDMutaion = gql`
  mutation UpdateNewEmailByUserId($userId: String!, $newEmail: String!) {
    updateNewEmailByUserId(userId: $userId, newEmail: $newEmail) {
      retCode
      retMsg
    }
  }
`;

interface UserInfo {
  email: string;
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

const EmailProfile = () => {
  const user = useSelector((state: AppState) => state.userReducer);
  const userId = user.userId;
  const [newEmail, setNewEmail] = useState('');
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');

  const dispatch = useDispatch();
  const router = useNavigate();

  const { loading, error, data, refetch } = useQuery<RetData>(LvUserByUserIdQuery, {
    fetchPolicy: 'cache-and-network',
    variables: { userId: userId },
  });
  const [updateNewEmailByUserId] = useMutation(updateNewEmailByUserIDMutaion);

  const handleEmailChange = async () => {
    try {
      const response = await updateNewEmailByUserId({
        variables: { userId: userId, newEmail: newEmail },
      });
      const result: Lv_BasicResponse = response.data.updateNewEmailByUserId;
      if (result.retCode === '200') {
        setAlertMessage('이메일이 성공적으로 변경되었습니다!');
        setAlertSeverity('success');
        setOpen(true);
        setTimeout(() => {
          setOpen(false);
          router('/api/apps/profile/personal-information');
        }, 2000);
      } else {
        setAlertMessage(result.retMsg);
        setAlertSeverity('error');
        setOpen(true);
      }
    } catch (error) {
      setAlertMessage('이메일 변경 중 오류가 발생했습니다.');
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
          <Typography variant="h5">Change Email</Typography>
          <Divider sx={{ mb: 2 }} />
        </Grid>

        <Grid item xs={3}>
          <Typography variant="body1">현재 Email:</Typography>
        </Grid>
        <Grid item xs={7}>
          <Typography variant="body1">{data.lvUserByUserId.email}</Typography>
        </Grid>

        <Grid item xs={3}>
          <Typography variant="body1">새 Email :</Typography>
        </Grid>
        <Grid item xs={7} sx={{ height: '10px' }}>
          <TextField fullWidth variant="outlined" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
        </Grid>
        <Grid item xs={2}>
          <Button onClick={handleEmailChange}>변경</Button>
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
export default EmailProfile;
