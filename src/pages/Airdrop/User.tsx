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
import { WLD_ADDRESSES } from 'configs/contract_addresses';
import dayjs from 'dayjs';
import { Contract, initialContractObj } from 'pages/Admin/AdminBoard';
import { useState } from 'react';
import CustomTable from 'components/CustomTable';

interface UserInfo extends Contract {
    availAmount?: string;
}


function createData(
    name: string,
    value: string | number,
) {
    return { name, value };
}

const timeFormat = 'YYYY / MM / DD hh:mm:ss a'
const User = () => {
    const [contract, setContract] = useState<UserInfo>(initialContractObj)
    let _timestampSet = contract.timestampSet ? 'Has been set up!' : "Is not set!"
    const rows = [
        createData('Contract Owner', contract?.owner),
        createData('Timelock Contract Address', WLD_ADDRESSES[CONTRACT_ADDRESSES.LINEAR_TIMELOCK]),
        createData('Contract Balance', contract?.balance + ' WL'),
        createData('Available amount to withdraw', contract?.availAmount + ' WL'),
        createData('Initial Timestamp', `${contract?.initialTimestamp} ${contract.initialTimestamp ? contract?.initialTimestamp === '-' ? "" : "(" + dayjs(contract.initialTimestamp).fromNow() + ")" : ""}`),
        createData('Lock Time Ending', `${contract?.cliffEdge} ${contract.cliffEdge ? contract?.cliffEdge === '-' ? "" : "(" + dayjs(contract.cliffEdge).fromNow() + ")" : ""}`),
        createData('Final Release Time Ending', `${contract?.releaseEdge} ${contract.releaseEdge ? contract?.releaseEdge === '-' ? "" : "(" + dayjs(contract.releaseEdge).fromNow() + ")" : ""}`),
        createData('Timestamp Status', _timestampSet)
    ]
    useContractRead({
        address: WLD_ADDRESSES[CONTRACT_ADDRESSES.LINEAR_TIMELOCK],
        abi: MAP_STR_ABI[ABI.LINEAR_TIMELOCK],
        functionName: QUERY.OWNER,
        onSuccess(data: string) {
            setContract((prev) => ({ ...prev, owner: data }));
        },
    });
    useContractRead({
        address: WLD_ADDRESSES[CONTRACT_ADDRESSES.LINEAR_TIMELOCK],
        abi: MAP_STR_ABI[ABI.LINEAR_TIMELOCK],
        functionName: QUERY.TIMESTAMPISSET,
        watch: true,
        onSuccess(data: boolean) {
            setContract((prev) => ({ ...prev, timestampSet: data }));
        },
    });
    useContractRead({
        address: WLD_ADDRESSES[CONTRACT_ADDRESSES.LINEAR_TIMELOCK],
        abi: MAP_STR_ABI[ABI.LINEAR_TIMELOCK],
        functionName: QUERY.INITIALTIMESTAMP,
        watch: true,
        onSuccess(data) {
            setContract((prev) => ({ ...prev, initialTimestamp: data ? dayjs.unix(Number(data)).format(timeFormat) : '-' }))
        }
    })

    useContractRead({
        address: WLD_ADDRESSES[CONTRACT_ADDRESSES.LINEAR_TIMELOCK],
        abi: MAP_STR_ABI[ABI.LINEAR_TIMELOCK],
        functionName: QUERY.CLIFFEDGE,
        watch: true,
        onSuccess(data) {
            setContract((prev) => ({ ...prev, cliffEdge: data ? dayjs.unix(Number(data)).format(timeFormat) : '-' }))
        }
    })

    useContractRead({
        address: WLD_ADDRESSES[CONTRACT_ADDRESSES.LINEAR_TIMELOCK],
        abi: MAP_STR_ABI[ABI.LINEAR_TIMELOCK],
        functionName: QUERY.RELEASEEDGE,
        watch: true,
        onSuccess(data) {
            setContract((prev) => ({ ...prev, releaseEdge: data ? dayjs.unix(Number(data)).format(timeFormat) : '-' }))
        }
    })

    useContractRead({
        address: WLD_ADDRESSES[CONTRACT_ADDRESSES.LINEAR_TIMELOCK],
        abi: MAP_STR_ABI[ABI.LINEAR_TIMELOCK],
        functionName: QUERY.CONTRACTBALANCE,
        watch: true,
        onSuccess(data) {
            setContract((prev) => ({ ...prev, balance: from_wei(data as string) ? from_wei(data as string) : '0' }))
        }
    })
    useContractRead({
        address: WLD_ADDRESSES[CONTRACT_ADDRESSES.LINEAR_TIMELOCK],
        abi: MAP_STR_ABI[ABI.LINEAR_TIMELOCK],
        functionName: QUERY.GETAVAILAMOUNT,
        watch: true,
        onSuccess(data) {
            setContract((prev) => ({ ...prev, availAmount: from_wei(data as string) ? from_wei(data as string) : '0' }))
        }
    })
    return (
        <Container>
            <Content>
                <CustomTable rows={rows} />
            </Content>
        </Container>
    )
}

export default User

const Container = styled.section`
    display: flex;
    align-items: center;
    justify-content: center;
`

const Content = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`