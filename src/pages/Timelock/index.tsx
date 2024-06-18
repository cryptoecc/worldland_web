import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { WLD_ADDRESSES } from 'configs/contract_addresses';


function createData(
    name: string,
    address: string
) {
    return { name, address };
}

const rows = [
    createData('Merit Awardees', WLD_ADDRESSES.AWARD_LINEAR_TIMELOCK),
];

export default function Timelock() {
    const navigate = useNavigate();
    const { type } = useParams<{ type: string }>();


    return (
        <Container>
            <Description>
                <h1>Linear Timelock Contract List ({type === 'award' ? 'Award Distributer' : 'Token Sale'})</h1>
                <p>Click on a specific contract to see if you hold a position</p>
            </Description>
            <TableContainer sx={{ maxWidth: '1200px' }} component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow sx={{ 'td, th': { fontWeight: 'bold' } }}>
                            <TableCell>Contract name</TableCell>
                            <TableCell>Address</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, i) => (
                            <TableRow
                                key={i}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 }, 'td, th': { cursor: 'pointer' }, ':hover': { backgroundColor: '#f4f4f4' } }}
                                onClick={() => navigate(`/timelock-contracts/${type}/${row.address}`)}
                            >
                                <TableCell>{row.name}</TableCell>
                                <TableCell component="th" scope="row">
                                    {row.address}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}

const Container = styled.section`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 100vh;
    background-color: #000000;
    font-family: 'Nunito Sans', sans-serif;
`
const Description = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: column;
    max-width: 1200px;
    width: 100%;
    padding: 15px 0;
    gap: 5px;

    h1 {
        color: #ffffff;
        font-size: 24px;
    }
    p {
        color: #ffffff6e;
        font-size: 18px;
    }
`