import React, { useState } from 'react';
import { Typography, Box, Divider, Button, Stack, Snackbar } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import gql from 'graphql-tag';
import { useNavigate } from 'react-router-dom';
import { WorldLandLogo } from 'assets';
import styled from 'styled-components';
import { provider } from 'configs/axios';
import { useToasts } from 'react-toast-notifications';
import { MESSAGES } from 'utils/messages';
import { useLogin } from 'hooks/useLogin';
import { validateEmail } from 'utils/util';
import { loginType } from 'types/LoginType';
import { AuthPayLoad } from '../../types/AuthPayload';

//graphql
import { useMutation } from '@apollo/client';
import TokenService from '../../utils/TokenService';

//redux
import { useAppDispatch } from '../../store/store';
import { userId, userEmail, userMobile, userLevel } from '../../store/user/UserSlice';

// 스타일 컴포넌트 정의
const Container = styled.div`
  display: flex;
  /* background-color: #242424; */
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #d3d3d3;
  /* margin-top: 100px; */
  /* height: 100vh; */
`;

const Logo = styled.div`
  width: 200px;
  margin: 0 auto;
  margin-top: 40px;
  /* max-width: 200px; */
`;

const Title = styled.h2`
  margin-bottom: 1rem;
  color: #d3d3d3;
  font-weight: bold;
`;

const LoginForm = styled.form`
  /* position: relative; 부모 컨테이너에 대해 상대적 포지션 지정 */
  background-color: #333;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-top: 200px;
  width: 500px;
  height: 550px;

  /* margin: 0 auto; 중앙 정렬을 위해 추가 */
`;

const InputGroup = styled.div`
  width: 100%;
  flex-direction: column;
  margin-bottom: 20px;

  @media (min-width: 600px) {
    flex-direction: row;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 1rem;
  border: 1px solid #ccc; // 경계선 스타일 지정
  border-radius: 4px; // 경계선 둥글게
`;

const Button2 = styled.button`
  /* position: absolute; 포지션을 절대로 지정 */
  width: 100%;
  bottom: 10px; /* 상단 여백 조정 */
  font-weight: bold;
  padding: 12px;
  background-color: #007bff;
  color: #d3d3d3;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const Lv_LoginEmailMutation = gql`
  mutation Lv_LoginEmail($email: String!, $password: String!) {
    lvloginEmail(email: $email, password: $password) {
      token
      userId
      userEmail
      userMobile
      userLevel
    }
  }
