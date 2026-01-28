import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const clientold = new ApolloClient({
  link: new HttpLink({ uri: process.env.REACT_APP_API_ENDPOINT_OLD }),
  cache: new InMemoryCache(),
});

export default clientold;
