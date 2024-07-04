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
      nickname
    }
  }
`;

const updateNewNicknameByUserIDMutaion = gql`
  mutation UpdateNewNicknameByUserId($userId: String!, $newNickname: String!) {
    updateNewNicknameByUserId(userId: $userId, newNickname: $newNickname) {
      retCode
      retMsg
    }
  }
`;

interface UserInfo {
  nickname: string;
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

const NicknameProfile = () => {
  const user = useSelector((state: AppState) => state.userReducer);
  const userId = user.userId;
  const [newNickname, setNewNickname] = useState('');
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');

  const router = useNavigate();

  const { loading, error, data, refetch } = useQuery<RetData>(LvUserByUserIdQuery, {
    fetchPolicy: 'cache-and-network',
    variables: { userId: userId },
  });

  const [updateNewNicknameByUserId] = useMutation(updateNewNicknameByUserIDMutaion);

  const handleNicknameChange = async () => {
    try {
      const response = await updateNewNicknameByUserId({
        variables: { userId: userId, newNickname: newNickname },
      });
      const result: Lv_BasicResponse = response.data.updateNewNicknameByUserId;
      if (result.retCode === '200') {
        setAlertMessage('닉네임이 성공적으로 변경되었습니다!');
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
      setAlertMessage('닉네임 변경 중 오류가 발생했습니다.');
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
          <Typography variant="h5">Change Nickname</Typography>
          <Divider sx={{ mb: 2 }} />
        </Grid>

        <Grid item xs={3}>
          <Typography variant="body1">Current Nickname:</Typography>
        </Grid>
        <Grid item xs={7}>
          <Typography variant="body1">{data.lvUserByUserId.nickname}</Typography>
        </Grid>

        <Grid item xs={3}>
          <Typography variant="body1">New Nickname :</Typography>
        </Grid>
        <Grid item xs={7}>
          <TextField
            fullWidth
            variant="outlined"
            value={newNickname}
            onChange={(e) => setNewNickname(e.target.value)}
          />
        </Grid>
        <Grid item xs={2}>
          <Button onClick={handleNicknameChange}>Change</Button>
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
export default NicknameProfile;
