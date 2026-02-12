'use client';

import { useState, useEffect, useCallback } from 'react';

interface WalletState {
  address: string | null;
  balance: string | null;
  chainId: number | null;
  isConnecting: boolean;
  isConnected: boolean;
  error: string | null;
}

const BSC_TESTNET_CHAIN_ID = 97;

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    address: null,
    balance: null,
    chainId: null,
    isConnecting: false,
    isConnected: false,
    error: null,
  });

  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);

  // Detect MetaMask on mount (client-side only)
  useEffect(() => {
    const checkMetaMask = () => {
      const installed = typeof window !== 'undefined' && !!window.ethereum;
      setIsMetaMaskInstalled(installed);

      // If MetaMask is installed and already connected, restore session
      if (installed && window.ethereum) {
        window.ethereum
          .request({ method: 'eth_accounts' })
          .then((accounts: string[]) => {
            if (accounts.length > 0) {
              setState((prev) => ({
                ...prev,
                address: accounts[0],
                isConnected: true,
                error: null,
              }));
              // Get chain ID
              window.ethereum
                .request({ method: 'eth_chainId' })
                .then((chainIdHex: string) => {
                  setState((prev) => ({
                    ...prev,
                    chainId: parseInt(chainIdHex, 16),
                  }));
                })
                .catch(() => {});
            }
          })
          .catch(() => {});
      }
    };

    checkMetaMask();
  }, []);

  // Listen for MetaMask events
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected
        setState({
          address: null,
          balance: null,
          chainId: null,
          isConnecting: false,
          isConnected: false,
          error: null,
        });
      } else {
        setState((prev) => ({
          ...prev,
          address: accounts[0],
          isConnected: true,
          error: null,
        }));
      }
    };

    const handleChainChanged = (chainIdHex: string) => {
      setState((prev) => ({
        ...prev,
        chainId: parseInt(chainIdHex, 16),
      }));
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
    };
  }, []);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setState((prev) => ({ ...prev, error: 'MetaMask is not installed' }));
      return null;
    }

    setState((prev) => ({ ...prev, isConnecting: true, error: null }));

    try {
      const accounts: string[] = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const chainIdHex: string = await window.ethereum.request({
        method: 'eth_chainId',
      });

      setState({
        address: accounts[0],
        balance: null,
        chainId: parseInt(chainIdHex, 16),
        isConnecting: false,
        isConnected: true,
        error: null,
      });

      return accounts[0];
    } catch (err: any) {
      const message =
        err.code === 4001
          ? 'Connection rejected by user'
          : err.message || 'Failed to connect wallet';
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error: message,
      }));
      return null;
    }
  }, []);

  const disconnect = useCallback(() => {
    setState({
      address: null,
      balance: null,
      chainId: null,
      isConnecting: false,
      isConnected: false,
      error: null,
    });
  }, []);

  const switchToBscTestnet = useCallback(async () => {
    if (!window.ethereum) return false;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${BSC_TESTNET_CHAIN_ID.toString(16)}` }],
      });
      return true;
    } catch (switchError: any) {
      // Chain not added — try adding it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${BSC_TESTNET_CHAIN_ID.toString(16)}`,
                chainName: 'BSC Testnet',
                nativeCurrency: { name: 'BNB', symbol: 'tBNB', decimals: 18 },
                rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
                blockExplorerUrls: ['https://testnet.bscscan.com'],
              },
            ],
          });
          return true;
        } catch {
          return false;
        }
      }
      return false;
    }
  }, []);

  const signMessage = useCallback(
    async (message: string) => {
      if (!window.ethereum || !state.address) {
        throw new Error('Wallet not connected');
      }

      const signature: string = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, state.address],
      });

      return signature;
    },
    [state.address]
  );

  // Mock payment — simulates a USDT transfer and returns a fake tx hash
  const mockPayment = useCallback(
    async (
      _amount: number,
      _description: string
    ): Promise<{ txHash: string }> => {
      if (!state.isConnected) {
        throw new Error('Wallet not connected');
      }

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate a realistic-looking tx hash
      const randomBytes = Array.from({ length: 32 }, () =>
        Math.floor(Math.random() * 256)
          .toString(16)
          .padStart(2, '0')
      ).join('');

      return { txHash: `0x${randomBytes}` };
    },
    [state.isConnected]
  );

  return {
    ...state,
    isMetaMaskInstalled,
    connect,
    disconnect,
    switchToBscTestnet,
    signMessage,
    mockPayment,
    BSC_TESTNET_CHAIN_ID,
  };
}

// Window type extension
declare global {
  interface Window {
    ethereum?: any;
  }
}
