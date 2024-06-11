import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Select,
  MenuItem,
  Checkbox,
  Snackbar,
  Alert,
  TextField,
  FormControlLabel,
  InputLabel,
} from '@mui/material';
// import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
// import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import { Stack } from '@mui/system';
// import { registerType } from "@/app/(DashboardLayout)/types/auth/auth";
// import AuthSocialButtons from "./AuthSocialButtons";
import { styled } from '@mui/material/styles';
import { validatePIN } from '../../utils/util';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';

//utils for form
// import { useFormik } from "formik";
import { useFormik } from 'formik';
import * as Yup from 'yup';

//graphql
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import './styles.css';

const steps = ['약관 동의', '정보 입력', '가입 완료'];

const CHECK_NICKNAME_MUTATION = gql`
  mutation CheckNickname($nickname: String!) {
    checkNickname(nickname: $nickname) {
      retCode
      retMsg
    }
  }
`;

const CHECK_EMAIL_MUTATION = gql`
  mutation CheckEmail($email: String!) {
    checkEmail(email: $email) {
      retCode
      retMsg
    }
  }
`;

const REGISTER_LV_USER = gql`
  mutation RegisterLvUser(
    $email: String!
    $nickname: String!
    $password: String!
    $country: String!
    $mobile: String!
  ) {
    registerLvUser(email: $email, nickname: $nickname, password: $password, country: $country, mobile: $mobile) {
      retCode
      retMsg
    }
  }
`;

const ADD_LV_VERIFY_CODE_BY_MOBILE_FOR_REGISTER = gql`
  mutation AddLvVerifyCodeByMobileForRegister($country: String!, $mobile: String!) {
    addLvVerifyCodeByMobileForRegister(country: $country, mobile: $mobile) {
      retCode
      retMsg
    }
  }
`;

const CHECK_LV_VERIFY_CODE_BY_MOBILE = gql`
  mutation CheckLvVerifyCodeWithMobile($country: String!, $mobile: String!, $pin: String!) {
    checkLvVerifyCodeWithMobile(country: $country, mobile: $mobile, pin: $pin) {
      retCode
      retMsg
    }
  }
`;

