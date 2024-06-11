// import React, { useState } from 'react';
// import {
//   Box,
//   Typography,
//   FormGroup,
//   FormControlLabel,
//   Button,
//   Stack,
//   Divider,
//   Snackbar,
// } from "@mui/material";
// import MuiAlert, { AlertProps } from '@mui/material/Alert';
// import Link from "next/link";
// import { useRouter } from 'next/navigation';
// import { loginType } from "@/app/(DashboardLayout)/types/auth/auth";
// import CustomCheckbox from "@/app/components/forms/theme-elements/CustomCheckbox";
// import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
// import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
// import AuthSocialButtons from "./AuthSocialButtons";

// //graphql
// import gql from "graphql-tag";
// import { useMutation } from "@apollo/client";
// import TokenService from '@/utils/login/TokenService';
// import { AuthPayLoad } from '@/app/(DashboardLayout)/types/auth/auth';

// //redux
// import { useAppDispatch } from '@/store/store';
// import { userId, userEmail, userMobile, userLevel } from '@/store/user/UserSlice';

// //utils
// import { validateEmail } from '@/utils/login/Util';

// const Lv_LoginEmailMutation = gql`
//   mutation Lv_LoginEmail($email: String!, $password: String!) {
//     lvloginEmail(email: $email, password: $password) {
//       token
//       userId
//       userEmail
//       userMobile
//       userLevel
//     }
//   }
// `;

// //스낵바 얼럿 컴포넌트
// const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
//   props,
//   ref,
// ) {
//   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });

// const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
//   const [email, setEmail] = useState<string>('');
//   const [password, setPassword] = useState<string>('');
//   const [open, setOpen] = useState<boolean>(false);
//   const [message, setMessage] = useState<string>('');

//   const dispatch = useAppDispatch();
//   const router = useRouter();
//   const [
//     lvloginEmail,
//     { loading: loadingEmail, error: errorEmail, data: dataEmail },
//   ] = useMutation(Lv_LoginEmailMutation);

//   //스낵바 닫기
//   const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
//     if (reason === 'clickaway') {
//       return;
//     }
//     setOpen(false);
//   };

//   //로그인 폼 제출
//   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     if (!validateEmail(email)) {
//       setMessage('Email is invalid!');
//       setOpen(true);
//       return;
//     }

//     localStorage.setItem("peta_login_tab", "1");

//     정보 초기화
//     TokenService.remove();
//     dispatch(userId(undefined));
//     dispatch(userEmail(undefined));
//     dispatch(userMobile(undefined))
//     dispatch(userLevel(undefined));

//     lvloginEmail({
//       variables: {
//         email: email,
//         password: password,
//       }
//     }).then((res)=>{
//       const authPayload: AuthPayLoad = res.data.lvloginEmail;
//       TokenService.set(authPayload.token);
//       dispatch(userId(authPayload.userId));
//       dispatch(userEmail(authPayload.userEmail));
//       dispatch(userMobile(authPayload.userMobile));
//       dispatch(userLevel(authPayload.userLevel));

//       localStorage.setItem("peta_ref_id", "true"); //refresh token 존재 여부
//       if (authPayload.userLevel === "99999"|| "VIP" || "USER") {
//         router.push("/apps/chats");
//       } else {
//         router.push("/auth/auth2/register");
//       }
//     }).catch((res)=>{
//       setMessage('Connention Error! Please try to login few minutes later...');
//       setOpen(true);
//       return;
//     });
//   }

//   return(
//     <>
//     {title ? (
//       <Typography fontWeight="700" variant="h3" mb={1}>
//         {title}
//       </Typography>
//     ) : null}

//     {subtext}

//     {/* <AuthSocialButtons title="Sign in with" /> */}
//     <Box mt={3}>
//       <Divider>
//         <Typography
//           component="span"
//           color="textSecondary"
//           variant="h6"
//           fontWeight="400"
//           position="relative"
//           px={2}
//         >
//           sign in with
//         </Typography>
//       </Divider>
//     </Box>

//     <form onSubmit={handleSubmit}>
//       <Stack>
//         <Box>
//           <CustomFormLabel htmlFor="email">Email</CustomFormLabel>
//           <CustomTextField
//             id="email"
//             variant="outlined"
//             fullWidth
//             value={email}
//             onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
//           />
//         </Box>
//         <Box>
//           <CustomFormLabel htmlFor="password">Password</CustomFormLabel>
//           <CustomTextField
//             id="password"
//             type="password"
//             variant="outlined"
//             fullWidth
//             value={password}
//             onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
//           />
//         </Box>
//         <Stack
//           justifyContent="space-between"
//           direction="row"
//           alignItems="center"
//           my={2}
//         >
//           {/* <FormGroup>
//             <FormControlLabel
//               control={<CustomCheckbox defaultChecked />}
//               label="Remeber this Device"
//             />
//           </FormGroup> */}
//           <Typography
//             component={Link}
//             href="/auth/auth2/forgot-email"
//             fontWeight="500"
//             sx={{
//               textDecoration: "none",
//               color: "primary.main",
//             }}
//           >
//             Forgot Email ?
//           </Typography>
//           <Typography
//             component={Link}
//             href="/auth/auth2/forgot-password"
//             fontWeight="500"
//             sx={{
//               textDecoration: "none",
//               color: "primary.main",
//             }}
//           >
//             Forgot Password ?
//           </Typography>
//         </Stack>
//       </Stack>
//       <Box>
//         <Button
//           color="primary"
//           variant="contained"
//           size="large"
//           fullWidth
//           type="submit"
//         >
//           Sign In
//         </Button>
//       </Box>
//     </form>
//     {subtitle}
//     <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
//       <Alert onClose={handleClose} severity="warning">
//         {message}
//       </Alert>
//     </Snackbar>
//   </>
//   )
// };

// export default AuthLogin;
