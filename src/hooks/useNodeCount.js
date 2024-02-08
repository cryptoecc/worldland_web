// src/hooks/useNodeCount.js
import { useQuery } from '@apollo/client';
import { getNodeCount } from '../graphql/queries';

export const useNodeCount = () => {
  const { data, loading, error } = useQuery(getNodeCount);
  console.log(data);
  return {
    nodeCounts: data?.dailyNodes,
    loading,
    error,
  };
};
