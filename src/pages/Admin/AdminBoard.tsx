import { AxiosError } from 'axios';
import { provider } from 'configs/axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';
import AddReceiver from './AddReceiver';
import SetTimestamp from './SetTimestamp';
import { useAccount } from 'wagmi';

const Container = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
  height: 100vh;
  font-family: 'Nunito Sans', sans-serif;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
  max-width: 800px;
  width: 100%;
  padding: 30px;
  background-color: #ffffff;
  color: #000000;
  border: 1px;
  border-radius: 10px;
  height: 400px;
`;

const H1 = styled.h1`
  text-align: center;
  font-size: 20px;
`;

const AdminInfo = styled.div`
  text-align: start;
  width: 100%;
`;

const AdminBoard = () => {
  const [adminId, setAdminId] = useState<string | undefined>('');
  const { address } = useAccount();
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const fetchUserInfo = async () => {
    try {
      const response = await provider.get('/api/admin/admin-info', {
        headers: {
          Authorization: `Bearer ${token}`, // Authorization 헤더에 JWT 포함
        },
      });

      console.log(response.data);
      setAdminId(response.data.id);
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

  useEffect(() => {
    fetchUserInfo();
    setAdminId(address);
  }, []);

  return (
    <Container>
      <Content>
        <H1>Timelock Period Setting</H1>
        <AdminInfo>Admin : {adminId}</AdminInfo>
        <AdminInfo>Timelock Contract Address : {adminId}</AdminInfo>
        <SetTimestamp />
        {/* <AddReceiver /> */}
      </Content>
    </Container>
  );
};

export default AdminBoard;