`;

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// 관리자 로그인 컴포넌트
const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const { addToast } = useToasts();
  const { login, loading, error } = useLogin();
  // console.log(lof)

  const dispatch = useAppDispatch();
  const router = useNavigate();

  const [lvloginEmail, { loading: loadingEmail, error: errorEmail, data: dataEmail }] =
    useMutation(Lv_LoginEmailMutation);

  //스낵바 닫기
  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // const handleLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!validateEmail(formData.email)) {
  //     setMessage('Email is invalid!');
  //     setOpen(true);
  //     return;
  //   }

  //   localStorage.setItem('peta_login_tab', '1');

  //   try {
  //     // const response = await provider.post('/api/admin/login', formData);
  //     const { data } = await login(formData.email, formData.password);
  //     console.log(data);
  //     if (data.login.token) {
  //       localStorage.setItem('token', data.login.token);
  //       // causing react re-render here
  //       // setToken(data.login.token);
  //       addToast(MESSAGES.LOGIN_SUCCESS(formData?.email), {
  //         appearance: 'success',
  //         autoDismiss: true,
  //       });
  //     }
  //   } catch (e) {
  //     console.log(e);
  //     alert('로그일 실패 : 아이디와 패스워드를 다시 입력해주세요');
  //   }
  // };

  //로그인 폼 제출
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateEmail(formData.email)) {
      setMessage('Email is invalid!');
      setOpen(true);
      return;
    }
    console.log('여기?');
    localStorage.setItem('worldland_login_tab', '1');
    console.log('됨?');
    //정보 초기화
    TokenService.remove();
    dispatch(userId(undefined));
    dispatch(userEmail(undefined));
    dispatch(userMobile(undefined));
    dispatch(userLevel(undefined));

    lvloginEmail({
      variables: {
        email: formData.email,
        password: formData.password,
      },
    })
      .then((res) => {
        const authPayload: AuthPayLoad = res.data.lvloginEmail;
        console.log('로그인: ', authPayload);
        TokenService.set(authPayload.token);
        dispatch(userId(authPayload.userId));
        dispatch(userEmail(authPayload.userEmail));
        dispatch(userMobile(authPayload.userMobile));
        dispatch(userLevel(authPayload.userLevel));

        localStorage.setItem('worldland_ref_id', 'true'); //refresh token 존재 여부
        if (authPayload.userLevel === '99999' || 'VIP' || 'USER') {
          router('/');
        } else {
          router('/api/auth/register');
        }
      })
      .catch((res) => {
        setMessage('Connention Error! Please try to login few minutes later...');
        setOpen(true);
        return;
      });
  };

  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h3" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}

      {/* <AuthSocialButtons title="Sign in with" /> */}
      {/* <Box mt={3}>
        <Divider>
          <Typography component="span" color="textSecondary" variant="h6" fontWeight="400" position="relative" px={2}>
            sign in with
          </Typography>
        </Divider>
      </Box> */}

      <form onSubmit={handleSubmit}>
        {/* <Logo>
          <WorldLandLogo />
        </Logo> */}
        <Stack>
          <Box mt={7}>
            <Title>Email</Title>
            <Input type="text" name="email" value={formData.email} onChange={handleChange} />
          </Box>
          <Box mt={3}>
            <Title>Password</Title>
            <Input type="password" name="password" value={formData.password} onChange={handleChange} />
          </Box>
          <Stack justifyContent="space-between" direction="row" alignItems="center" my="2">
            <Typography
              component="a"
              href="/api/auth/forgot-email"
              fontWeight="500"
              sx={{ color: '#abb0f2' }}
              fontSize={14}
            >
              Forgot Email ?
            </Typography>
            <Typography
              component="a"
              href="/api/auth/forgot-password"
              fontWeight="500"
              sx={{ color: '#abb0f2' }}
              fontSize={14}
            >
              Forgot Password ?
            </Typography>
          </Stack>
        </Stack>
        {/* <InputGroup></InputGroup> */}
        <Box mt={2}>
          <Button
            variant="contained"
            size="large"
            fullWidth
            type="submit"
            sx={{ backgroundColor: '#abb0f2', color: 'black', fontWeight: 'bold' }}
          >
            Sign In
          </Button>
        </Box>
        {/* <Button2 type="submit">Sign In</Button2> */}
        <Stack direction="row" spacing={1} justifyContent="center" mt={5}>
          <Typography color="#d3d3d3" fontWeight="500">
            New to WorldLand?
          </Typography>
          <Typography
            component="a"
            href="/api/auth/register"
            fontWeight="500"
            sx={{
              color: '#abb0f2',
            }}
          >
            Create an account
          </Typography>
        </Stack>
      </form>
      {subtitle}
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="warning">
          {message}
        </Alert>
      </Snackbar>
    </>
    //   <Container>
    //     <LoginForm onSubmit={handleLogin}>
    //       <Logo>
    //         <WorldLandLogo />
    //       </Logo>
    //       <Stack>
    //         <Box mt={7}>
    //           <Title>Email</Title>
    //           <Input type="text" name="email" value={formData.email} onChange={handleChange} />
    //         </Box>
    //         <Box mt={3}>
    //           <Title>Password</Title>
    //           <Input type="password" name="password" value={formData.password} onChange={handleChange} />
    //         </Box>
    //         <Stack justifyContent="space-between" direction="row" alignItems="center" my="2">
    //           <Typography
    //             component="a"
    //             href="/auth/forgot-email"
    //             fontWeight="500"
    //             sx={{ color: '#abb0f2' }}
    //             fontSize={14}
    //           >
    //             Forgot Email ?
    //           </Typography>
    //           <Typography
    //             component="a"
    //             href="/auth/forgot-password"
    //             fontWeight="500"
    //             sx={{ color: '#abb0f2' }}
    //             fontSize={14}
    //           >
    //             Forgot Password ?
    //           </Typography>
    //         </Stack>
    //       </Stack>
    //       {/* <InputGroup></InputGroup> */}
    //       <Box mt={2}>
    //         <Button
    //           variant="contained"
    //           size="large"
    //           fullWidth
    //           type="submit"
    //           sx={{ backgroundColor: '#abb0f2', color: 'black', fontWeight: 'bold' }}
    //         >
    //           Sign In
    //         </Button>
    //       </Box>
    //       {/* <Button2 type="submit">Sign In</Button2> */}
    //       <Stack direction="row" spacing={1} justifyContent="center" mt={5}>
    //         <Typography color="#d3d3d3" fontWeight="500">
    //           New to WorldLand?
    //         </Typography>
    //         <Typography
    //           component="a"
    //           href="/auth/register"
    //           fontWeight="500"
    //           sx={{
    //             color: '#abb0f2',
    //           }}
    //         >
    //           Create an account
    //         </Typography>
    //       </Stack>
    //     </LoginForm>
    //     {subtitle}
    //   <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
    //     <Alert onClose={handleClose} severity="warning">
    //       {message}
    //     </Alert>
    //   </Snackbar>
    //   </Container>
  );
};

export default AuthLogin;
