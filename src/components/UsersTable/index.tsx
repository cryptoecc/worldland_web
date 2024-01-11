import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Contract } from 'pages/Admin/AdminBoard';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { UserData } from 'pages/Admin/AdminBoard';
import { putCommaAtPrice } from 'utils/util';

type User = {
  id: number;
  created_at: string;
  address: string;
  total_amount: string | number;
};

interface TableProps {
  users: UserData[];
}

const timeFormat = 'YYYY / MM / DD'

export default function UsersTable({ users }: TableProps) {
  dayjs.extend(relativeTime);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Id</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Receiver Address</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }} align="right">
              Receiver Total Amount
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold' }} align="right">
              Date
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((row, i) => (
            <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell component="th" scope="row">
                {row.wallet_address}
              </TableCell>
              <TableCell align="right">{putCommaAtPrice(row.total_amount, 2)}</TableCell>
              <TableCell align="right">{dayjs(row.created_at).format(timeFormat)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
