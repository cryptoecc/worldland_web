import { AxiosError } from 'axios';
import { provider } from 'configs/axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';
import AddReceiver from './AddReceiver';
import SetTimestamp from './SetTimestamp';
import {
  useAccount,
  useNetwork,
  useSwitchNetwork,
  useBalance,
  useContractWrite,
  useWaitForTransaction,
  useContractRead,
} from 'wagmi';
import { WLD_ADDRESSES } from 'configs/contract_addresses';
import { ABI, CONTRACT_ADDRESSES, FUNCTION, QUERY } from 'utils/enum';
import { MAP_STR_ABI } from 'configs/abis';
import { from_wei } from 'utils/util';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Button, { ButtonProps } from '@mui/material/Button';
import { purple } from '@mui/material/colors';
import WarningModal from 'components/WarningModal';
import { useToasts } from 'react-toast-notifications';
import { MESSAGES } from 'utils/messages';
import CustomTable from 'components/CustomTable';
import UsersTable from 'components/UsersTable';
import { parseEther } from 'viem';


import FilledInput from '@mui/material/FilledInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
export interface Contract {
  balance: string;
  cliffEdge: string;
  releaseEdge: string;
  initialTimestamp: string;
  owner: string;
  isAllIncomingDepositsFinalised: boolean;
  timestampSet: boolean;
}
const initialContractObj = {
  balance: '0',
  cliffEdge: '',
  releaseEdge: '',
  initialTimestamp: '',
  owner: '',
  isAllIncomingDepositsFinalised: false,
  timestampSet: false
}

const Container = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
  height: 100%;
  font-family: 'Nunito Sans', sans-serif;
  margin-top: 70px;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
  gap: 30px;
  max-width: 800px;
  width: 100%;
  padding: 30px;
  background-color: #ffffff;
  color: #000000;
  border: 1px;
  border-radius: 5px;
`;

const H1 = styled.h1`
  text-align: center;
  font-size: 20px;
  font-weight: bold;
`;


const BtnWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
`;

const TableWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 800px;
  width: 100%;
  margin: 40px 0 0;
