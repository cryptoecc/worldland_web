import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';
import AddReceiver from './AddReceiver';

const Container = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
`;

const Content = styled.div`
  display: flex;
  width: 1000px;
  padding: 40px;
  flex-direction: column;
  margin-top: 300px;
  background-color: #282828;
  color: white;
  border: 1px;
  border-radius: 10px;
`;

const H1 = styled.h1`
  text-align: center;
  font-size: 20px;
  padding: 20px;
`;

const AdminInfo = styled.div`
  text-align: end;
  padding: 10px;
`;

const AdminBoard = () => {
  const [adminId, setAdminId] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const fetchUserInfo = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/admin/admin-info', {
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
  }, []);

  return (
    <Container>
      <Content>
        <H1>This is Admin Page</H1>
        <AdminInfo>Admin : {adminId}</AdminInfo>
        <AddReceiver />
      </Content>
    </Container>
  );
};

export default AdminBoard;
