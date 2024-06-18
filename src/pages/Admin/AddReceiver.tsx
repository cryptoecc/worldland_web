import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { checkJWT } from 'utils/jwt';
import { Button } from '@mui/material';
import { useContractWrite, useWaitForTransaction } from 'wagmi';
import { ABI, CONTRACT_ADDRESSES, FUNCTION } from 'utils/enum';
import { WLD_ADDRESSES } from 'configs/contract_addresses';
import { MAP_STR_ABI } from 'configs/abis';
import { from_wei, to_wei } from 'utils/util';
import { useToasts } from 'react-toast-notifications';
import { MESSAGES } from 'utils/messages';
import { provider } from '../../configs/axios';
import SetTimestamp from './SetTimestamp';
import dayjs from 'dayjs';

type Receiver = {
  receiveAddress: string;
  totalAmount: string;
  lockTime: string;
  vestTime: string;
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

const Wrap = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  gap: 10px;
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

type TxDetails = {
  header: string;
  content: string;
  subContent: string;
  function: () => void;
}

type Modals = {
  modal0: boolean;
  modal1: boolean;
};

const AddReceiver = ({ setModal, setCurrentTxData, isFinalised, fetchDaoInfo }: { setModal: React.Dispatch<React.SetStateAction<Modals>>; setCurrentTxData: React.Dispatch<React.SetStateAction<TxDetails>>; isFinalised: boolean; fetchDaoInfo: () => void }) => {
  const [receivers, setReceivers] = useState<Receiver[]>([{ receiveAddress: '', totalAmount: '', lockTime: '', vestTime: '' }]);
  const [txObj, setTxObj] = useState<{ receivers: string[]; amounts: string[], lockTime: string[], vestTime: string[] }>({ receivers: [], amounts: [], lockTime: [], vestTime: [] });
  const { addToast } = useToasts();

  const { data: tx, write: bulkDepositFeaturingTimestamp } = useContractWrite({
    address: WLD_ADDRESSES[CONTRACT_ADDRESSES.AWARD_LINEAR_TIMELOCK],
    abi: MAP_STR_ABI[ABI.AWARD_LINEAR_TIMELOCK],
    functionName: FUNCTION.BULKDEPOSITTOKENSFEATURINGTIMESTAMP,
    onSuccess() {
      addToast(MESSAGES.TX_SENT, {
        appearance: 'success',
        autoDismiss: true,
      });
    },
    onError(err: any) {
      setModal(prev => ({ ...prev, modal1: false }));
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
      setModal(prev => ({ ...prev, modal1: false }));
      let parsedAmounts = [];
      for (let i = 0; i < txObj.amounts.length; i++) {
        parsedAmounts[i] = from_wei(txObj.amounts[i]);
      }
      setReceivers((prev) => [{ receiveAddress: '', totalAmount: '', lockTime: '', vestTime: '' }]);
      await provider.post('/api/admin/dao-list', { _receivers: txObj.receivers, _amounts: parsedAmounts });
      fetchDaoInfo();
    },
    onError(err: any) {
      addToast(MESSAGES.TX_FAIL, {
        appearance: 'error',
        content: err?.shortMessage,
        autoDismiss: true,
      });
      setModal(prev => ({ ...prev, modal1: false }));
    },
  });

  const addReceiverField = () => {
    setReceivers((prev) => [...prev, { receiveAddress: '', totalAmount: '', lockTime: '', vestTime: '' }]);
  };

  const updateField = (index: number, field: keyof Receiver, value: string | null) => {
    const updatedReceivers: Receiver[] = receivers.map((receiver, i) =>
      i === index ? { ...receiver, [field]: value } : receiver,
    );
    setReceivers(updatedReceivers);
  };

  const removeReceiverField = (index: number) => {
    const filteredReceivers = receivers.filter((_, i) => i !== index);
    setReceivers(filteredReceivers);
  };

  function handleOpenModal() {
    setModal(prev => ({ ...prev, modal0: true }));
    setCurrentTxData({ header: `Confirm transaction`, content: 'Adding WLC receivers to the Timelock contract', subContent: `Adding WLC receivers to the Timelock contract`, function: handleSubmit })
  }

  const handleSubmit = () => {
    checkJWT();
    let _receivers: string[] = [];
    let _amounts: string[] = [];
    let _cliffEdge: string[] = [];
    let _releaseEdge: string[] = [];
    let empty_fields = [];
    const now = dayjs().unix();
    for (let i = 0; i < receivers.length; i++) {
      _receivers[i] = receivers[i].receiveAddress;
      _amounts[i] = to_wei(receivers[i].totalAmount);
      _cliffEdge[i] = (dayjs(receivers[i].lockTime).unix() - now).toString();
      _releaseEdge[i] = (dayjs(receivers[i].vestTime).unix() - now).toString();
      if (_receivers[i] === '' || _amounts[i] === '' || _cliffEdge[i] === '' || _releaseEdge[i] === '') empty_fields[i] = _receivers[i];
    }
    if (_receivers.length > 0 && _amounts.length > 0) {
      if (empty_fields.length > 0) {
        addToast(MESSAGES.SUBMISSION_ERROR, {
          appearance: 'error',
          content: MESSAGES.EMPTY_FIELD,
          autoDismiss: true,
        });
      } else {
        bulkDepositFeaturingTimestamp?.({ args: [_receivers, _amounts, _cliffEdge, _releaseEdge] });
        setTxObj({ receivers: _receivers, amounts: _amounts, lockTime: _cliffEdge, vestTime: _releaseEdge });
      }
    } else {
      addToast(MESSAGES.SUBMISSION_ERROR, {
        appearance: 'error',
        content: MESSAGES.NO_RECEIVER,
        autoDismiss: true,
      });
    }
  };

  function checkEmptyField() {
    for (let i of receivers) {
      for (let j of Object.values(i)) {
        if (!j) {
          return true;
        }
      }
    }
    return false;
  }


  return (
    <Container>
      <H1>Add Receivers</H1>
      {receivers.map((receiver, index) => (
        <Wrap key={index}>
          <InputRow>
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
          <SetTimestamp index={index} time={receiver} setTime={updateField} />
        </Wrap>
      ))}
      <Button disabled={checkEmptyField()} sx={{ width: '100%' }} variant="contained" onClick={addReceiverField}>
        +
      </Button>
      <Button disabled={checkEmptyField() || isFinalised} sx={{ width: '100%', margin: '10px 0 0' }} onClick={handleOpenModal} variant="contained" type="submit">
        Submit
      </Button>
    </Container>
  );
};

export default AddReceiver;