`




const timeFormat = 'YYYY / MM / DD hh:mm:ss a'

const AdminBoard = () => {
  const [adminId, setAdminId] = useState<string | undefined>('')
  const { address } = useAccount()
  const [inputAmount, setInputAmount] = useState<string>('');
  const [contract, setContract] = useState<Contract>(initialContractObj)
  const navigate = useNavigate()
  const [modal, setModal] = useState<boolean>(false)
  const { addToast } = useToasts();
  const token = localStorage.getItem('token');
  const fetchUserInfo = async () => {
    try {
      const response = await provider.get('/api/admin/admin-info', {
        headers: {
          Authorization: `Bearer ${token}`, // Authorization 헤더에 JWT 포함
        },
      });

      console.log(response.data);
      setAdminId(response.data.id);
    } catch (error) {
      console.error('Error fetching', error);
      const err = error as AxiosError;

      if (err.response && err.response.status === 403) {
        alert('Session expired. Please login again');
        navigate('/wl-admin');
      } else {
        console.error('Error fetching', err);
      }
    }
  };

  const { data: owner } = useContractRead({
    address: WLD_ADDRESSES[CONTRACT_ADDRESSES.LINEAR_TIMELOCK],
    abi: MAP_STR_ABI[ABI.LINEAR_TIMELOCK],
    functionName: QUERY.OWNER,
    onSuccess(data: string) {
      setContract((prev) => ({ ...prev, owner: data }))
    }
  })
  const { data: timestampSet } = useContractRead({
    address: WLD_ADDRESSES[CONTRACT_ADDRESSES.LINEAR_TIMELOCK],
    abi: MAP_STR_ABI[ABI.LINEAR_TIMELOCK],
    functionName: QUERY.TIMESTAMPISSET,
    watch: true,
    onSuccess(data: boolean) {
      setContract((prev) => ({ ...prev, timestampSet: data }))
    }
  })

  const { data: initialTimestamp } = useContractRead({
    address: WLD_ADDRESSES[CONTRACT_ADDRESSES.LINEAR_TIMELOCK],
    abi: MAP_STR_ABI[ABI.LINEAR_TIMELOCK],
    functionName: QUERY.INITIALTIMESTAMP,
    watch: true,
    onSuccess(data) {
      setContract((prev) => ({ ...prev, initialTimestamp: data ? dayjs.unix(Number(data)).format(timeFormat) : '-' }))
    }
  })

  const { data: cliffEdge } = useContractRead({
    address: WLD_ADDRESSES[CONTRACT_ADDRESSES.LINEAR_TIMELOCK],
    abi: MAP_STR_ABI[ABI.LINEAR_TIMELOCK],
    functionName: QUERY.CLIFFEDGE,
    watch: true,
    onSuccess(data) {
      setContract((prev) => ({ ...prev, cliffEdge: data ? dayjs.unix(Number(data)).format(timeFormat) : '-' }))
    }
  })

  const { data: releaseEdge } = useContractRead({
    address: WLD_ADDRESSES[CONTRACT_ADDRESSES.LINEAR_TIMELOCK],
    abi: MAP_STR_ABI[ABI.LINEAR_TIMELOCK],
    functionName: QUERY.RELEASEEDGE,
    watch: true,
    onSuccess(data) {
      setContract((prev) => ({ ...prev, releaseEdge: data ? dayjs.unix(Number(data)).format(timeFormat) : '-' }))
    }
  })

  const { data: contractBalance } = useContractRead({
    address: WLD_ADDRESSES[CONTRACT_ADDRESSES.LINEAR_TIMELOCK],
    abi: MAP_STR_ABI[ABI.LINEAR_TIMELOCK],
    functionName: QUERY.CONTRACTBALANCE,
    watch: true,
    onSuccess(data) {
      setContract((prev) => ({ ...prev, balance: from_wei(data as string) ? from_wei(data as string) : '0' }))
    }
  })
  const { data: isAllIncomingDepositsFinalised } = useContractRead({
    address: WLD_ADDRESSES[CONTRACT_ADDRESSES.LINEAR_TIMELOCK],
    abi: MAP_STR_ABI[ABI.LINEAR_TIMELOCK],
    functionName: QUERY.ISFINALISED,
    watch: true,
    onSuccess(data: boolean) {
      setContract((prev) => ({ ...prev, isAllIncomingDepositsFinalised: data }))
    }
  })

  const { write: finalize } = useContractWrite({
    address: WLD_ADDRESSES[CONTRACT_ADDRESSES.LINEAR_TIMELOCK],
    abi: MAP_STR_ABI[ABI.LINEAR_TIMELOCK],
    functionName: FUNCTION.FINALIZE,
    onSuccess() {
      addToast(MESSAGES.TX_SUCCESS, {
        appearance: 'success',
        content: MESSAGES.FINALIZED,
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

  const { write: depositWL } = useContractWrite({
    address: WLD_ADDRESSES[CONTRACT_ADDRESSES.LINEAR_TIMELOCK],
    abi: MAP_STR_ABI[ABI.LINEAR_TIMELOCK],
    functionName: FUNCTION.DEPOSITWL,
    value: parseEther(inputAmount),
    onSuccess() {
      addToast(MESSAGES.TX_SUCCESS, {
        appearance: 'success',
        content: MESSAGES.TRANSFER_SUCCESS,
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

  async function handleFinalize() {
    try {
      if (parseInt(contract.balance) === 0) {
        addToast(MESSAGES.TX_FAIL, {
          appearance: 'error',
          content: MESSAGES.LOW_CONTRACT_BALANCE,
          autoDismiss: true,
        });
        setModal(false);
      } else if (!contract.timestampSet) {
        addToast(MESSAGES.TX_FAIL, {
          appearance: 'error',
          content: MESSAGES.NO_TIMESTAMP,
          autoDismiss: true,
        });
        setModal(false);
      } else {
        finalize?.();
        setModal(false);
      }
    } catch (err: any) {
      addToast(MESSAGES.TX_FAIL, {
        appearance: 'error',
        content: err?.shortMessage,
        autoDismiss: true,
      });
    }
  }

  useEffect(() => {
    fetchUserInfo();
    setAdminId(address);
  }, []);

  return (
    <Container>
      <Content>
        <H1>Timelock Period Setting</H1>
        <CustomTable address={WLD_ADDRESSES[CONTRACT_ADDRESSES.LINEAR_TIMELOCK]} contract={contract} />
        <FormControl fullWidth sx={{ m: 1 }} variant="filled">
          <InputLabel htmlFor="filled-adornment-amount">Amount</InputLabel>
          <FilledInput
            id="filled-adornment-amount"
            startAdornment={<InputAdornment position="start">₩L</InputAdornment>}
            onChange={(e) => setInputAmount(e.target.value)}
          />
        </FormControl>
        <BtnWrap>
          <Button sx={{ width: '100%' }} disabled={contract?.isAllIncomingDepositsFinalised} onClick={() => depositWL()} variant="contained">Deposit WL</Button>
        </BtnWrap>
        <SetTimestamp isTimestampSet={contract.timestampSet} />
        <AddReceiver isFinalised={contract?.isAllIncomingDepositsFinalised} />
        <BtnWrap>
          <Button disabled={contract?.isAllIncomingDepositsFinalised} onClick={() => setModal(true)} color="error" variant="contained">Finalize Admin Interaction</Button>
        </BtnWrap>
      </Content>
      <TableWrap>
        <UsersTable users={[{ address: '0x210706cbd9D26c26c727f4d3007D819390934375', total_amount: '100 WL' }, { address: '0x210706cbd9D26c26c727f4d3007D819390934375', total_amount: '100 WL' }, { address: '0x210706cbd9D26c26c727f4d3007D819390934375', total_amount: '100 WL' }, { address: '0x210706cbd9D26c26c727f4d3007D819390934375', total_amount: '100 WL' }, { address: '0x210706cbd9D26c26c727f4d3007D819390934375', total_amount: '100 WL' }, { address: '0x210706cbd9D26c26c727f4d3007D819390934375', total_amount: '100 WL' }, { address: '0x210706cbd9D26c26c727f4d3007D819390934375', total_amount: '100 WL' },]} />
      </TableWrap>
      <WarningModal open={modal} setModal={setModal} exec={handleFinalize} />
    </Container>
  );
};

export default AdminBoard;
