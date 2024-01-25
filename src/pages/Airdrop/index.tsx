import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(
    address: string,
    owner: string,
    balance: string,
    initial_timestamp: string | number,
    lock_ending: string | number,
    release_ending: string | number,
) {
    return { address, owner, balance, initial_timestamp, lock_ending, release_ending };
}

const rows = [
    createData('0x02173401985398458348238234786', '0x00....0000', '100 WL', '1 day ago', '1 day ago', '1 day ago'),
];

export default function Airdrop() {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Address</TableCell>
                        <TableCell align="right">Owner</TableCell>
                        <TableCell align="right">Balance</TableCell>
                        <TableCell align="right">Initial timestamp</TableCell>
                        <TableCell align="right">Lock Time Ending</TableCell>
                        <TableCell align="right">Final Release Time Ending</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, i) => (
                        <TableRow
                            key={i}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.address}
                            </TableCell>
                            <TableCell align="right">{row.owner}</TableCell>
                            <TableCell align="right">{row.balance}</TableCell>
                            <TableCell align="right">{row.initial_timestamp}</TableCell>
                            <TableCell align="right">{row.lock_ending}</TableCell>
                            <TableCell align="right">{row.release_ending}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}