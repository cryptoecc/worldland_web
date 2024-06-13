const isTokenExpired = (token: any) => {
  if (!token) return true;
  const payload = JSON.parse(atob(token.split('.')[1]));
  const now = Date.now() / 1000; // 현재 시간
  return payload.exp < now;
};

export const checkJWT = async () => {
  const token = localStorage.getItem('token');

  if (!token || isTokenExpired(token)) {
    alert('Session expired. Please login again');
    return localStorage.removeItem('token');
  }

  return token;
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
