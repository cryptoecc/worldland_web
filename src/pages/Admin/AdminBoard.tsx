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
import Button from '@mui/material/Button';
import WarningModal from 'components/WarningModal';
import { useToasts } from 'react-toast-notifications';
import { MESSAGES, popups } from 'utils/messages';
import CustomTable from 'components/CustomTable';
import UsersTable from 'components/UsersTable';
import { parseEther } from 'viem';

import FilledInput from '@mui/material/FilledInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import { EPS } from 'constants/api-routes';
import { MAPNETTOADDRESS } from 'configs/contract_address_config';
import TxConfirmModal from 'components/main/TxConfirmModal';
import TxProcessModal from 'components/main/TxProcessModal';
export interface Contract {
  balance: string;
  owner: string;
  isAllIncomingDepositsFinalised: boolean;
}

export interface UserData {
  id: number;
  created_at: string;
  wallet_address: string;
  total_amount: string;
}

export const initialContractObj = {
  balance: '0',
  owner: '',
  isAllIncomingDepositsFinalised: false,
};

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
  align-items: flex-end;
  justify-content: flex-end;
  flex-direction: column;
  width: 100%;
  gap: 20px;
`;

const TableWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 800px;
  width: 100%;
  margin: 40px 0 0;
`;

const timeFormat = 'YYYY / MM / DD hh:mm:ss a';
function createData(name: string, value: string | number) {
  return { name, value };
}

