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
import { MAPNETTOADDRESS } from 'configs/contract_address_config';

const userInitialData = {
    ...initialContractObj,
    availAmount: '0',
    userBalance: '0',
    userNftBalance: '0',
    initialTimestamp: '',
    cliffEdge: '',
    releaseEdge: ''
}

interface UserInfo extends Contract {
    availAmount?: string;
    userBalance?: string;
    userNftBalance: string;
    initialTimestamp: string;
    cliffEdge: string;
    releaseEdge: string;
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
    const { type, contract_address } = useParams();
    const [userData, setUserData] = useState<UserInfo>(userInitialData);
    const [disabled, setDisabled] = useState<boolean>(true);
    let rows = [
        createData('Contract Owner', userData?.owner),
        createData('Timelock Contract Address', contract_address as string),
        // createData('NFT Contract Address', MAPNETTOADDRESS.ERC721_WNFTMINTER as string),
        // createData('NFT Ownership', userData?.userNftBalance),
        createData('Contract Balance', userData?.balance + ' WL'),
        createData('My assigned balance in the contract', userData?.userBalance + ' WL'),
        createData('Available amount to withdraw', userData?.availAmount + ' WL'),
        createData('Initial Timestamp', `${userData?.initialTimestamp} ${userData.initialTimestamp ? userData?.initialTimestamp === '-' ? "" : "(" + dayjs(userData.initialTimestamp).fromNow() + ")" : ""}`),
        createData('My Lock Time Ending', `${userData?.cliffEdge} ${userData.cliffEdge ? userData?.cliffEdge === '-' ? "" : "(" + dayjs(userData.cliffEdge).fromNow() + ")" : ""}`),
        createData('My Vesting Time Ending', `${userData?.releaseEdge} ${userData.releaseEdge ? userData?.releaseEdge === '-' ? "" : "(" + dayjs(userData.releaseEdge).fromNow() + ")" : ""}`),
    ]
    if (userData.isAllIncomingDepositsFinalised) {
        const slice1 = rows.slice(0, 2);
        const slice2 = rows.slice(2);
        slice1.push(createData('Contract State', 'Frozen ❄️'));
        rows = slice1.concat(slice2);
    }
    // // main contract ERC20 balance check
    // useContractRead({
    //     address: MAPNETTOADDRESS.ERC20_WWLC,
    //     abi: MAP_STR_ABI[ABI.ERC20_ABI],
    //     functionName: QUERY.BALANCEOF,
    //     args: [contract_address],
    //     watch: true,
    //     onSuccess(data) {
    //         setUserData((prev) => ({ ...prev, balance: from_wei(data?.toString()) }))
    //     }
    // })
    useBalance({
        address: contract_address as `0x${string}`,
        watch: true,
        onSuccess(data) {
            setUserData((prev) => ({ ...prev, balance: data?.value ? from_wei(data?.value.toString()) : data?.value.toString() }))
        }
    })

    useContractRead({
        address: MAPNETTOADDRESS.ERC721_WNFTMINTER,
        abi: MAP_STR_ABI[ABI.ERC721_WNFTMINTER],
        functionName: QUERY.BALANCEOF,
        args: [address],
        watch: true,
        onSuccess(data: string) {
            setUserData((prev) => ({ ...prev, userNftBalance: data.toString() }));
        },
    });
    useContractRead({
        address: contract_address as `0x${string}`,
        abi: MAP_STR_ABI[ABI.AWARD_LINEAR_TIMELOCK],
        functionName: QUERY.OWNER,
        onSuccess(data: string) {
            setUserData((prev) => ({ ...prev, owner: data }));
        },
    });
    useContractRead({
        address: contract_address as `0x${string}`,
        abi: MAP_STR_ABI[ABI.AWARD_LINEAR_TIMELOCK],
        functionName: QUERY.TIMEPERIODS,
        args: [address],
        watch: true,
        onSuccess(data: any) {
            const [_cliffEdge, _releaseEdge, _initialTimestamp] = data;
            setUserData((prev) => ({ ...prev, initialTimestamp: _initialTimestamp ? dayjs.unix(Number(_initialTimestamp)).format(timeFormat) : '-', cliffEdge: _cliffEdge ? dayjs.unix(Number(_cliffEdge)).format(timeFormat) : '-', releaseEdge: _releaseEdge ? dayjs.unix(Number(_releaseEdge)).format(timeFormat) : '-', }))
        }
    })
    useContractRead({
        address: contract_address as `0x${string}`,
        abi: MAP_STR_ABI[ABI.AWARD_LINEAR_TIMELOCK],
        functionName: QUERY.BALANCES,
        args: [address],
        watch: true,
        onSuccess(data) {
            setUserData((prev) => ({ ...prev, userBalance: from_wei(data as string) ? from_wei(data as string) : '0' }))
        }
    })
    useContractRead({
        address: contract_address as `0x${string}`,
        abi: MAP_STR_ABI[ABI.AWARD_LINEAR_TIMELOCK],
        functionName: QUERY.GETAVAILAMOUNT,
        args: [address],
        watch: true,
        onSuccess(data) {
            setUserData((prev) => ({ ...prev, availAmount: from_wei(data as string) ? from_wei(data as string) : '0' }))
            if (Number(from_wei(data as string)) > 0) {
                setDisabled(false);
            } else {
                setDisabled(true);
            }
        }
    })
    const { data: txWithdrawn, write: withdraw } = useContractWrite({
        address: contract_address as `0x${string}`,
        abi: MAP_STR_ABI[ABI.AWARD_LINEAR_TIMELOCK],
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
            if (Number(userData.availAmount) > 0) {
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
                    <h1>Linear Timelock Smart Contract {type === 'award' ? '(Award Distributer)' : '(Token Sale)'}</h1>
                    <p>Coin distribution is executed linearly and depends on user calling withdraw function. <br /> The total amount is automatically calculated based on the time remaining and your <br /> balance in the contract!</p>
                </Description>
                <CustomTable rows={rows} />
                <BtnWrap>
                    <Button onClick={handleWithdraw} disabled={disabled} sx={{ width: '100%', }} variant="contained">Withdraw available amount</Button>
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
    padding-top: 50px;
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