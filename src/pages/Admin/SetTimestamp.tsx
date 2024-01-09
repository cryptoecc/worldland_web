import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";
import {
    useAccount,
    useNetwork,
    useSwitchNetwork,
    useBalance,
    useContractWrite,
    useWaitForTransaction,
    useContractRead,
} from 'wagmi';

import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { WLD_ADDRESSES } from 'configs/contract_addresses';
import { ABI, CONTRACT_ADDRESSES, FUNCTION } from 'utils/enum';
import { MAP_STR_ABI } from 'configs/abis';
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Button } from '@mui/material';


type Receiver = {
    receiveAddress: string;
    totalAmount: string;
    totalTime: string;
};
type ITimestamp = {
    lockPeriod: string | null;
    releasePeriod: string | null;
}
const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  gap: 30px;
  width: 100%;
`;

const InputWrap = styled.section`
display: flex;
align-items: center;
justify-content: flex-start;
width: 100%;
gap: 60px;
`;

const BtnWrap = styled.div`
display: flex;
align-items: center;
justify-content: center;
width: 100%;
`;

const H1 = styled.h1`
  font-size: 20px;
`;


const SetTimestamp = () => {
    const navigate = useNavigate();
    const [time, setTime] = useState<ITimestamp>({ lockPeriod: '', releasePeriod: '' });

    const { write } = useContractWrite({
        address: WLD_ADDRESSES[CONTRACT_ADDRESSES.LINEAR_TIMELOCK],
        abi: MAP_STR_ABI[ABI.LINEAR_TIMELOCK],
        functionName: FUNCTION.SETTIMESTAMP
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log({ lockPeriod: dayjs(time.lockPeriod).unix(), releasePeriod: dayjs(time.releasePeriod).unix() })
        let calcLockPeriod = dayjs(time.lockPeriod).unix() - dayjs().unix();
        let calcReleasePeriod = dayjs(time.releasePeriod).unix() - dayjs().unix();
        console.log({ calcLockPeriod, calcReleasePeriod });
        write?.({ args: [calcLockPeriod, calcReleasePeriod] })
    };
    const customTheme = (theme: any) => createTheme({
        ...theme,
    })
    return (
        <Container>
            <ThemeProvider theme={customTheme}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <InputWrap>
                        <H1>Timestamp</H1>
                        <DateTimePicker
                            label="Lock Period"
                            value={time.lockPeriod}
                            onChange={(newValue) => setTime((prev) => ({ ...prev, lockPeriod: newValue }))}
                        />
                        <DateTimePicker
                            label="Release Period"
                            value={time.releasePeriod}
                            onChange={(newValue) => setTime((prev) => ({ ...prev, releasePeriod: newValue }))}
                        />
                    </InputWrap>
                </LocalizationProvider>
            </ThemeProvider>
            <BtnWrap>
                <Button onClick={handleSubmit} variant="contained">Submit</Button>
            </BtnWrap>
        </Container>
    );
};

export default SetTimestamp