interface IProps {
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
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


const AdminBoard = ({ token, setToken }: IProps) => {
  dayjs.extend(relativeTime);
  const [adminId, setAdminId] = useState<string | undefined>('');
  const [daoInfo, setDaoInfo] = useState<UserData[]>([]);
  const { address } = useAccount();
  const [inputAmount, setInputAmount] = useState<string>('');
  const [contract, setContract] = useState<Contract>(initialContractObj);
  const [modals, setModals] = useState<Modals>({ modal0: false, modal1: false });
  const [txModal, setTxModal] = useState<Modals>({ modal0: false, modal1: false });
  const { addToast } = useToasts();
  const [currentTxData, setCurrentTxData] = useState<TxDetails>({ header: '', content: '', subContent: '', function: () => { } })
  const rows = [
    createData('Contract Owner', contract?.owner),
    createData('Timelock Contract Address', WLD_ADDRESSES[CONTRACT_ADDRESSES.AWARD_LINEAR_TIMELOCK]),
    createData('Contract Balance', contract?.balance + ' WL'),
    createData('Contract-Admin interaction', contract.isAllIncomingDepositsFinalised ? 'Locked 🔒' : 'Open 🔓'),
  ];

  function handleRemoveAuthToken() {
    localStorage.removeItem('token');
    setToken('');
    setModals((prev) => ({ ...prev, modal1: false }));
  }

  const fetchUserInfo = async () => {
    try {
      const response = await provider.get(EPS.ADMIN_INFO, {
        headers: {
          Authorization: `Bearer ${token}`, // Authorization 헤더에 JWT 포함
        },
      });
      setAdminId(response.data.id);
    } catch (error) {
      console.error('Error fetching', error);
    }
  };

  const fetchDaoInfo = async () => {
    try {
      const response = await provider.get(EPS.DAO_INFO);
      console.log(response.data);
      setDaoInfo(response.data);
    } catch (error) {
      console.error('Error fetching', error);
    }
  };

  useContractRead({
    address: WLD_ADDRESSES[CONTRACT_ADDRESSES.AWARD_LINEAR_TIMELOCK],
    abi: MAP_STR_ABI[ABI.AWARD_LINEAR_TIMELOCK],
    functionName: QUERY.OWNER,
    onSuccess(data: string) {
      setContract((prev) => ({ ...prev, owner: data }));
    },
  });

  // // main contract ERC20 balance check
  // useContractRead({
  //   address: MAPNETTOADDRESS.ERC20_WWLC,
  //   abi: MAP_STR_ABI[ABI.ERC20_ABI],
  //   functionName: QUERY.BALANCEOF,
  //   args: [MAPNETTOADDRESS.AWARD_LINEAR_TIMELOCK],
  //   watch: true,
  //   onSuccess(data) {
  //     setContract((prev) => ({ ...prev, balance: from_wei(data?.toString()) }));
  //   }
  // })

  useBalance({
    address: WLD_ADDRESSES[CONTRACT_ADDRESSES.AWARD_LINEAR_TIMELOCK],
    watch: true,
    onSuccess(data) {
      setContract((prev) => ({ ...prev, balance: data?.value ? from_wei(data?.value.toString()) : data?.value.toString() }))
    }
  })

  useContractRead({
    address: WLD_ADDRESSES[CONTRACT_ADDRESSES.AWARD_LINEAR_TIMELOCK],
    abi: MAP_STR_ABI[ABI.AWARD_LINEAR_TIMELOCK],
    functionName: QUERY.ISFINALISED,
    watch: true,
    onSuccess(data: boolean) {
      setContract((prev) => ({ ...prev, isAllIncomingDepositsFinalised: data }));
    },
  });

  const { data: txFinalized, write: finalize } = useContractWrite({
    address: WLD_ADDRESSES[CONTRACT_ADDRESSES.AWARD_LINEAR_TIMELOCK],
    abi: MAP_STR_ABI[ABI.AWARD_LINEAR_TIMELOCK],
    functionName: FUNCTION.FINALIZE,
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

  // const { data: txWLDeposited, write: depositWL } = useContractWrite({
  //   address: MAPNETTOADDRESS.ERC20_WWLC,
  //   abi: MAP_STR_ABI[ABI.ERC20_ABI],
  //   functionName: FUNCTION.TRANSFER,
  //   args: [MAPNETTOADDRESS.AWARD_LINEAR_TIMELOCK, parseEther(inputAmount)],
  //   onSuccess() {
  //     addToast(MESSAGES.TX_SENT, {
  //       appearance: 'success',
  //       autoDismiss: true,
  //     });
  //     setInputAmount('');
  //   },
  //   onError(err: any) {
  //     addToast(MESSAGES.TX_FAIL, {
  //       appearance: 'error',
  //       content: err?.shortMessage,
  //       autoDismiss: true,
  //     });
  //   },
  // });

  const { data: txWLDeposited, write: depositWL } = useContractWrite({
    address: MAPNETTOADDRESS.AWARD_LINEAR_TIMELOCK,
    abi: MAP_STR_ABI[ABI.AWARD_LINEAR_TIMELOCK],
    functionName: FUNCTION.DEPOSITWL,
    value: parseEther(inputAmount),
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
      setTxModal(prev => ({ ...prev, modal1: false }));
    },
  });

  const { data: txWLWithdrawn, write: withdrawWL } = useContractWrite({
    address: MAPNETTOADDRESS.AWARD_LINEAR_TIMELOCK,
    abi: MAP_STR_ABI[ABI.AWARD_LINEAR_TIMELOCK],
    functionName: FUNCTION.WITHDRAWWL,
    args: [parseEther(inputAmount)],
    value: parseEther('0'),
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
      setTxModal(prev => ({ ...prev, modal1: false }));
    },
  });

  useWaitForTransaction({
    hash: txFinalized?.hash || txWLDeposited?.hash || txWLWithdrawn?.hash,
    async onSuccess() {
      let msg;
      if (txWLDeposited?.hash) {
        msg = MESSAGES.TRANSFER_SUCCESS;
      } else if (txWLWithdrawn?.hash) {
        msg = MESSAGES.WITHDRAWAL_SUCCESS;
      } else if (txFinalized?.hash) {
        msg = MESSAGES.FINALIZED;
      }
      addToast(MESSAGES.TX_SUCCESS, {
        appearance: 'success',
        content: msg,
        autoDismiss: true,
      });
      setInputAmount('');
      setTxModal(prev => ({ ...prev, modal1: false }));
    },
    onError(err: any) {
      addToast(MESSAGES.TX_FAIL, {
        appearance: 'error',
        content: err?.shortMessage,
        autoDismiss: true,
      });
      setInputAmount('');
      setTxModal(prev => ({ ...prev, modal1: false }));
    },
  });

  async function handleFinalize() {
    try {
      if (parseInt(contract.balance) === 0) {
        addToast(MESSAGES.TX_FAIL, {
          appearance: 'error',
          content: MESSAGES.LOW_CONTRACT_BALANCE,
          autoDismiss: true,
        });
        setModals((prev) => ({ ...prev, modal0: false }));
      } else {
        finalize?.();
        setModals((prev) => ({ ...prev, modal0: false }));
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
    fetchDaoInfo();
    setAdminId(address);
  }, []);
  return (
    <Container>
      <Content>
        <H1>Linear Timelock Smart Contract Settings</H1>
        <CustomTable rows={rows} />
        <FormControl fullWidth sx={{ m: 1 }} variant="filled">
          <InputLabel htmlFor="filled-adornment-amount">Amount</InputLabel>
          <FilledInput
            id="filled-adornment-amount"
            value={inputAmount}
            startAdornment={<InputAdornment position="start">₩L</InputAdornment>}
            onChange={(e) => setInputAmount(e.target.value)}
          />
        </FormControl>
        <BtnWrap>
          <Button
            sx={{ width: '100%' }}
            disabled={contract?.isAllIncomingDepositsFinalised || !inputAmount}
            onClick={() => { setTxModal(prev => ({ ...prev, modal0: true })); setCurrentTxData({ header: `Confirm deposit of ${inputAmount} WLC`, content: 'Sending funds to the contract', subContent: `Deposit of ${inputAmount} WLC is confirmed`, function: depositWL }) }}
            variant="contained"
          >
            Deposit
          </Button>
          <Button
            sx={{ width: '100%' }}
            disabled={contract?.isAllIncomingDepositsFinalised || !inputAmount || parseInt(contract.balance) <= 0}
            onClick={() => { setTxModal(prev => ({ ...prev, modal0: true })); setCurrentTxData({ header: `Confirm withdrawal of ${inputAmount} WLC`, content: 'Withdrawal of funds from the contract', subContent: `Withdrawal of ${inputAmount} WLC is confirmed`, function: withdrawWL }) }}
            variant="contained"
          >
            Withdraw
          </Button>
        </BtnWrap>
        <AddReceiver setModal={setTxModal} setCurrentTxData={setCurrentTxData} isFinalised={contract?.isAllIncomingDepositsFinalised} fetchDaoInfo={fetchDaoInfo} />
        <BtnWrap>
          <Button
            disabled={contract?.isAllIncomingDepositsFinalised}
            onClick={() => setModals((prev) => ({ ...prev, modal0: true }))}
            color="error"
            variant="contained"
          >
            Finalize Admin Interaction
          </Button>
          <Button onClick={() => setModals((prev) => ({ ...prev, modal1: true }))} color="error" variant="contained">
            Logout
          </Button>
        </BtnWrap>
      </Content>
      <TableWrap>{daoInfo.length > 0 && <UsersTable users={daoInfo} />}</TableWrap>
      <WarningModal
        header={popups.WARNING}
        content={popups.FINALIZE_W}
        open={modals.modal0}
        setModal={() => setModals((prev) => ({ ...prev, modal0: false }))}
        exec={handleFinalize}
      />
      <WarningModal
        header={popups.CONFIRM}
        content={popups.LOGOUT}
        open={modals.modal1}
        setModal={() => setModals((prev) => ({ ...prev, modal1: false }))}
        exec={handleRemoveAuthToken}
      />
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
  );
};

export default AdminBoard;
