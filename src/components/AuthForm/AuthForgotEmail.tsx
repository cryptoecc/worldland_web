import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Stack,
  Stepper,
  Step,
  StepLabel,
  Snackbar,
  Alert,
  Typography,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormLabel,
  TextField,
} from '@mui/material';
// import { useRouter } from "next/navigation";
import { useNavigate } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { searchedEmail } from '../../store/user/emailSlice';

import { validatePIN } from '../../utils/util';

import gql from 'graphql-tag';

import { useQuery, useMutation } from '@apollo/client';

interface Lv_BasicResponse {
  retCode: string;
  retMsg?: string | undefined;
}
interface Lv_ResetTokenPayload {
  userIdValue: string;
  pin: string;
}

const AddLvVerifyCodeByMobileMutation = gql`
  mutation AddLvVerifyCodeByMobile($country: String!, $mobile: String!) {
    addLvVerifyCodeByMobile(country: $country, mobile: $mobile) {
      retCode
      retMsg
    }
  }
`;

const CheckLvVerifyCodeByMobileMutaion = gql`
  mutation CheckLvVerifyCodeWithMobile($country: String!, $mobile: String!, $pin: String!) {
    checkLvVerifyCodeWithMobile(country: $country, mobile: $mobile, pin: $pin) {
      retCode
      retMsg
    }
  }
`;

const LvUserByMobileQuery = gql`
  query LvUserByMobile($country: String!, $mobile: String!) {
    lvUserByMobile(country: $country, mobile: $mobile) {
      email
    }
  }
`;

const steps = ['휴대전화 인증', '조회 결과'];

