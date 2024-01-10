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

type User = {
    address: string;
    total_amount: string | number;
}

interface TableProps {
    users: User[];
}

export default function UsersTable({ users }: TableProps) {
    dayjs.extend(relativeTime);

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Receiver Address</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} align="right">Receiver Total Amount</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((row) => (
                        <TableRow
                            key={row.address}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.address}
                            </TableCell>
                            <TableCell align="right">{row.total_amount}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}