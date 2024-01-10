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

function createData(
    name: string,
    value: string | number,
) {
    return { name, value };
}

interface TableProps {
    address: string;
    contract: Contract;
}

export default function CustomTable({ address, contract }: TableProps) {
    dayjs.extend(relativeTime);
    let _timestampSet = contract.timestampSet ? 'Has been set up!' : "Is not set!"
    const rows = [
        createData('Contract Owner', contract?.owner),
        createData('Timelock Contract Address', address),
        createData('Contract Balance', contract?.balance + ' WL'),
        createData('Initial Timestamp', `${contract?.initialTimestamp} (${dayjs(contract.initialTimestamp).fromNow()})`),
        createData('Lock Time Ending', `${contract?.cliffEdge} (${dayjs(contract.cliffEdge).fromNow()})`),
        createData('Final Release Time Ending', `${contract?.releaseEdge} (${dayjs(contract.releaseEdge).fromNow()})`),
        createData('Timestamp Status', _timestampSet),
    ];
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="right">{row.value}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}