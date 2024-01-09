import { AxiosError } from 'axios';
import { provider } from 'configs/axios';

export const CheckJwt = async (navigate: any) => {
  const token = localStorage.getItem('token');

  try {
    const response = await provider.get('/api/admin/admin-info', {
      headers: {
        Authorization: `Bearer ${token}`, // Authorization 헤더에 JWT 포함
      },
    });

    console.log(response);
  } catch (error) {
    console.error('Error fetching', error);
    const err = error as AxiosError;

    if (err.response && err.response.status === 403) {
      alert('Session expired. Please login again');
      navigate('/wl-admin');
    } else {
      console.error('Error fetching', err);
    }
  }
};
