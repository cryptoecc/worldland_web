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
import { ABI, CONTRACT_ADDRESSES, QUERY } from 'utils/enum';
import { MAP_STR_ABI } from 'configs/abis';
import { from_wei } from 'utils/util';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

interface Contract {
  balance: string;
  cliffEdge: string;
  releaseEdge: string;
  initialTimestamp: string;
  owner: string;
  interactionFinalized: boolean;
}
const initialContractObj = {
  balance: '',
  cliffEdge: '',
  releaseEdge: '',
  initialTimestamp: '',
  owner: '',
  interactionFinalized: false,
}

const Container = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
  height: 100vh;
  font-family: 'Nunito Sans', sans-serif;
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
  border-radius: 10px;
`;

const H1 = styled.h1`
  text-align: center;
  font-size: 20px;
  font-weight: bold;
`;

const AdminInfo = styled.div`
  text-align: start;
  width: 100%;

  .success {
    color: #01b30d;
  }
`;

const timeFormat = 'YYYY / MM / DD hh:mm:ss'

const AdminBoard = () => {
  dayjs.extend(relativeTime);
  const [adminId, setAdminId] = useState<string | undefined>('')
  const { address } = useAccount()
  const [contract, setContract] = useState<Contract>(initialContractObj)
  const navigate = useNavigate()

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

  const { data: timestampSet } = useContractRead({
    address: WLD_ADDRESSES[CONTRACT_ADDRESSES.LINEAR_TIMELOCK],
    abi: MAP_STR_ABI[ABI.LINEAR_TIMELOCK],
    functionName: QUERY.TIMESTAMPISSET,
    watch: true,
  })

  const { data: initialTimestamp } = useContractRead({
    address: WLD_ADDRESSES[CONTRACT_ADDRESSES.LINEAR_TIMELOCK],
    abi: MAP_STR_ABI[ABI.LINEAR_TIMELOCK],
    functionName: QUERY.INITIALTIMESTAMP,
    watch: true,
    onSuccess(data) {
      setContract((prev) => ({ ...prev, initialTimestamp: dayjs.unix(Number(data)).format(timeFormat) }))
    }
  })

  const { data: cliffEdge } = useContractRead({
    address: WLD_ADDRESSES[CONTRACT_ADDRESSES.LINEAR_TIMELOCK],
    abi: MAP_STR_ABI[ABI.LINEAR_TIMELOCK],
    functionName: QUERY.CLIFFEDGE,
    watch: true,
    onSuccess(data) {
      setContract((prev) => ({ ...prev, cliffEdge: dayjs.unix(Number(data)).format(timeFormat) }))
    }
  })

  const { data: releaseEdge } = useContractRead({
    address: WLD_ADDRESSES[CONTRACT_ADDRESSES.LINEAR_TIMELOCK],
    abi: MAP_STR_ABI[ABI.LINEAR_TIMELOCK],
    functionName: QUERY.RELEASEEDGE,
    watch: true,
    onSuccess(data) {
      setContract((prev) => ({ ...prev, releaseEdge: dayjs.unix(Number(data)).format(timeFormat) }))
    }
  })

  const { data: contractBalance } = useContractRead({
    address: WLD_ADDRESSES[CONTRACT_ADDRESSES.LINEAR_TIMELOCK],
    abi: MAP_STR_ABI[ABI.LINEAR_TIMELOCK],
    functionName: QUERY.CONTRACTBALANCE,
    watch: true,
    onSuccess(data) {
      setContract((prev) => ({ ...prev, balance: from_wei(data as string) }))
    }
  })

  useEffect(() => {
    fetchUserInfo();
    setAdminId(address);
  }, []);

  let _timestampSet = timestampSet ? 'Has been set up!' : "Is not set!"
  return (
    <Container>
      <Content>
        <H1>Timelock Period Setting</H1>
        <AdminInfo>Contract Owner : {adminId}</AdminInfo>
        <AdminInfo>Timelock Contract Address : {adminId}</AdminInfo>
        <AdminInfo>Contract Balance : {contract?.balance} WL</AdminInfo>
        <AdminInfo>Initial timestamp : {contract.initialTimestamp} ( {dayjs(contract.initialTimestamp).fromNow()} )</AdminInfo>
        <AdminInfo>Lock Time ending : {contract.cliffEdge} ( {dayjs(contract.cliffEdge).fromNow()} )</AdminInfo>
        <AdminInfo>Final Release Time Ending : {contract?.releaseEdge} ( {dayjs(contract.releaseEdge).fromNow()} )</AdminInfo>
        <AdminInfo>Timestamp status : <span className={timestampSet ? 'success' : ''}>{_timestampSet}</span></AdminInfo>
        <SetTimestamp />
        <AddReceiver />
      </Content>
    </Container>
  );
};

export default AdminBoard;
