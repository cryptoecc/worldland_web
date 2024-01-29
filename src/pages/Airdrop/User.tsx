import styled from 'styled-components'
import {
    useAccount,
    useNetwork,
    useSwitchNetwork,
    useBalance,
    useContractWrite,
    useWaitForTransaction,
    useContractRead,
} from 'wagmi';
import { ABI, CONTRACT_ADDRESSES, FUNCTION, QUERY } from 'utils/enum';
import { MAP_STR_ABI } from 'configs/abis';
import { from_wei } from 'utils/util';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Contract, initialContractObj } from 'pages/Admin/AdminBoard';
import { useEffect, useState } from 'react';
import CustomTable from 'components/CustomTable';
import { useParams } from "react-router-dom";
import { Button } from '@mui/material';
import { MESSAGES } from 'utils/messages';
import { useToasts } from 'react-toast-notifications';

interface UserInfo extends Contract {
    availAmount?: string;
    userBalance?: string;
}


function createData(
    name: string,
    value: string | number,
) {
    return { name, value };
}

const timeFormat = 'YYYY / MM / DD hh:mm:ss a'
const User = () => {
    dayjs.extend(relativeTime);
    const { address } = useAccount();
    const { addToast } = useToasts();
    const { contract_address } = useParams();
    const [contract, setContract] = useState<UserInfo>(initialContractObj)
    const [disabled, setDisabled] = useState<boolean>(true);
    let _timestampSet = contract.timestampSet ? 'Has been set up!' : "Is not set!"
    const rows = [
        createData('Contract Owner', contract?.owner),
        createData('Timelock Contract Address', contract_address as string),
        createData('Contract Balance', contract?.balance + ' WL'),
        createData('My assigned balance in the contract', contract?.userBalance + ' WL'),
        createData('Available amount to withdraw', contract?.availAmount + ' WL'),
        createData('Initial Timestamp', `${contract?.initialTimestamp} ${contract.initialTimestamp ? contract?.initialTimestamp === '-' ? "" : "(" + dayjs(contract.initialTimestamp).fromNow() + ")" : ""}`),
        createData('Lock Time Ending', `${contract?.cliffEdge} ${contract.cliffEdge ? contract?.cliffEdge === '-' ? "" : "(" + dayjs(contract.cliffEdge).fromNow() + ")" : ""}`),
        createData('Final Release Time Ending', `${contract?.releaseEdge} ${contract.releaseEdge ? contract?.releaseEdge === '-' ? "" : "(" + dayjs(contract.releaseEdge).fromNow() + ")" : ""}`),
        createData('Timestamp Status', _timestampSet)
    ]
    useContractRead({
        address: contract_address as `0x${string}`,
        abi: MAP_STR_ABI[ABI.LINEAR_TIMELOCK],
        functionName: QUERY.OWNER,
        onSuccess(data: string) {
            setContract((prev) => ({ ...prev, owner: data }));
        },
    });
    useContractRead({
        address: contract_address as `0x${string}`,
        abi: MAP_STR_ABI[ABI.LINEAR_TIMELOCK],
        functionName: QUERY.TIMESTAMPISSET,
        watch: true,
        onSuccess(data: boolean) {
            setContract((prev) => ({ ...prev, timestampSet: data }));
        },
    });
    useContractRead({
        address: contract_address as `0x${string}`,
        abi: MAP_STR_ABI[ABI.LINEAR_TIMELOCK],
        functionName: QUERY.INITIALTIMESTAMP,
        watch: true,
        onSuccess(data) {
            setContract((prev) => ({ ...prev, initialTimestamp: data ? dayjs.unix(Number(data)).format(timeFormat) : '-' }))
        }
    })

    useContractRead({
        address: contract_address as `0x${string}`,
        abi: MAP_STR_ABI[ABI.LINEAR_TIMELOCK],
        functionName: QUERY.CLIFFEDGE,
        watch: true,
        onSuccess(data) {
            setContract((prev) => ({ ...prev, cliffEdge: data ? dayjs.unix(Number(data)).format(timeFormat) : '-' }))
        }
    })

    useContractRead({
        address: contract_address as `0x${string}`,
        abi: MAP_STR_ABI[ABI.LINEAR_TIMELOCK],
        functionName: QUERY.RELEASEEDGE,
        watch: true,
        onSuccess(data) {
            setContract((prev) => ({ ...prev, releaseEdge: data ? dayjs.unix(Number(data)).format(timeFormat) : '-' }))
        }
    })

    useContractRead({
        address: contract_address as `0x${string}`,
        abi: MAP_STR_ABI[ABI.LINEAR_TIMELOCK],
        functionName: QUERY.CONTRACTBALANCE,
        watch: true,
        onSuccess(data) {
            setContract((prev) => ({ ...prev, balance: from_wei(data as string) ? from_wei(data as string) : '0' }))
        }
    })
    useContractRead({
        address: contract_address as `0x${string}`,
        abi: MAP_STR_ABI[ABI.LINEAR_TIMELOCK],
        functionName: QUERY.BALANCES,
        args: [address],
        watch: true,
        onSuccess(data) {
            setContract((prev) => ({ ...prev, userBalance: from_wei(data as string) ? from_wei(data as string) : '0' }))
        }
    })
    useContractRead({
        address: contract_address as `0x${string}`,
        abi: MAP_STR_ABI[ABI.LINEAR_TIMELOCK],
        functionName: QUERY.GETAVAILAMOUNT,
        args: [address],
        watch: true,
        onSuccess(data) {
            setContract((prev) => ({ ...prev, availAmount: from_wei(data as string) ? from_wei(data as string) : '0' }))
            if (Number(from_wei(data as string)) > 0) {
                setDisabled(false);
            } else {
                setDisabled(true);
            }
        }
    })
    const { data: txWithdrawn, write: withdraw } = useContractWrite({
        address: contract_address as `0x${string}`,
        abi: MAP_STR_ABI[ABI.LINEAR_TIMELOCK],
        functionName: FUNCTION.WITHDRAW,
        args: [address],
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
    });

    useWaitForTransaction({
        hash: txWithdrawn?.hash,
        async onSuccess() {
            addToast(MESSAGES.TX_SUCCESS, {
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
        }
    })

    async function handleWithdraw() {
        try {
            if (Number(contract.availAmount) > 0) {
                withdraw();
            } else {
                addToast(MESSAGES.NO_AVAIL_AMOUNT, {
                    appearance: 'error',
                    autoDismiss: true,
                });
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <Container>
            <Content>
                <Description>
                    <h1>Airdrop page | Linear Timelock Smart Contract</h1>
                    <p>Coin distribution is executed linearly and depends on user calling withdraw function. <br /> The total amount is automatically calculated based on the time remaining and your <br /> balance in the contract!</p>
                </Description>
                <CustomTable rows={rows} />
                <BtnWrap>
                    <Button onClick={handleWithdraw} disabled={disabled} sx={{ width: '100%' }} variant="contained">Withdraw available amount</Button>
                </BtnWrap>
            </Content>
        </Container>
    )
}

export default User

const Container = styled.section`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    font-family: 'Nunito Sans', sans-serif;
`

const Content = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 10px;
    max-width: 800px;
    width: 100%;
    padding: 10px;
`
const Description = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: column;
    max-width: inherit;
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

const BtnWrap = styled.div`
    width: 100%;
    background-color: #ffffff;
    border-radius: 5px;
`