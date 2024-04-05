import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(
    name: string,
    calories: string,
) {
    return { name, calories };
}

const rows = [
    createData('2024.04.04', '0x5ca5716f2fd11fbc4382f82ceb79d3dc2873656a8ddf7229833b44e7bdfcf58e'),
    createData('2024.04.04', '0x5ca5716f2fd11fbc4382f82ceb79d3dc2873656a8ddf7229833b44e7bdfcf58e'),
    createData('2024.04.04', '0x5ca5716f2fd11fbc4382f82ceb79d3dc2873656a8ddf7229833b44e7bdfcf58e'),
    createData('2024.04.04', '0x5ca5716f2fd11fbc4382f82ceb79d3dc2873656a8ddf7229833b44e7bdfcf58e'),

];

export default function Transactions() {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650, backgroundColor: "#D0D0D0" }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Sepolia Testnet Transactions</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Transaction hash</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="right">{row.calories}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}