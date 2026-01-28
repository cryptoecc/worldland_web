import React, { useState } from 'react';
import { Box, Button, Card, Typography, Grid, Divider, TextField, Snackbar, Select, MenuItem } from '@mui/material';
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
      mobile
      country {
        name
        calling_code
      }
    }
  }
`;

const updateNewMobileByUserIDMutaion = gql`
  mutation UpdateNewMobileByUserId($userId: String!, $newCountry: String!, $newMobile: String!) {
    updateNewMobileByUserId(userId: $userId, newCountry: $newCountry, newMobile: $newMobile) {
      retCode
      retMsg
    }
  }
`;

interface Country {
  name: string;
  calling_code: string;
}

interface UserInfo {
  country: Country;
  mobile: string;
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

const MobileProfile = () => {
  const user = useSelector((state: AppState) => state.userReducer);
  const userId = user.userId;
  const [newCountry, setNewCountry] = useState('KR');
  const [newMobile1, setNewMobile1] = useState('');
  const [newMobile2, setNewMobile2] = useState('');
  const [newMobile3, setNewMobile3] = useState('');
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');

  const dispatch = useDispatch();
  const router = useNavigate();

  const { loading, error, data, refetch } = useQuery<RetData>(LvUserByUserIdQuery, {
    fetchPolicy: 'cache-and-network',
    variables: { userId: userId },
  });

  const [updateNewMobileByUserId] = useMutation(updateNewMobileByUserIDMutaion);

  const handleMobileChange = async () => {
    const newMobile = `${newMobile1}${newMobile2}${newMobile3}`;
    try {
      const response = await updateNewMobileByUserId({
        variables: { userId: userId, newCountry: newCountry, newMobile: newMobile },
      });
      const result: Lv_BasicResponse = response.data.updateNewMobileByUserId;
      if (result.retCode === '200') {
        setAlertMessage('연락처가 성공적으로 변경되었습니다!');
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
      setAlertMessage('연락처 변경 중 오류가 발생했습니다.');
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

  const formatPhoneNumber = (phoneNumber: string, callingCode: string) => {
    const numberWithoutCountryCode = phoneNumber.slice(callingCode.length - 1);
    const formattedNumber = `0${numberWithoutCountryCode}`;
    return formattedNumber.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  };

  const handleMobileInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setMobile: React.Dispatch<React.SetStateAction<string>>,
    maxLength: number,
  ) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= maxLength) {
      setMobile(value);
    }
  };

  return (
    <Card sx={{ p: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h5">Change Mobile</Typography>
          <Divider sx={{ mb: 2 }} />
        </Grid>

        <Grid item xs={3}>
          <Typography variant="body1">Current Mobile:</Typography>
        </Grid>
        <Grid item xs={7}>
          <Typography variant="body1">{data.lvUserByUserId.country.name}</Typography>
          <Typography variant="body1">{data.lvUserByUserId.country.calling_code}</Typography>
          <Typography variant="body1">
            {formatPhoneNumber(data.lvUserByUserId.mobile, data.lvUserByUserId.country.calling_code)}
          </Typography>
        </Grid>

        <Grid item xs={3}>
          <Typography variant="body1">New Mobile :</Typography>
        </Grid>
        <Grid item xs={7}>
          <Box display="flex" justifyContent="space-between" alignItems="stretch">
            <Select
              sx={{ height: '100%', minWidth: '120px' }}
              id="country"
              name="country"
              variant="outlined"
              value={newCountry}
              onChange={(e) => setNewCountry(e.target.value)}
            >
              <MenuItem value="AU">Australia</MenuItem>
              <MenuItem value="CA">Canada</MenuItem>
              <MenuItem value="CN">China</MenuItem>
              <MenuItem value="HK">Hong Kong</MenuItem>
              <MenuItem value="ID">Indonesia</MenuItem>
              <MenuItem value="JP">Japan</MenuItem>
              <MenuItem value="KR">Korea (Republic of)</MenuItem>
              <MenuItem value="MN">Mongolia</MenuItem>
              <MenuItem value="MO">Macau</MenuItem>
              <MenuItem value="MY">Malaysia</MenuItem>
              <MenuItem value="PH">Philippines</MenuItem>
              <MenuItem value="SG">Singapore</MenuItem>
              <MenuItem value="TH">Thailand</MenuItem>
              <MenuItem value="UK">United Kingdom</MenuItem>
              <MenuItem value="US">United States</MenuItem>
            </Select>
            <TextField
              variant="outlined"
              value={newMobile1}
              onChange={(e) => handleMobileInputChange(e, setNewMobile1, 3)}
            />
            <TextField
              variant="outlined"
              value={newMobile2}
              onChange={(e) => handleMobileInputChange(e, setNewMobile2, 4)}
            />
            <TextField
              variant="outlined"
              value={newMobile3}
              onChange={(e) => handleMobileInputChange(e, setNewMobile3, 4)}
            />
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Button onClick={handleMobileChange}>변경</Button>
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
export default MobileProfile;
