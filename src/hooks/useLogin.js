import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from 'graphql/mutation';

export const useLogin = () => {
  const [loginMutation, { data, loading, error }] = useMutation(LOGIN_MUTATION);

  const login = async (username, password) => {
    return await loginMutation({
      variables: {
        username,
        password,
      },
    });
  };

  return { login, data, loading, error };
};
