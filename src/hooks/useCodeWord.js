import { useQuery } from '@apollo/client';
import { getCodeWord } from 'graphql/queries';

export const useCodeWord = () => {
  const { data, loading, error } = useQuery(getCodeWord, {
    context: { clientName: 'endpoint2' },
  });
  return {
    codeWord: data?.codeWord,
    loading,
    error,
  };
};
