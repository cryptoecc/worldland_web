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
      label: 'Personal Information',
      pageId: 'personal-information',
      icon: <Person />,
    },
    {
      label: 'Change Email',
      pageId: 'change-email',
      icon: <Email />,
    },
    {
      label: 'Change Mobile',
      pageId: 'change-mobile',
      icon: <PhoneIphone />,
    },
    {
      label: 'Change Nickname',
      pageId: 'change-nickname',
      icon: <Badge />,
    },
    {
      label: 'Reset Password',
      pageId: 'change-password',
      icon: <Password />,
    },
    {
      label: 'Set Wallet Address',
      pageId: 'change-wallet',
      icon: <AccountBalanceWallet />,
    },
    {
      label: 'Logout',
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
