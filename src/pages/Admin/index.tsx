import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorldLandLogo } from 'assets';
import styled from 'styled-components';
import { provider } from 'configs/axios';
import { useToasts } from 'react-toast-notifications';
import { MESSAGES } from 'utils/messages';
import { useLogin } from 'hooks/useLogin';

// 스타일 컴포넌트 정의
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Logo = styled.h1`
  width: 50%; /* 화면 폭에 따라 로고 크기 조정 */
  max-width: 200px; /* 최대 로고 크기 지정 */
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  margin-bottom: 1rem;
  color: white;
`;

const LoginForm = styled.form`
  position: relative; /* 부모 컨테이너에 대해 상대적 포지션 지정 */
  background-color: #242424;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 80%;
  max-width: 400px;
  height: 280px;
  margin: 0 auto; /* 중앙 정렬을 위해 추가 */

  @media (min-width: 600px) {
    width: 50%;
  }
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
`;

const Button = styled.button`
  position: absolute; /* 포지션을 절대로 지정 */
  bottom: 10px; /* 상단 여백 조정 */
  right: 10px; /* 우측 여백 조정 */
  padding: 12px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  @media (min-width: 600px) {
    width: auto;
  }
`;

// 관리자 로그인 컴포넌트
const Admin = ({ setToken }: { setToken: React.Dispatch<React.SetStateAction<string | null>> }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const { addToast } = useToasts();
  const { login, loading, error } = useLogin();
  // console.log(lof)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // const response = await provider.post('/api/admin/login', formData);
      const { data } = await login(formData.username, formData.password);
      console.log(data);
      if (data.login.token) {
        localStorage.setItem('token', data.login.token);
        // causing react re-render here
        setToken(data.login.token);
        addToast(MESSAGES.LOGIN_SUCCESS(formData?.username), {
          appearance: 'success',
          autoDismiss: true,
        });
      }
    } catch (e) {
      console.log(e);
      alert('로그일 실패 : 아이디와 패스워드를 다시 입력해주세요');
    }
  };

  return (
    <Container>
      <Logo>
        <WorldLandLogo />
      </Logo>
      <LoginForm onSubmit={handleLogin}>
        <InputGroup>
          <Title>Admin ID</Title>
          <Input type="text" name="username" value={formData.username} onChange={handleChange} />
          <Title>Password</Title>
          <Input type="password" name="password" value={formData.password} onChange={handleChange} />
        </InputGroup>
        <Button type="submit">Log In</Button>
      </LoginForm>
    </Container>
  );
};

export default Admin;
