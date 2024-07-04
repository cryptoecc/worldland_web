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
  receiver_address: string;
  amount: string;
  contract_type: string;
  initial_timestamp: string;
  lock_period: string;
  vest_period: string;
}
