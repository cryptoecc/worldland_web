import { useQuery } from '@apollo/client';
import { getWalletCount } from '../graphql/queries';

export const useWalletCount = () => {
  const { data, loading, error } = useQuery(getWalletCount);
  return {
    walletCounts: data?.latestDailyWallet,
    loading,
    error,
  };
};
