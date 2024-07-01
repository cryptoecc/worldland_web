import { useState } from 'react';
import {
  Box,
  Button,
  Stack,
  Stepper,
  Step,
  StepLabel,
  Snackbar,
  Alert,
  InputAdornment,
  Typography,
  TextField,
  FormLabel,
} from '@mui/material';
// import Link from "next/link";

import { validateEmail, validatePIN } from '../../utils/util';

// import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
// import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";

import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';

interface Lv_BasicResponse {
  retCode: string;
  retMsg?: string | undefined;
}
interface Lv_ResetTokenPayload {
  userIdValue: string;
  pin: string;
}

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

const steps = ['이메일 인증', '비밀번호 재설정', '완료'];

const AuthForgotPassword = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const [email, setEmail] = useState('');

  const [pinText, setPinText] = useState('Send'); //전송 버튼에 표시될 텍스트
  const [verifyLoading, setVerifyLoading] = useState(false); //코드 전송 버튼 상태
  const [verifyDisable, setVerifyDisable] = useState(true); //인증 버튼 활성, 비활성

  const [code, setCode] = useState(''); //인증 코드
  const [verifyToken, setVerifyToken] = useState<string>(''); //인증 토큰

  const [isVerified, setIsVerified] = useState(false); //인증 성공 유무

  const [newPassword, setNewPassword] = useState(''); //새로 설정한 비번
  const [confirmPassword, setConfirmPassword] = useState(''); //비번 확인

  //뮤테이션
  const [addLvVerifyCodeByEmail, {}] = useMutation(AddLvVerifyCodeByEmailMutation);
  const [checkLvVerifyCodeByEmail, {}] = useMutation(CheckLvVerifyCodeByEmailMutaion);
  const [resetLvPasswordByToken, {}] = useMutation(ResetLvPasswordByTokenMutation);

  //다음 버튼
  const handleNext = () => {
    if (activeStep === 0 && !isVerified) {
      setAlertMessage('이메일 인증을 완료해야 합니다.');
      setAlertOpen(true);
      return;
    }
    if (activeStep === 1 && newPassword !== confirmPassword) {
      setAlertMessage('비밀번호가 일치하지 않습니다.');
      setAlertOpen(true);
      return;
    }
    if (activeStep === 1) {
      resetLvPasswordByToken({
        variables: {
          token: verifyToken,
          pin: code,
          newPw: newPassword,
        },
      })
        .then((res) => {
          const retData: Lv_BasicResponse = res.data.resetLvPasswordByToken;
          console.log('resetLvPasswordByToken 리턴데이터 :', retData);
          if (retData.retCode === '200') {
            setAlertMessage('비밀번호가 성공적으로 재설정되었습니다.');
            setAlertOpen(true);
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
          } else {
            setAlertMessage(String(retData.retMsg));
            setAlertOpen(true);
          }
        })
        .catch((error) => {
          setAlertMessage(error.message);
          setAlertOpen(true);
        });
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
      setAlertMessage('유효하지 않은 이메일 형식입니다.');
      setAlertOpen(true);
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
          setAlertMessage('이메일로 인증코드가 전송되었습니다.');
          setAlertOpen(true);
          setVerifyDisable(false); //인증 버튼 활성화
        } else {
          clearTimer();
          setAlertMessage(String(retData.retMsg));
          setAlertOpen(true);
        }
      })
      .catch((error) => {
        setAlertMessage(error.message);
        setAlertOpen(true);
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
      setAlertMessage('유효하지 않은 인증코드 형식입니다.');
      setAlertOpen(true);
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
          setAlertMessage('인증코드가 확인되었습니다.');
          setAlertOpen(true);
          setIsVerified(true); //인증 완료 상태
          setCode(code); //인증 코드
          setVerifyToken(retData.retMsg as string); //인증 체크 후, 생성된 토큰
        } else {
          setAlertMessage(String(retData.retMsg));
          setAlertOpen(true);
        }
      })
      .catch((error) => {
        setAlertMessage(error.message);
        setAlertOpen(true);
      });
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Stack mt={4} spacing={2}>
            <FormLabel htmlFor="email" sx={{ color: 'black' }}>
              Email Address
            </FormLabel>
            <Box display="flex" justifyContent="space-between">
              <TextField
                id="email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                sx={{
                  input: {
                    color: 'black',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    height: '10px',
                  },
                  marginRight: '10px',
                }}
              />
              <Button variant="contained" color="primary" onClick={handleSendToEmail} disabled={verifyLoading}>
                {pinText}
              </Button>
            </Box>
            <FormLabel htmlFor="verify-code" sx={{ color: 'black' }}>
              Verify Code
            </FormLabel>
            <TextField
              id="verifyCode"
              variant="outlined"
              fullWidth
              value={code}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCode(e.target.value)}
              sx={{
                input: {
                  color: 'black',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  height: '10px',
                },
              }}
            />
            <Button
              color="primary"
              variant="contained"
              size="large"
              fullWidth
              disabled={verifyDisable}
              onClick={handleVerifyClick}
            >
              인증
            </Button>
          </Stack>
        );
      case 1:
        return (
          <Stack mt={4} spacing={2}>
            <FormLabel htmlFor="newPassword" sx={{ color: 'black' }}>
              New Password
            </FormLabel>
            <TextField
              id="newPassword"
              variant="outlined"
              type="password"
              fullWidth
              value={newPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
              sx={{
                input: {
                  color: 'black',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  height: '10px',
                },
              }}
            />
            <FormLabel htmlFor="confirmPassword" sx={{ color: 'black' }}>
              Confirm Password
            </FormLabel>
            <TextField
              id="confirmPassword"
              variant="outlined"
              type="password"
              fullWidth
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              sx={{
                input: {
                  color: 'black',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  height: '10px',
                },
              }}
            />
          </Stack>
        );
      case 2:
        return (
          <Box textAlign="center">
            <Typography variant="h6" gutterBottom sx={{ color: 'black' }}>
              비밀번호 재설정이 완료되었습니다!
            </Typography>
            <Button variant="contained" color="primary" component="a" href="/">
              메인으로 이동
            </Button>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <>
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
          onClick={handleNext}
          style={{ display: activeStep === 2 ? 'none' : 'block' }}
        >
          {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </Box>
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={() => setAlertOpen(false)}>
        <Alert onClose={() => setAlertOpen(false)} severity="warning">
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AuthForgotPassword;
