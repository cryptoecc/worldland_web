import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Snackbar,
  Stack,
  Stepper,
  Step,
  StepLabel,
  InputAdornment,
  Typography,
  FormLabel,
  TextField,
} from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
// import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
// import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { validateEmail, validatePIN } from '../../utils/util';

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
      userpw
    }
  }
`;

const AddLvVerifyCodeByEmailMutation = gql`
  mutation AddLvVerifyCodeByEmail($email: String!) {
    addLvVerifyCodeByEmail(email: $email) {
      retCode
      retMsg
    }
  }
`;
const CheckLvVerifyCodeByEmailMutaion = gql`
  mutation CheckLvVerifyCodeWithEmail($email: String!, $pin: String!) {
    checkLvVerifyCodeWithEmail(email: $email, pin: $pin) {
      retCode
      retMsg
    }
  }
`;
const ResetLvPasswordByTokenMutation = gql`
  mutation ResetLvPasswordByToken($token: String!, $pin: String!, $newPw: String!) {
    resetLvPasswordByToken(token: $token, pin: $pin, newPW: $newPw) {
      retCode
      retMsg
    }
  }
`;

interface UserInfo {
  userpw: string;
}

interface RetData {
  lvUserByUserId: UserInfo;
}

interface Lv_BasicResponse {
  retCode: string;
  retMsg: string;
}

const steps = ['Email Verification', 'Reset Password', 'Complete'];

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const PasswordProfile = () => {
  const user = useSelector((state: AppState) => state.userReducer);
  const userId = user.userId;

  const [activeStep, setActiveStep] = useState(0);

  const [email, setEmail] = useState('');

  const [pinText, setPinText] = useState('Send'); //전송 버튼에 표시될 텍스트
  const [verifyLoading, setVerifyLoading] = useState(false); //코드 전송 버튼 상태
  const [verifyDisable, setVerifyDisable] = useState(true); //인증 버튼 활성, 비활성

  const [code, setCode] = useState(''); //인증 코드
  const [verifyToken, setVerifyToken] = useState<string>(''); //인증 토큰

  const [isVerified, setIsVerified] = useState(false); //인증 성공 유무

  const [newPassword, setNewPassword] = useState(''); //새로 설정한 비번
  const [confirmPassword, setConfirmPassword] = useState(''); //비번 확인

  //얼럿창 관련
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');

  //뮤테이션
  const [addLvVerifyCodeByEmail, {}] = useMutation(AddLvVerifyCodeByEmailMutation);
  const [checkLvVerifyCodeByEmail, {}] = useMutation(CheckLvVerifyCodeByEmailMutaion);
  const [resetLvPasswordByToken, {}] = useMutation(ResetLvPasswordByTokenMutation);

  const router = useNavigate();

  const { loading, error, data, refetch } = useQuery<RetData>(LvUserByUserIdQuery, {
    fetchPolicy: 'cache-and-network',
    variables: { userId: userId },
  });

  //현재 가입단계에 따라 next버튼에 다른 함수 적용
  const handleButtonClick = () => {
    if (activeStep === 1) {
      formik.handleSubmit();
    } else {
      handleNext();
    }
  };

  const formik = useFormik({
    initialValues: {
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .matches(
          /(?=.*[0-9]{1,})(?=.*[~`!@#$%^&*()-+=]{1,})(?=.*[a-zA-Z]{1,}).{8,}$/,
          'The password must be at least 8 characters long and include letters, numbers, and special characters.',
        )
        .required('Please enter your password.'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Passwords must match.')
        .required('Please enter your password confirmation.'),
    }),
    onSubmit: async (values) => {
      try {
        const { data } = await resetLvPasswordByToken({
          variables: {
            token: verifyToken,
            pin: code,
            newPw: newPassword,
          },
        });
        if (data.resetLvPasswordByToken.retCode === '200') {
          setAlertMessage('Your password has been successfully reset.');
          setOpen(true);
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } else {
          setAlertMessage(String(data.resetLvPasswordByToken.retMsg));
          setOpen(true);
        }
      } catch (error) {
        setAlertMessage('An error occurred during password reset.');
        setAlertSeverity('error');
        setOpen(true);
      }
    },
  });

  //다음 버튼
  const handleNext = () => {
    if (activeStep === 0 && !isVerified) {
      setAlertMessage('You need to complete email verification.');
      setOpen(true);
      return;
    }
    if (activeStep === 1 && newPassword !== confirmPassword) {
      setAlertMessage('The passwords do not match.');
      setOpen(true);
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  //이전 버튼
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setIsVerified(false);
  };

  //인증코드 전송 버튼
  const handleSendToEmail = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (verifyLoading) {
      return;
    }
    if (!validateEmail) {
      setAlertMessage('Invalid email format.');
      setOpen(true);
      return;
    }

    setVerifyLoading(true);

    let endCount = 300; //이메일 인증일 경우 300초, 모바일 인증이면 180초;
    let ingCount = endCount;
    setPinText(`${ingCount.toString()}s`);

    //남은 시간 카운트해서 전송 버튼에서 보여주기
    const intervalId = setInterval(() => {
      ingCount = ingCount - 1;
      setPinText(`${ingCount.toString()}s`);
    }, 1000);

    //타임아웃 되면...
    const doTimeOut = () => {
      clearInterval(intervalId); //제한시간 초기화
      setPinText('Send'); //send 표시
      setVerifyLoading(false); //loading 표시 종료
      setVerifyDisable(true); //인증 버튼 비활성화
    };

    // 타임아웃 설정
    const timeoutId = setTimeout(() => {
      doTimeOut();
    }, endCount * 1000);

    // 타임아웃 해제
    const clearTimer = () => {
      clearTimeout(timeoutId);
      doTimeOut();
    };

    setCode('');

    addLvVerifyCodeByEmail({
      variables: {
        email: email,
      },
    })
      .then((res) => {
        const retData: Lv_BasicResponse = res.data.addLvVerifyCodeByEmail;
        console.log('addLvVerifyCodeByEmail 리턴데이터 :', retData);
        if (retData.retCode == '200') {
          setAlertMessage('An authentication code has been sent to your email.');
          setOpen(true);
          setVerifyDisable(false); //인증 버튼 활성화
        } else {
          clearTimer();
          setAlertMessage(String(retData.retMsg));
          setOpen(true);
        }
      })
      .catch((error) => {
        setAlertMessage(error.message);
        setOpen(true);
        setIsVerified(false);
        setCode('');
        setVerifyToken('');
        clearTimer();
      });
  };

  //인증 버튼
  const handleVerifyClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!validatePIN(code)) {
      setAlertMessage('Invalid authentication code format.');
      setOpen(true);
      return;
    }

    checkLvVerifyCodeByEmail({
      variables: {
        email: email,
        pin: code,
      },
    })
      .then((res) => {
        const retData: Lv_BasicResponse = res.data.checkLvVerifyCodeWithEmail;
        console.log('checkLvVerifyCodeWithEmail 리턴데이터 :', retData);
        if (retData.retCode == '200') {
          setAlertMessage('The authentication code has been verified.');
          setOpen(true);
          setIsVerified(true); //인증 완료 상태
          setCode(code); //인증 코드
          setVerifyToken(retData.retMsg as string); //인증 체크 후, 생성된 토큰
        } else {
          setAlertMessage(String(retData.retMsg));
          setOpen(true);
        }
      })
      .catch((error) => {
        setAlertMessage(error.message);
        setOpen(true);
      });
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Stack mt={4} spacing={2}>
            <FormLabel htmlFor="email">Email Address</FormLabel>
            <TextField
              id="email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button variant="contained" color="primary" onClick={handleSendToEmail} disabled={verifyLoading}>
                      {pinText}
                    </Button>
                  </InputAdornment>
                ),
              }}
            />

            <FormLabel htmlFor="verify-code">Verify Code</FormLabel>
            <TextField
              id="verifyCode"
              variant="outlined"
              fullWidth
              value={code}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCode(e.target.value)}
            />
            <Button
              color="primary"
              variant="contained"
              size="large"
              fullWidth
              disabled={verifyDisable}
              onClick={handleVerifyClick}
            >
              Verification
            </Button>
          </Stack>
        );
      case 1:
        return (
          <Stack mt={4} spacing={2}>
            <FormLabel htmlFor="newPassword">New Password</FormLabel>
            <TextField
              id="newPassword"
              name="newPassword"
              variant="outlined"
              type="password"
              fullWidth
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
              helperText={formik.touched.newPassword && formik.errors.newPassword}
            />
            <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
            <TextField
              id="confirmPassword"
              name="confirmPassword"
              variant="outlined"
              type="password"
              fullWidth
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
            />
          </Stack>
        );
      case 2:
        return (
          <Box textAlign="center">
            <Typography variant="h6" gutterBottom>
              Password reset is complete!
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Card sx={{ p: 4 }}>
      <Box my={3}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {renderStepContent(activeStep)}

      <Box display="flex" justifyContent="space-between" mt={3}>
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={handleBack}
          style={{ display: activeStep === 0 || activeStep === 2 ? 'none' : 'block' }}
        >
          Back
        </Button>
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={handleButtonClick}
          style={{ display: activeStep === 2 ? 'none' : 'block' }}
        >
          {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </Box>
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
export default PasswordProfile;
