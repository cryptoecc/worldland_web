import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TX } from '../index';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

interface IProps {
    name: string;
    transactions: TX[];
    url: string;
}

export default function Transactions({ name, transactions, url }: IProps) {

    return (
        <TableContainer component={Paper} sx={{ height: '350px' }}>
            <Table sx={{ minWidth: 650, backgroundColor: "#D0D0D0" }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>{name}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Transaction hash</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {transactions.length > 0 && transactions.map((row, i) => (
                        <TableRow
                            key={i}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {dayjs(row?.date).format('YYYY-MM-DD hh:mm:ss a')}
                            </TableCell>
                            <Link target="_blank" to={url + `/${row?.txHash}`}><TableCell sx={{ color: '#000000', textDecoration: 'underline', '&:hover': { color: '#ff0707' } }} align="right">{row?.txHash}</TableCell></Link>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}