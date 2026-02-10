'use client';

/**
 * Wallet hook — DISABLED
 * 
 * This hook is currently disabled pending mainnet configuration.
 * All functions are stubbed to no-ops and the hook returns a disconnected state.
 * Re-enable by restoring the original implementation and setting the correct chain config.
 */

interface WalletState {
  address: string | null;
  balance: string | null;
  chainId: number | null;
  isConnecting: boolean;
  isConnected: boolean;
  error: string | null;
}

export function useWallet() {
  const disabledState: WalletState = {
    address: null,
    balance: null,
    chainId: null,
    isConnecting: false,
    isConnected: false,
    error: 'Wallet integration is currently disabled',
  };

  return {
    ...disabledState,
    isMetaMaskInstalled: false,
    connect: async () => {
      console.warn('Wallet integration is currently disabled');
      return null;
    },
    disconnect: () => {},
    switchToBscTestnet: async () => false,
    signMessage: async (_message: string) => {
      throw new Error('Wallet integration is currently disabled');
    },
    mockPayment: async (_amount: number, _description: string): Promise<{ txHash: string }> => {
      throw new Error('Wallet integration is currently disabled');
    },
    BSC_TESTNET_CHAIN_ID: 97,
  };
}

// Window type extension
declare global {
  interface Window {
    ethereum?: any;
  }
}
