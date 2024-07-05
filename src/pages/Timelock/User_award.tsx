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
import { from_wei, putCommaAtPrice } from 'utils/util';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Contract, initialContractObj } from 'pages/Admin/constants';
import { useEffect, useState } from 'react';
import CustomTable from 'components/CustomTable';
import { useParams, useNavigate } from "react-router-dom";
import { Button, TextField } from '@mui/material';
import { MESSAGES } from 'utils/messages';
import { useToasts } from 'react-toast-notifications';
import { MAPNETTOADDRESS } from 'configs/contract_address_config';
import TxConfirmModal from 'components/main/TxConfirmModal';
import TxProcessModal from 'components/main/TxProcessModal';

const userInitialData = {
    ...initialContractObj,
    availAmount: '0',
    userBalance: '0',
    userNftBalance: '0',
    walletBalance: '0',
    tokenId: '',
    initialTimestamp: '',
    cliffEdge: '',
    releaseEdge: ''
}

interface UserInfo extends Contract {
    availAmount?: string;
    userBalance?: string;
    walletBalance: string;
    userNftBalance: string;
    tokenId: string;
    initialTimestamp: string;
    cliffEdge: string;
    releaseEdge: string;
}


function createData(
    name: string,
    value: string | number | React.ReactNode,
) {
    return { name, value };
}

type Modals = {
    modal0: boolean;
    modal1: boolean;
};

type TxDetails = {
    header: string;
    content: string;
    subContent: string;
    function: () => void;
}

const timeFormat = 'YYYY.MM.DD hh:mm a'
const User = () => {
    dayjs.extend(relativeTime);
    const navigate = useNavigate();
    const { address } = useAccount();
    const { addToast } = useToasts();
    const { contract_address } = useParams();
    const [userData, setUserData] = useState<UserInfo>(userInitialData);
    const [disabled, setDisabled] = useState<boolean>(true);
    const [txModal, setTxModal] = useState<Modals>({ modal0: false, modal1: false });
    const [currentTxData, setCurrentTxData] = useState<TxDetails>({ header: '', content: '', subContent: '', function: () => { } })
    const [inputErrorState, setInputErrorState] = useState<boolean>(false);
    const nftInput = (<TextField
        id="outlined-number"
        label="Token Id"
        type="number"
        value={userData?.tokenId}
        error={inputErrorState}
        onChange={(e) => setUserData((prev) => ({ ...prev, tokenId: e.target.value }))}
        InputLabelProps={{
            shrink: true,
        }}
    />)
    let rows = [
        createData('Contract Owner', userData?.owner),
        createData('Timelock Contract Address', contract_address as string),
        createData('NFT Contract Address', MAPNETTOADDRESS.ERC721_WNFTMINTER as string),
        createData('NFT ownership balance (Number of NFTs owned)', userData?.userNftBalance),
        createData('Token Id input', nftInput),
        createData('Contract Balance', putCommaAtPrice(userData?.balance ?? '0', 4) + ' WL'),
        createData('My assigned balance in the contract', putCommaAtPrice(userData?.userBalance ?? '0', 4) + ' WL'),
        createData('Available amount to withdraw', putCommaAtPrice(userData?.availAmount ?? '0', 4) + ' WL'),
        createData('My wallet balance', putCommaAtPrice(userData?.walletBalance ?? '0', 4) + ' WL'),
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
    useBalance({
        address: contract_address as `0x${string}`,
        watch: true,
        onSuccess(data) {
            setUserData((prev) => ({ ...prev, balance: data?.value ? from_wei(data?.value.toString()) : data?.value.toString() }))
        }
    })
    useBalance({
        address,
        watch: true,
        onSuccess(data) {
            setUserData((prev) => ({ ...prev, walletBalance: data?.value ? from_wei(data?.value.toString()) : data?.value.toString() }))
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
            setUserData((prev) => ({ ...prev, userBalance: data ? from_wei(data as string) : '0' }))
        }
    })
    useContractRead({
        address: contract_address as `0x${string}`,
        abi: MAP_STR_ABI[ABI.AWARD_LINEAR_TIMELOCK],
        functionName: QUERY.GETAVAILAMOUNT,
        args: [address],
        watch: true,
        onSuccess(data) {
            setUserData((prev) => ({ ...prev, availAmount: data ? from_wei(data as string) : '0' }))
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
        args: [address, userData?.tokenId],
        onSuccess() {
            addToast(MESSAGES.TX_SENT, {
                appearance: 'success',
                autoDismiss: true,
            });
        },
        onError(err: any) {
            setTxModal(prev => ({ ...prev, modal1: false }));
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
            setTxModal(prev => ({ ...prev, modal1: false }));
            addToast(MESSAGES.TX_SUCCESS, {
                appearance: 'success',
                autoDismiss: true,
            });
        },
        onError(err: any) {
            setTxModal(prev => ({ ...prev, modal1: false }));
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
                setTxModal(prev => ({ ...prev, modal1: false }));
                addToast(MESSAGES.NO_AVAIL_AMOUNT, {
                    appearance: 'error',
                    autoDismiss: true,
                });
            }
        } catch (err) {
            setUserData((prev) => ({ ...prev, tokenId: '' }));
            setTxModal(prev => ({ ...prev, modal1: false }));
            console.log(err);
        }
    }
    useEffect(() => {
        if (userData?.tokenId !== '') {
            setInputErrorState(false);
        }
    }, [userData?.tokenId])

    return (
        <Container>
            <Content>
                <Description>
                    <h1>Linear Timelock Smart Contract (Award Distributer)</h1>
                    <p>Coin distribution is executed linearly and depends on user calling withdraw function. <br /> The total amount is automatically calculated based on the time remaining and your <br /> balance in the contract!</p>
                </Description>
                <CustomTable rows={rows} />
                <BtnWrap>
                    <Button onClick={() => {
                        if (userData?.tokenId) {

                            setTxModal(prev => ({ ...prev, modal0: true })); setCurrentTxData({
                                header: `Confirm the withdrawal of ${putCommaAtPrice(userData?.userBalance ?? '0', 4)} WLC from the contract`, content: 'Action can not be undone', subContent: `Withdrawing funds from the contract...`, function: handleWithdraw
                            })
                        } else {
                            setInputErrorState(true);
                        }
                    }} disabled={disabled} sx={{ width: '100%', }} variant="contained">Withdraw available amount</Button>
                </BtnWrap>
                <BtnWrap>
                    <Button onClick={() => navigate(-1)} sx={{ width: '100%', }} variant="contained">Go Back</Button>
                </BtnWrap>
            </Content>
            <TxConfirmModal
                header={currentTxData.header}
                content={currentTxData.content}
                open={txModal.modal0}
                setModal={setTxModal}
                exec={currentTxData.function}
            />
            <TxProcessModal
                header={currentTxData.subContent}
                content={`Awaiting transaction...`}
                open={txModal.modal1}
            />
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
    padding-top: 170px;
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