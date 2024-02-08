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
      codeword_difficulty
    }
  }
`;

export { getNodeCount, getCodeWord };
