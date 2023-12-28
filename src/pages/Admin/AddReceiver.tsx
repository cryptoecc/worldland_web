import { useState } from 'react';
import { styled } from 'styled-components';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { CheckJwt } from 'utils/jwt';

type Receiver = {
  receiveAddress: string;
  totalAmount: string;
  totalTime: string;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
`;

const H1 = styled.h1`
  margin-left: 100px;
  font-size: 20px;
`;

const InputRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  align-self: stretch;
`;

const Input = styled.input`
  border: 1px solid white;
  background-color: #282828;
  border-radius: 5px;
  text-align: center;
  color: white;
`;

const SendBtn = styled.button`
  width: 80px;
  background-color: #282828;
  padding: 8px;
  border: 1px solid white;
  border-radius: 5px;
  color: white;
  font-size: 10px;
  margin-left: 750px;
  cursor: pointer;
`;

const Button = styled.button`
  color: white;
  font-size: 20px;
  cursor: pointer;
`;

const AddReceiver = () => {
  const [receivers, setReceivers] = useState([{ receiveAddress: '', totalAmount: '', totalTime: '' }]);
  const navigate = useNavigate();

  const addReceiverField = () => {
    setReceivers([...receivers, { receiveAddress: '', totalAmount: '', totalTime: '' }]);
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

    console.log(receivers);
  };

  return (
    <Container>
      <H1>Function Add Receivers</H1>
      <form onSubmit={handleSubmit}>
        {receivers.map((receiver, index) => (
          <InputRow key={index}>
            <div className="input-field">
              <Input
                type="text"
                value={receiver.receiveAddress}
                onChange={(e) => updateField(index, 'receiveAddress', e.target.value)}
                placeholder="Address"
              />
            </div>
            <div className="input-field">
              <Input
                type="text"
                value={receiver.totalAmount}
                onChange={(e) => updateField(index, 'totalAmount', e.target.value)}
                placeholder="T.Amount"
              />
            </div>
            <div className="input-field">
              <Input
                type="text"
                value={receiver.totalTime}
                onChange={(e) => updateField(index, 'totalTime', e.target.value)}
                placeholder="T.Time"
              />
            </div>
            {receivers.length > 1 && <Button onClick={() => removeReceiverField(index)}>-</Button>}
          </InputRow>
        ))}
        <SendBtn type="submit">Submit</SendBtn>
      </form>
      <Button onClick={addReceiverField}>+</Button>
    </Container>
  );
};

export default AddReceiver;
