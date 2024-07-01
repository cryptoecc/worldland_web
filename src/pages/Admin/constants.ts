export const initialContractObj = {
  balance: '0',
  owner: '',
  isAllIncomingDepositsFinalised: false,
};

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
