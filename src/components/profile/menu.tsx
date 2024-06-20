import React, { FC, useState, useEffect, CSSProperties } from 'react';
import { useParams, Link } from 'react-router-dom';
// import Link from "next/link";
import { Box, MenuItem, Typography } from '@mui/material';
import { Person, Email, PhoneIphone, Badge, Password, AccountBalanceWallet, Logout } from '@mui/icons-material';
import LogoutBtn from 'pages/authentication/logout';
import { red } from '@mui/material/colors';
import useLogout from 'pages/authentication/logout/logoutfcn';

interface MenuProfileProps {
  onCloseDrawer?: () => void;
}

const MenuProfile: FC<MenuProfileProps> = ({ onCloseDrawer }) => {
  const [currentPageId, setCurrentPageId] = useState<string | null>(null);
  const params = useParams();
  const pageid = params?.pageid as string;

  const logout = useLogout(); // 훅 호출

  useEffect(() => {
    if (pageid) {
      setCurrentPageId(pageid);
    }
  }, [pageid]);

  const handleMenuClick = (pageId: string) => {
    setCurrentPageId(pageId);
    if (pageId === 'logout') {
      logout();
    } else if (onCloseDrawer) {
      onCloseDrawer();
    }
  };

  const menuItems = [
    {
      label: '개인정보 조회',
      pageId: 'personal-information',
      icon: <Person />,
    },
    {
      label: '이메일 변경',
      pageId: 'change-email',
      icon: <Email />,
    },
    {
      label: '연락처 변경',
      pageId: 'change-mobile',
      icon: <PhoneIphone />,
    },
    {
      label: '닉네임 변경',
      pageId: 'change-nickname',
      icon: <Badge />,
    },
    {
      label: '비밀번호 재설정',
      pageId: 'change-password',
      icon: <Password />,
    },
    {
      label: '지갑주소 설정',
      pageId: 'change-wallet',
      icon: <AccountBalanceWallet />,
    },
    {
      label: '로그아웃',
      pageId: 'logout',
      icon: <Logout />,
    },
  ];

  return (
    <Box sx={{ width: 250, p: 2, height: '100%', backgroundColor: '#333' }}>
      {menuItems.map((item) => (
        <Link key={item.pageId} to={item.pageId !== 'logout' ? `/api/apps/profile/${item.pageId}` : '#'} replace>
          <MenuItem
            selected={currentPageId === item.pageId}
            onClick={() => handleMenuClick(item.pageId)}
            sx={{ color: '#d3d3d3' }}
          >
            {item.icon}
            <Typography variant="body1" sx={{ ml: 2 }}>
              {item.label}
            </Typography>
          </MenuItem>
        </Link>
      ))}
    </Box>
  );
};
export default MenuProfile;
