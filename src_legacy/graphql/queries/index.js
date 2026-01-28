import { gql } from '@apollo/client';

const getNodeCount = gql`
  query {
    dailyNodes {
      id
      date
      node_count
    }
  }
`;

const getCodeWord = gql`
  query {
    codeWord {
      id
      date
      data
    }
  }
`;

const getWalletCount = gql`
  query {
    latestDailyWallet {
      date
      wallet_count
    }
  }
`;

export { getNodeCount, getCodeWord, getWalletCount };
