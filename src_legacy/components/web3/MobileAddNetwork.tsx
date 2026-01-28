import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { disconnect } from '@wagmi/core';

function MobileMetamask() {
  const [status, setStatus] = useState('Not Connected');
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  async function _disconnect() {
    await disconnect();
  }

  useEffect(() => {
    async function connectMetamask() {
      if (window.ethereum) {
        window.ethereum.on('accountsChanged', function (accounts: string[]) {
          //   localStorage.setItem('connectedAccount', accounts[0]);
          //   setConnectedAccount(accounts[0]);
          console.log('Disconnected');
        });
      }
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        try {
          //   await window.ethereum.enable(); // 사용자에게 메타마스크 연결 요청
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          console.log(accounts);
          setStatus('MetaMask is connected.');
        } catch (error) {
          setStatus('Connection Failed');
        }
      } else {
        setStatus('Please install MetaMask!');
      }
    }

    connectMetamask();
    // _disconnect();

    console.log({ isConnected, ethereum: window.ethereum.isConnected });
  }, [window.ethereum]); // 컴포넌트가 마운트 될 때 한번만 실행

  return <div>{status} </div>;
}

export default MobileMetamask;
