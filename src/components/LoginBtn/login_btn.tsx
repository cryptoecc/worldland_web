import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from 'style/theme';
import { maxQuery } from 'utils/breakpoints';
import LogoutBtn from 'pages/authentication/logout';
import { AppState } from '../../store/store';
import { useDispatch, useSelector } from 'react-redux';
// import { ManageAccountsIcon} from '@mui/icons-material';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

const StyledButton = styled.button`
  /* display: flex; */
  padding: 6px 15px;
  /* flex-direction: column; */
  margin-right: 30px;
  border-radius: 6px;
  border: 1px solid #f4f4f4;
  color: #f4f4f4;
  font-family: 'Inter';
  font-size: 14px;
  font-weight: bold;
  text-decoration: none; /* Add this to remove underline */
  cursor: pointer;

  &:hover {
    background-color: ${theme.colors.white400};
    border: 1px solid ${theme.colors.white800};
    transition:
      background 0.3s,
      border 0.3s;
  }

  ${maxQuery.tablet} {
    /* margin-left: 400px; */
  }
`;

const LoginButton = () => {
  const [showButton, setShowButton] = useState(false);
  const value = localStorage.getItem('worldland_ref_id');
  const user = useSelector((state: AppState) => state.userReducer);

  useEffect(() => {
    if (value && user.userId) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  }, [user]);

  return (
    <div>
      {showButton ? (
        <Link to="/apps/profile/personal-information" style={{ textDecoration: 'none' }}>
          <ManageAccountsIcon sx={{ color: 'white', fontSize: '30px', marginRight: '30px' }} />
        </Link>
      ) : (
        <Link to="/login">
          <StyledButton>Log In</StyledButton>
        </Link>
      )}
    </div>
  );
};

export default LoginButton;
