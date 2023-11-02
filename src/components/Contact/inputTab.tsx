import { styled } from 'styled-components';
import React, { useState } from 'react';
import axios from 'axios';

const InputTab = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    comment: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log(formData);
      await axios.post('https://be.worldland.foundation:4000/api/contact/send-email', formData);

      alert('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message', error);
      alert('Message send failed!');
    }
  };

  return (
    <Container>
      <H1>Contact</H1>
      <form onSubmit={handleSubmit}>
        <InputDiv>
          <label htmlFor="name">Your Name :</label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            autoComplete="off"
            required
          />
        </InputDiv>
        <InputDiv>
          <label htmlFor="company">Company Name :</label>
          <Input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            autoComplete="off"
            required
          />
        </InputDiv>
        <InputDiv>
          <label htmlFor="email">Email :</label>
          <Input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="off"
            required
          />
        </InputDiv>
        <InputDiv>
          <label htmlFor="phone">Phone :</label>
          <Input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            autoComplete="off"
            required
          />
        </InputDiv>
        <InputDiv>
          <label htmlFor="comment">Comments :</label>
          <Textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            autoComplete="off"
            required
          />
        </InputDiv>
        <Submit type="submit">Send</Submit>
      </form>
    </Container>
  );
};

export default InputTab;

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 900px;
  max-width: 700px;
  border: 1px solid #2e374f;
  border-radius: 30px;
  padding: 10px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  background-color: #0e111c;
  font-weight: 600;
  font-family: 'Nunito Sans', sans-serif;
  gap: 20px;
  opacity: 0.9;
  z-index: 4;
`;

const InputDiv = styled.div`
  display: flex;
  padding: 10px;
  flex-direction: column;
`;

const Input = styled.input`
  width: 300px;
  height: 40px;
  margin-top: 10px;
  border-radius: 10px;
  padding: 10px;
  font-weight: 600;
  font-family: 'Nunito Sans', sans-serif;
  border: 1px solid #2e374f;
`;

const Textarea = styled.textarea`
  width: 500px;
  height: 150px;
  margin-top: 10px;
  border-radius: 10px;
  padding: 10px;
  font-weight: 600;
  font-family: 'Nunito Sans', sans-serif;
  border: 1px solid #2e374f;
`;

const Submit = styled.button`
  /* display: flex;
  justify-content: center;
  align-self: flex-end; */
  color: #4e7be2;
  /* width: 100%; */
  margin-left: 360px;
  width: 250px;
  font-weight: 600;
  font-size: 20px;
  background-color: #1e3062;
  padding: 15px;
  border-radius: 15px;
  margin-top: 30px;
  cursor: pointer;

  &:hover {
    background-color: #1c2232;
  }

  &:disabled {
    background-color: rgb(255, 255, 255, 0.1);
    color: #6a6a6a;
    cursor: not-allowed;
  }
`;

const H1 = styled.h1`
  font-size: 30px;
  margin-bottom: 50px;
`;
