import { useState, useEffect, SetStateAction, Dispatch } from 'react';
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
import { useToasts } from 'react-toast-notifications';
import { MESSAGES } from 'utils/messages';


type Receiver = {
    receiveAddress: string;
    totalAmount: string;
    lockTime: string;
    vestTime: string;
};
interface IProps {
    index: number;
    time: Receiver;
    setTime: (index: number, field: keyof Receiver, value: string | null) => void;
}
const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  gap: 30px;
  width: 100%;
  padding-top: 10px;
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
  font-weight: bold;
`;


const SetTimestamp = ({ index, time, setTime }: IProps) => {
    const { addToast } = useToasts();

    const { data: tx, write } = useContractWrite({
        address: WLD_ADDRESSES[CONTRACT_ADDRESSES.LINEAR_TIMELOCK],
        abi: MAP_STR_ABI[ABI.LINEAR_TIMELOCK],
        functionName: FUNCTION.SETTIMESTAMP,
        onSuccess() {
            addToast(MESSAGES.TX_SENT, {
                appearance: 'success',
                autoDismiss: true,
            });
        },
        onError(err: any) {
            addToast(MESSAGES.TX_FAIL, {
                appearance: 'error',
                content: err?.shortMessage,
                autoDismiss: true,
            });
        },
    })

    useWaitForTransaction({
        hash: tx?.hash,
        async onSuccess() {
            addToast(MESSAGES.TX_SUCCESS, {
                appearance: 'success',
                content: MESSAGES.TIMESTAMP_SET,
                autoDismiss: true,
            });
        },
        onError(err: any) {
            addToast(MESSAGES.TX_FAIL, {
                appearance: 'error',
                content: err?.shortMessage,
                autoDismiss: true,
            });
        }
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (time.lockTime === '' || time.vestTime === '') {
            return;
        } else {
            const now = dayjs().unix();
            let calcLockPeriod = dayjs(time.lockTime).unix() - now;
            let calcReleasePeriod = dayjs(time.vestTime).unix() - now;
            console.log({ calcLockPeriod, calcReleasePeriod })
            write?.({ args: [calcLockPeriod, calcReleasePeriod] })
        }
    };

    return (
        <Container>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <InputWrap>
                    <H1>Timestamp</H1>
                    <DateTimePicker
                        label="Lock Period"
                        value={time.lockTime}
                        onChange={(newValue) => setTime(index, 'lockTime', newValue)}
                    />
                    <DateTimePicker
                        label="Vesting Period"
                        value={time.vestTime}
                        onChange={(newValue) => setTime(index, 'vestTime', newValue)}
                    />
                </InputWrap>
            </LocalizationProvider>
        </Container>
    );
};

export default SetTimestamp