const AuthForgotEmail = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const [country, setCountry] = useState('KR');
  const [mobile, setMobile] = useState({ mobile1: '', mobile2: '', mobile3: '' });

  const [pinText, setPinText] = useState('Send'); //전송 버튼에 표시될 텍스트
  const [verifyLoading, setVerifyLoading] = useState(false); //코드 전송 버튼 상태
  const [verifyDisable, setVerifyDisable] = useState(true); //인증 버튼 활성, 비활성

  const [code, setCode] = useState(''); //인증 코드
  const [verifyToken, setVerifyToken] = useState<string>(''); //인증 토큰

  const [isVerified, setIsVerified] = useState(false); //인증 성공 유무

  const router = useNavigate();
  const dispatch = useDispatch();

  //뮤테이션
  const [addLvVerifyCodeByMobile, {}] = useMutation(AddLvVerifyCodeByMobileMutation);
  const [checkLvVerifyCodeByMobile, {}] = useMutation(CheckLvVerifyCodeByMobileMutaion);
  //쿼리
  const { data, error, loading } = useQuery(LvUserByMobileQuery, {
    variables: { country, mobile: `${mobile.mobile1}${mobile.mobile2}${mobile.mobile3}` },
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (loading) {
      return;
    }
    if (error) {
      setAlertMessage(error.message);
      setAlertOpen(true);
    }
    if (data && data.lvUserByMobile) {
      dispatch(searchedEmail(data.lvUserByMobile.email)); // 이메일 상태 업데이트
    }
  }, [loading, error, data, dispatch]);

  //이전 버튼
  const handleBack = () => {
    if (activeStep === 0) {
      router('/auth/auth2/login');
    }
    setIsVerified(false);
  };

  //국가 선택 입력
  const handleCountryChange = (e: SelectChangeEvent<string>) => {
    setCountry(e.target.value);
  };

  //폰 번호 입력
  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMobile((prev) => ({ ...prev, [name]: value }));
  };

  //인증코드 전송 버튼
  const handleSendToMobile = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (verifyLoading) {
      return;
    }

    setVerifyLoading(true);

    let endCount = 180; // 이메일 인증일 경우 300초, 모바일 인증이면 180초;
    let ingCount = endCount;
    setPinText(`${ingCount.toString()}s`);

    // 남은 시간 카운트해서 전송 버튼에서 보여주기
    const intervalId = setInterval(() => {
      ingCount = ingCount - 1;
      setPinText(`${ingCount.toString()}s`);
    }, 1000);

    // 타임아웃 되면...
    const doTimeOut = () => {
      clearInterval(intervalId); // 제한시간 초기화
      setPinText('Send'); // send 표시
      setVerifyLoading(false); // loading 표시 종료
      setVerifyDisable(true); // 인증 버튼 비활성화
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

    const fullMobileNumber = `${mobile.mobile1}${mobile.mobile2}${mobile.mobile3}`;

    try {
      const { data } = await addLvVerifyCodeByMobile({
        variables: {
          country: country,
          mobile: fullMobileNumber,
        },
      });

      if (data && data.addLvVerifyCodeByMobile) {
        const retData: Lv_BasicResponse = data.addLvVerifyCodeByMobile;
        console.log('addLvVerifyCodeByMobile 리턴데이터 :', retData);
        if (retData.retCode === '200') {
          setAlertMessage('모바일로 인증코드가 전송되었습니다.');
          setAlertOpen(true);
          setVerifyDisable(false); // 인증 버튼 활성화
        } else {
          clearTimer();
          setAlertMessage(String(retData.retMsg));
          setAlertOpen(true);
        }
      } else {
        throw new Error('Unexpected response structure.');
      }
    } catch (error: any) {
      setAlertMessage(error.message);
      setAlertOpen(true);
      setIsVerified(false);
      setCode('');
      setVerifyToken('');
      clearTimer();
    }
  };

  //인증 버튼
  const handleVerifyClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!validatePIN(code)) {
      setAlertMessage('유효하지 않은 인증코드 형식입니다.');
      setAlertOpen(true);
      return;
    }

    const fullMobileNumber = `${mobile.mobile1}${mobile.mobile2}${mobile.mobile3}`;

    try {
      const { data } = await checkLvVerifyCodeByMobile({
        variables: {
          country: country,
          mobile: fullMobileNumber,
          pin: code,
        },
      });

      if (data && data.checkLvVerifyCodeWithMobile) {
        const retData: Lv_BasicResponse = data.checkLvVerifyCodeWithMobile;
        console.log('checkLvVerifyCodeWithMobile 리턴데이터 :', retData);
        if (retData.retCode === '200') {
          setAlertMessage('인증코드가 확인되었습니다.');
          setAlertOpen(true);
          setIsVerified(true); // 인증 완료 상태
          setCode(code); // 인증 코드
          setVerifyToken(retData.retMsg as string); // 인증 체크 후, 생성된 토큰

          // 다음 탭으로 넘어가기
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } else {
          setAlertMessage(String(retData.retMsg));
          setAlertOpen(true);
        }
      } else {
        throw new Error('Unexpected response structure.');
      }
    } catch (error: any) {
      setAlertMessage(error.message);
      setAlertOpen(true);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Stack mt={4} spacing={2}>
            <FormLabel htmlFor="mobile" sx={{ color: '#d3d3d3' }}>
              Mobile
            </FormLabel>
            <Box display="flex" justifyContent="space-between" alignItems="stretch">
              <Select
                sx={{
                  height: '45px',
                  minWidth: '120px',
                  color: '#d3d3d3',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                }}
                id="country"
                name="country"
                variant="outlined"
                value={country}
                onChange={handleCountryChange}
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
                id="mobile1"
                name="mobile1"
                variant="outlined"
                value={mobile.mobile1}
                onChange={handleMobileChange}
                sx={{ input: { color: '#d3d3d3', borderRadius: '4px', border: '1px solid #ccc', height: '10px' } }}
              />
              <TextField
                id="mobile2"
                name="mobile2"
                variant="outlined"
                value={mobile.mobile2}
                onChange={handleMobileChange}
                sx={{ input: { color: '#d3d3d3', borderRadius: '4px', border: '1px solid #ccc', height: '10px' } }}
              />
              <TextField
                id="mobile3"
                name="mobile3"
                variant="outlined"
                value={mobile.mobile3}
                onChange={handleMobileChange}
                sx={{ input: { color: '#d3d3d3', borderRadius: '4px', border: '1px solid #ccc', height: '10px' } }}
              />
              <Button variant="contained" color="primary" onClick={handleSendToMobile} disabled={verifyLoading}>
                {pinText}
              </Button>
            </Box>
            <FormLabel htmlFor="verify-code" sx={{ color: '#d3d3d3' }}>
              Code
            </FormLabel>
            <Box display="flex" justifyContent="space-between">
              <TextField
                id="verifyCode"
                variant="outlined"
                value={code}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCode(e.target.value)}
                sx={{ input: { height: '10px', color: '#d3d3d3', borderRadius: '4px', border: '1px solid #ccc' } }}
              />
              <Button
                color="primary"
                variant="contained"
                size="large"
                disabled={verifyDisable}
                onClick={handleVerifyClick}
              >
                인증
              </Button>
            </Box>
          </Stack>
        );
      case 1:
        return (
          <Box textAlign="center">
            <Typography variant="h6" gutterBottom sx={{ color: '#d3d3d3' }}>
              이메일 조회 결과
            </Typography>
            <Typography sx={{ color: '#d3d3d3' }}>{data?.lvUserByMobile?.email}</Typography>
            <Button variant="contained" color="primary" component="a" href="/api/login">
              해당 이메일로 로그인 하러 가기
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
          fullWidth
          onClick={handleBack}
          style={{ display: activeStep === 1 ? 'none' : 'block' }}
        >
          Back to Login
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

export default AuthForgotEmail;