const AuthRegister = ({ title, subtitle, subtext }: any) => {
  const [activeStep, setActiveStep] = useState(0);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');

  //인증코드 관련 상태
  const [verifyDisable, setVerifyDisable] = useState(true);
  const [pinText, setPinText] = useState('Send');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [code, setCode] = useState(''); //인증 코드
  const [isVerified, setIsVerified] = useState(false); //인증 성공 유무

  //뮤테이션
  const [checkEmail] = useMutation(CHECK_EMAIL_MUTATION);
  const [checkNickname] = useMutation(CHECK_NICKNAME_MUTATION);
  const [registerLvUser] = useMutation(REGISTER_LV_USER);
  const [addLvVerifyCodeByMobileForRegister] = useMutation(ADD_LV_VERIFY_CODE_BY_MOBILE_FOR_REGISTER);
  const [checkLvVerifyCodeByMobile] = useMutation(CHECK_LV_VERIFY_CODE_BY_MOBILE);

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
      email: '',
      nickname: '',
      password: '',
      passwordConfirm: '',
      country: 'KR',
      mobile1: '',
      mobile2: '',
      mobile3: '',
      verifyCode: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('유효하지 않은 이메일 주소입니다.').required('이메일을 입력해주세요.'),
      nickname: Yup.string().required('닉네임을 입력해주세요.'),
      password: Yup.string()
        .matches(
          /(?=.*[0-9]{1,})(?=.*[~`!@#$%^&*()-+=]{1,})(?=.*[a-zA-Z]{1,}).{8,}$/,
          '비밀번호는 8자리 이상, 영문자와 숫자, 특수문자를 포함해주세요.)',
        )
        .required('비밀번호를 입력해주세요.'),
      passwordConfirm: Yup.string()
        .oneOf([Yup.ref('password')], '비밀번호가 일치해야 합니다.')
        .required('Required'),
      country: Yup.string().required('국가를 선택해주세요.'),
      mobile1: Yup.string()
        .required('3자리 숫자를 입력해주세요.')
        .matches(/^\d{3}$/, '3자리 숫자를 입력해주세요.'),
      mobile2: Yup.string()
        .required('4자리 숫자를 입력해주세요.')
        .matches(/^\d{4}$/, '4자리 숫자를 입력해주세요.'),
      mobile3: Yup.string()
        .required('4자리 숫자를 입력해주세요.')
        .matches(/^\d{4}$/, '4자리 숫자를 입력해주세요.'),
      verifyCode: Yup.string().required('인증코드를 입력해주세요.'),
    }),
    onSubmit: async (values: any) => {
      const mobile = `${values.mobile1}${values.mobile2}${values.mobile3}`;
      try {
        const { data } = await registerLvUser({
          variables: {
            email: values.email,
            nickname: values.nickname,
            password: values.password,
            country: values.country,
            mobile: mobile,
          },
        });
        if (data.registerLvUser.retCode === '200') {
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } else {
          alert(data.registerLvUser.retMsg);
        }
      } catch (error) {
        alert('회원가입에 실패하였습니다. 다시 시도해주세요.');
      }
    },
  });

  const handleNext = () => {
    if (activeStep === 0 && (!termsAccepted || !privacyAccepted)) {
      setAlertMessage('모든 약관에 동의해야 합니다.');
      setAlertOpen(true);
      return;
    }
    if (activeStep === 1 && !isVerified) {
      setAlertMessage('휴대전화번호 인증을 완료해야 합니다.');
      setAlertOpen(true);
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setIsVerified(false);
  };

  const handleEmailCheck = async () => {
    try {
      const { data } = await checkEmail({ variables: { email } });
      setAlertMessage(data.checkEmail.retMsg);
      if (data.checkEmail.retCode != 200) {
        setEmail('');
      }
    } catch (error) {
      setAlertMessage('이메일 확인에 실패했습니다.');
    }
    setAlertOpen(true);
  };

  const handleNicknameCheck = async () => {
    try {
      const { data } = await checkNickname({ variables: { nickname } });
      setAlertMessage(data.checkNickname.retMsg);
      if (data.checkNickname.retCode != 200) {
        setNickname('');
      }
    } catch (error) {
      setAlertMessage('닉네임 확인에 실패했습니다.');
    }
    setAlertOpen(true);
  };

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

    const timeoutId = setTimeout(() => {
      doTimeOut();
    }, endCount * 1000);

    const clearTimer = () => {
      clearTimeout(timeoutId);
      doTimeOut();
    };

    setCode('');

    const mobile = `${formik.values.mobile1}${formik.values.mobile2}${formik.values.mobile3}`;

    try {
      const { data } = await addLvVerifyCodeByMobileForRegister({
        variables: {
          country: formik.values.country,
          mobile: mobile,
        },
      });

      if (data && data.addLvVerifyCodeByMobileForRegister.retCode === '200') {
        setAlertMessage('모바일로 인증코드가 전송되었습니다.');
        setAlertOpen(true);
        setVerifyDisable(false);
      } else {
        clearTimer();
        setAlertMessage(data.addLvVerifyCodeByMobileForRegister.retMsg);
        setAlertOpen(true);
      }
    } catch (error: any) {
      setAlertMessage('인증코드 전송에 실패했습니다. 다시 시도해주세요.');
      setAlertOpen(true);
      setIsVerified(false);
      setCode('');
      clearTimer();
    }
  };

  const handleVerifyClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!validatePIN(formik.values.verifyCode)) {
      setAlertMessage('유효하지 않은 인증코드 형식입니다.');
      setAlertOpen(true);
      return;
    }

    const mobile = `${formik.values.mobile1}${formik.values.mobile2}${formik.values.mobile3}`;

    try {
      const { data } = await checkLvVerifyCodeByMobile({
        variables: {
          country: formik.values.country,
          mobile: mobile,
          pin: formik.values.verifyCode,
        },
      });

      if (data && data.checkLvVerifyCodeWithMobile.retCode === '200') {
        setAlertMessage('인증코드가 확인되었습니다.');
        setAlertOpen(true);
        setIsVerified(true); // 인증 완료 상태
        setCode(formik.values.verifyCode); // 인증 코드
        setVerifyDisable(true);
      } else {
        setAlertMessage(data.checkLvVerifyCodeWithMobile.retMsg);
        setAlertOpen(true);
      }
    } catch (error) {
      setAlertMessage('인증코드 확인에 실패했습니다. 다시 시도해주세요.');
      setAlertOpen(true);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              약관 동의
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Checkbox checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} />
                <Typography display="inline">이용 약관에 동의합니다</Typography>
              </Box>
              <Box>
                <Checkbox checked={privacyAccepted} onChange={(e) => setPrivacyAccepted(e.target.checked)} />
                <Typography display="inline">개인정보 처리방침에 동의합니다</Typography>
              </Box>
            </Stack>
          </Box>
        );
      case 1:
        return (
          <form onSubmit={formik.handleSubmit}>
            <Stack mb={3}>
              <InputLabel htmlFor="email" sx={{ color: '#d3d3d3' }}>
                Email
              </InputLabel>
              <Box display="flex" justifyContent="space-between">
                <TextField
                  id="email"
                  name="email"
                  variant="outlined"
                  fullWidth
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={
                    formik.touched.email && typeof formik.errors.email === 'string' ? formik.errors.email : ''
                  }
                  sx={{
                    input: {
                      color: '#d3d3d3',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      height: '10px',
                    },
                    marginTop: '10px',
                  }}
                />
                <Button onClick={handleEmailCheck}>중복확인</Button>
              </Box>
              <InputLabel htmlFor="nickname" sx={{ color: '#d3d3d3', marginTop: '30px' }}>
                Nick Name
              </InputLabel>
              <Box display="flex" justifyContent="space-between">
                <TextField
                  id="nickname"
                  name="nickname"
                  variant="outlined"
                  value={nickname}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNickname(e.target.value)}
                  onBlur={formik.handleBlur}
                  error={formik.touched.nickname && Boolean(formik.errors.nickname)}
                  helperText={
                    formik.touched.nickname && formik.errors.nickname === 'string' ? formik.errors.nickname : ''
                  }
                  sx={{
                    input: {
                      color: '#d3d3d3',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      height: '10px',
                    },
                    marginTop: '10px',
                  }}
                />
                <Button onClick={handleNicknameCheck}>중복확인</Button>
              </Box>
              <InputLabel htmlFor="password" sx={{ color: '#d3d3d3', marginTop: '30px' }}>
                Password
              </InputLabel>
              <TextField
                id="password"
                name="password"
                type="password"
                variant="outlined"
                fullWidth
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={
                  formik.touched.password && formik.errors.password === 'string' ? formik.errors.password : ''
                }
                sx={{
                  input: { color: '#d3d3d3', borderRadius: '4px', border: '1px solid #ccc', height: '10px' },
                  marginTop: '10px',
                }}
              />
              <InputLabel htmlFor="password-confirm" sx={{ color: '#d3d3d3', marginTop: '30px' }}>
                Password confirm
              </InputLabel>
              <TextField
                id="passwordConfirm"
                name="passwordConfirm"
                type="password"
                variant="outlined"
                fullWidth
                value={formik.values.passwordConfirm}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.passwordConfirm && Boolean(formik.errors.passwordConfirm)}
                helperText={
                  formik.touched.passwordConfirm && formik.errors.passwordConfirm === 'string'
                    ? formik.errors.passwordConfirm
                    : ''
                }
                sx={{
                  input: { color: '#d3d3d3', borderRadius: '4px', border: '1px solid #ccc', height: '10px' },
                  marginTop: '10px',
                }}
              />
              <InputLabel htmlFor="mobile" sx={{ color: '#d3d3d3', marginTop: '30px' }}>
                Mobile
              </InputLabel>
              <Box display="flex" justifyContent="space-between" alignItems="stretch">
                <Select
                  sx={{
                    // height: '60%',
                    minWidth: '120px',
                    color: '#d3d3d3',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    marginTop: '10px',
                    height: '45px',
                  }}
                  id="country"
                  name="country"
                  variant="outlined"
                  value={formik.values.country}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.country && Boolean(formik.errors.country)}
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
                  inputProps={{ maxLength: 3, pattern: '[0-9]*' }}
                  value={formik.values.mobile1}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.mobile1 && Boolean(formik.errors.mobile1)}
                  helperText={formik.touched.mobile1 && formik.errors.mobile1 === 'string' ? formik.errors.mobile1 : ''}
                  sx={{
                    input: { color: '#d3d3d3', borderRadius: '4px', border: '1px solid #ccc', height: '10px' },
                    marginTop: '10px',
                  }}
                />
                <TextField
                  id="mobile2"
                  name="mobile2"
                  variant="outlined"
                  inputProps={{ maxLength: 4, pattern: '[0-9]*' }}
                  value={formik.values.mobile2}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.mobile2 && Boolean(formik.errors.mobile2)}
                  helperText={formik.touched.mobile2 && formik.errors.mobile2 === 'string' ? formik.errors.mobile2 : ''}
                  sx={{
                    input: { color: '#d3d3d3', borderRadius: '4px', border: '1px solid #ccc', height: '10px' },
                    marginTop: '10px',
                  }}
                />
                <TextField
                  id="mobile3"
                  name="mobile3"
                  variant="outlined"
                  inputProps={{ maxLength: 4, pattern: '[0-9]*' }}
                  value={formik.values.mobile3}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.mobile3 && Boolean(formik.errors.mobile3)}
                  helperText={formik.touched.mobile3 && formik.errors.mobile3 === 'string' ? formik.errors.mobile3 : ''}
                  sx={{
                    input: { color: '#d3d3d3', borderRadius: '4px', border: '1px solid #ccc', height: '10px' },
                    marginTop: '10px',
                  }}
                />
                <Button onClick={handleSendToMobile} disabled={verifyLoading}>
                  {pinText}
                </Button>
              </Box>
              <InputLabel htmlFor="verify-code" sx={{ color: '#d3d3d3', marginTop: '30px' }}>
                Code
              </InputLabel>
              <Box display="flex" justifyContent="space-between">
                <TextField
                  id="verifyCode"
                  name="verifyCode"
                  variant="outlined"
                  value={formik.values.verifyCode}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.verifyCode && Boolean(formik.errors.verifyCode)}
                  helperText={
                    formik.touched.verifyCode && formik.errors.verifyCode === 'string' ? formik.errors.verifyCode : ''
                  }
                  sx={{
                    input: { color: '#d3d3d3', borderRadius: '4px', border: '1px solid #ccc', height: '10px' },
                    marginTop: '10px',
                  }}
                />
                <Button onClick={handleVerifyClick} disabled={verifyDisable}>
                  인증
                </Button>
              </Box>
            </Stack>
          </form>
        );
      case 2:
        return (
          <Box textAlign="center">
            <Typography variant="h6" gutterBottom>
              가입이 완료되었습니다!
            </Typography>
            <Button variant="contained" color="primary" component="a" href="/auth/auth2/login">
              로그인 하러 가기
            </Button>
          </Box>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    formik.setFieldValue('email', email);
    if (email) {
      formik.setFieldTouched('email', true);
    }
    formik.setFieldValue('nickname', nickname);
    if (nickname) {
      formik.setFieldTouched('nickname', true);
    }
  }, [email, nickname]);

  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h3" mb={1}>
          {title}
        </Typography>
      ) : null}

      <Box my={3} sx={{ fontWeight: 'bold' }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label} sx={{ color: 'red' }}>
              <StepLabel sx={{ color: 'red' }}>{label}</StepLabel>
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
      {subtitle}
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={() => setAlertOpen(false)}>
        <Alert onClose={() => setAlertOpen(false)} severity="warning">
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AuthRegister;
