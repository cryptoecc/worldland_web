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

    return transactions.length > 0 && (
        <TableContainer component={Paper} sx={{ maxHeight: '350px', height: '100%' }}>
            <h1 style={{ padding: '10px', fontFamily: "Nunito Sans, sans-serif", fontWeight: '600', backgroundColor: "#bdbdbd" }}>{name}</h1>
            <Table sx={{ minWidth: 650, backgroundColor: "#D0D0D0" }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: '600', }}>Id</TableCell>
                        <TableCell sx={{ fontWeight: '600', }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: '600', }}>Transaction hash</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {transactions.map((row, i) => (
                        <TableRow
                            key={i}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell sx={{ width: '20px' }} component="th" scope="row">
                                {row?.id}
                            </TableCell>
                            <TableCell component="th" scope="row">
                                {dayjs(row?.date).format('YYYY-MM-DD hh:mm:ss a')}
                            </TableCell>
                            <Link target="_blank" to={url + `/${row?.txHash}`}>
                                <TableCell sx={{ width: '100%', color: '#000000', textDecoration: 'underline', '&:hover': { color: '#ff0707' } }} align="right">
                                    {row?.txHash ? row?.txHash : 'Tx hash is not available!'}
                                </TableCell>
                            </Link>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}