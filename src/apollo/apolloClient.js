import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({ uri: process.env.REACT_APP_API_ENDPOINT }),
  cache: new InMemoryCache(),
});

export default client;
