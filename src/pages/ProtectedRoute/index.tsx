import Admin from 'pages/Admin';
import AdminBoard from 'pages/Admin/AdminBoard';
import { useEffect, useState } from 'react';
// import { CheckJwt } from "utils/jwt";

const ProtectedRoute = () => {
  const [_authToken, setAuthToken] = useState<string | null>('');
  const authToken = localStorage.getItem('token');

  const isTokenExpired = (token: any) => {
    if (!token) return true;
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Date.now() / 1000; // 현재 시간
    return payload.exp < now;
  };

  const CheckJwt = async () => {
    const token = localStorage.getItem('token');

    if (!token || isTokenExpired(token)) {
      alert('Session expired. Please login again');
      localStorage.removeItem('token');
      return setAuthToken(null);
    }

    return setAuthToken(token);
    // try {
    //   const response = await provider.get('/api/admin/admin-info', {
    //     headers: {
    //       Authorization: `Bearer ${token}`, // Authorization 헤더에 JWT 포함
    //     },
    //   });

    //   console.log(response);
    // } catch (error) {
    //   console.error('Error fetching', error);
    //   const err = error as AxiosError;

    //   if (err.response && err.response.status === 403) {
    //     alert('Session expired. Please login again');
    //     navigate('/wl-admin');
    //   } else {
    //     console.error('Error fetching', err);
    //   }
    // }
  };

  useEffect(() => {
    CheckJwt();
  }, []);
  return authToken || _authToken ? (
    <AdminBoard token={_authToken ?? authToken} setToken={setAuthToken} />
  ) : (
    <Admin setToken={setAuthToken} />
  );
};

export default ProtectedRoute;
