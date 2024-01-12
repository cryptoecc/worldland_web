import { useState, useEffect } from 'react';
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


const SetTimestamp = ({ isTimestampSet }: { isTimestampSet: boolean }) => {
    const navigate = useNavigate();
    const [time, setTime] = useState<ITimestamp>({ lockPeriod: '', releasePeriod: '' });
    const [disabled, setDisabled] = useState<boolean>(true);
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
        if (time.lockPeriod === '' || time.releasePeriod === '') {
            return;
        } else {
            const now = dayjs().unix();
            let calcLockPeriod = dayjs(time.lockPeriod).unix() - now;
            let calcReleasePeriod = dayjs(time.releasePeriod).unix() - now;
            console.log({ calcLockPeriod, calcReleasePeriod })
            write?.({ args: [calcLockPeriod, calcReleasePeriod] })
        }
    };

    useEffect(() => {
        if (!time.lockPeriod || !time.releasePeriod || isTimestampSet) {
            setDisabled(true)
        } else {
            setDisabled(false);
        }
    }, [time.lockPeriod, time.releasePeriod, isTimestampSet])

    return (
        <Container>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <InputWrap>
                    <H1>Timestamp</H1>
                    <DateTimePicker
                        disabled={isTimestampSet}
                        label="Lock Period"
                        value={time.lockPeriod}
                        onChange={(newValue) => setTime((prev) => ({ ...prev, lockPeriod: newValue }))}
                    />
                    <DateTimePicker
                        disabled={isTimestampSet}
                        label="Release Period"
                        value={time.releasePeriod}
                        onChange={(newValue) => setTime((prev) => ({ ...prev, releasePeriod: newValue }))}
                    />
                </InputWrap>
            </LocalizationProvider>
            <BtnWrap>
                <Button sx={{ width: '100%' }} disabled={disabled} onClick={handleSubmit} variant="contained">Submit</Button>
            </BtnWrap>
        </Container>
    );
};

export default SetTimestamp