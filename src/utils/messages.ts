export const MESSAGES = {
  // messages
  FINALIZED: 'Admin interaction has been finalized!',
  TX_SENT: 'Transaction has been sent!',
  TX_SUCCESS: 'Transaction has been executed!',
  TX_CONTENT: 'Transactions are stored and batch executed each 15 seconds!',
  CHAIN_CHANGE: (name: string) => `Metamask network changed to ${name}!`,
  DEPOSIT_SUCCESS: 'Bulk deposit successfully completed!',
  TRANSFER_SUCCESS: 'Deposit is complete!',

  // error messages
  TX_FAIL: 'Transaction failed!',
  SUBMISSION_ERROR: 'Submission error!',
  NO_RECEIVER: 'Input at least one receiver!',
  EMPTY_FIELD: 'Fields should not be empty!',
  LOW_CONTRACT_BALANCE: 'Insufficient contract balance! Try again after depositing WL to the contract!',
  NO_TIMESTAMP: 'Timestamps not set!',
};
