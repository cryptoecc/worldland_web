import { useState } from 'react';
import { styled } from 'styled-components';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { CheckJwt } from 'utils/jwt';
import { Button } from '@mui/material';
import { useContractWrite, useWaitForTransaction } from 'wagmi';
import { ABI, CONTRACT_ADDRESSES, FUNCTION } from 'utils/enum';
import { WLD_ADDRESSES } from 'configs/contract_addresses';
import { MAP_STR_ABI } from 'configs/abis';
import { from_wei, to_wei } from 'utils/util';
import { useToasts } from 'react-toast-notifications';
import { MESSAGES } from 'utils/messages';
import { provider } from '../../configs/axios';

type Receiver = {
  receiveAddress: string;
  totalAmount: string;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  width: 100%;

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    gap: 10px;
  }
`;

const H1 = styled.h1`
  font-size: 20px;
  font-weight: bold;
`;

const InputRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const Input = styled.input`
  border: 1px solid white;
  background-color: #bcbcbc;
  border-radius: 5px;
  text-align: center;
  color: #000000;
  padding: 10px;
  width: 100%;
  max-width: 300px;
`;

const AddReceiver = ({ isFinalised, fetchDaoInfo }: { isFinalised: boolean; fetchDaoInfo: () => void }) => {
  const [receivers, setReceivers] = useState<Receiver[]>([{ receiveAddress: '', totalAmount: '' }]);
  const [txObj, setTxObj] = useState<{ receivers: string[]; amounts: string[] }>({ receivers: [], amounts: [] })
  const navigate = useNavigate();
  const { addToast } = useToasts();

  const { data: tx, write: bulkDeposit } = useContractWrite({
    address: WLD_ADDRESSES[CONTRACT_ADDRESSES.LINEAR_TIMELOCK],
    abi: MAP_STR_ABI[ABI.LINEAR_TIMELOCK],
    functionName: FUNCTION.BULKDEPOSITTOKENS,
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
    hash: tx?.hash,
    async onSuccess() {
      addToast(MESSAGES.TX_SUCCESS, {
        appearance: 'success',
        content: MESSAGES.DEPOSIT_SUCCESS,
        autoDismiss: true,
      });
      let parsedAmounts = [];
      for (let i = 0; i < txObj.amounts.length; i++) {
        parsedAmounts[i] = from_wei(txObj.amounts[i]);
      }
      await provider.post(
        '/api/admin/dao-list',
        { _receivers: txObj.receivers, _amounts: parsedAmounts },
      );
      fetchDaoInfo();
    },
    onError(err: any) {
      addToast(MESSAGES.TX_FAIL, {
        appearance: 'error',
        content: err?.shortMessage,
        autoDismiss: true,
      });
    }
  })

  const addReceiverField = () => {
    setReceivers((prev) => [...prev, { receiveAddress: '', totalAmount: '' }]);
  };

  const updateField = (index: number, field: keyof Receiver, value: string) => {
    const updatedReceivers: Receiver[] = receivers.map((receiver, i) =>
      i === index ? { ...receiver, [field]: value } : receiver,
    );
    setReceivers(updatedReceivers);
  };

  const removeReceiverField = (index: number) => {
    const filteredReceivers = receivers.filter((_, i) => i !== index);
    setReceivers(filteredReceivers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await CheckJwt(navigate);
    // try {
    //   const response = await axios.get('http://localhost:4000/api/admin/admin-info', {
    //     headers: {
    //       Authorization: `Bearer ${token}`, // Authorization 헤더에 JWT 포함
    //     },
    //   });

    //   console.log(response);
    // } catch (error) {
    //   console.error('Error fetching', error);
    //   const err = error as AxiosError;

    //   if (err.response && err.response.status === 403) {
    //     alert('Session expired. Please login again');
    //     navigate('/wl-admin');
    //   } else {
    //     console.error('Error fetching', err);
    //   }
    // }
    let _receivers: string[] = [];
    let _amounts: string[] = [];
    let empty_fields = [];
    for (let i = 0; i < receivers.length; i++) {
      _receivers[i] = receivers[i].receiveAddress;
      _amounts[i] = to_wei(receivers[i].totalAmount);
      if (_receivers[i] === '' || _amounts[i] === '') empty_fields[i] = _receivers[i];
    }
    if (_receivers.length > 0 && _amounts.length > 0) {
      if (empty_fields.length > 0) {
        addToast(MESSAGES.SUBMISSION_ERROR, {
          appearance: 'error',
          content: MESSAGES.EMPTY_FIELD,
          autoDismiss: true,
        });
      } else {
        bulkDeposit?.({ args: [_receivers, _amounts] });
        setTxObj({ receivers: _receivers, amounts: _amounts })
      }
    } else {
      addToast(MESSAGES.SUBMISSION_ERROR, {
        appearance: 'error',
        content: MESSAGES.NO_RECEIVER,
        autoDismiss: true,
      });
    }
  };

  return (
    <Container>
      <H1>Add Receivers</H1>
      <form onSubmit={handleSubmit}>
        {receivers.map((receiver, index) => (
          <InputRow key={index}>
            <Input
              type="text"
              value={receiver.receiveAddress}
              onChange={(e) => updateField(index, 'receiveAddress', e.target.value)}
              placeholder="Wallet Address"
            />
            <Input
              type="text"
              value={receiver.totalAmount}
              onChange={(e) => updateField(index, 'totalAmount', e.target.value)}
              placeholder="Total Amount"
            />
            <Button disabled={receivers.length === 1} variant="contained" onClick={() => removeReceiverField(index)}>
              -
            </Button>
          </InputRow>
        ))}
        <Button sx={{ width: '100%' }} variant="contained" onClick={addReceiverField}>
          +
        </Button>
        <Button disabled={isFinalised} sx={{ width: '100%', margin: '10px 0 0' }} variant="contained" type="submit">
          Submit
        </Button>
      </form>
    </Container>
  );
};

export default AddReceiver;
