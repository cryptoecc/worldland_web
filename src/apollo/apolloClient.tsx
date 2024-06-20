import { ApolloClient, HttpLink, InMemoryCache, fromPromise, concat, ApolloLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import gql from 'graphql-tag';

import TokenService from '../utils/TokenService';
import { AppState } from 'store/store';
import { useSelector } from 'react-redux';

// import { graphql_server } from './login/Util';

const httpLink = () => {
  let link: HttpLink;

  link = new HttpLink({
    uri: 'https://be.worldland.foundation/api/graphql',
    credentials: 'include',
  });

  return link;
};

// const httpLink2 = () => {
//   let link: HttpLink;

//   link = new HttpLink({
//     uri: 'https://be.worldland.foundation/graphql',
//     credentials: 'include',
//   });

//   return link;
// };

const endpoint1 = new HttpLink({
  uri: 'https://be.worldland.foundation/api/graphql',
  credentials: 'include',
});

const endpoint2 = new HttpLink({
  uri: 'https://be.worldland.foundation/graphql',
  credentials: 'include',
});

const authLink = setContext((_, { headers }) => {
  // const user = useSelector((state: AppState) => state.userReducer);
  // console.log('555', user);
  const token = TokenService.get();
  console.log(token);
  let header;

  if (token) {
    header = {
      ...headers,
      authorization: `Bearer ${token}`,
    };
  } else {
    header = {
      ...headers,
    };
  }

  return {
    headers: header,
  };
});

const authMiddleware = new ApolloLink((operation, forward) => {
  const token = TokenService.get();
  console.log('authMiddleware setContext token:', token);
  // add the authorization to the headers
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      //authorization: localStorage.getItem('token') || null,
      authorization: token ? `Bearer ${token}` : '',
    },
  }));

  return forward(operation);
});

const TOKEN_EXPIRED = 'jwt expired';
const NOT_AUTH = 'Not Authorised!';

const RefreshLvAccessToken = gql`
  mutation RefreshLvAccessToken($value: String!) {
    refreshLvAccessToken(value: $value) {
      token
    }
  }
`;

const linkOnError = onError(({ graphQLErrors, operation, forward }) => {
  const oldToken = TokenService.get(); // 이전 토큰 값
  console.log('linkOnError에서 읽은 이전 토큰 :', oldToken);
  if (apolloClient && graphQLErrors?.[0].message.includes(TOKEN_EXPIRED)) {
    console.log('액세스토큰 리프레시 시작');
    TokenService.remove();

    console.log('[graphql error] 엑세스 토큰 리프레시 실패 :', graphQLErrors);
    const refresh = fromPromise(
      apolloClient
        .mutate({
          mutation: RefreshLvAccessToken,
          variables: {
            value: oldToken == undefined ? '' : oldToken, //이전 토큰
          },
        })
        .then(({ data }) => {
          console.log('RefreshLvAccessToke 뮤테이션 결과 :', data);
          TokenService.set(data.refreshLvAccessToken.token);
          localStorage.setItem('worldland_ref_id', 'true'); //refresh token 존재 여부
          return true; //access token 신규 발행 완료, 다음 단계로 진행
        })
        .catch((error) => {
          console.log('여기?');
          console.log('RefreshLvAccessToke 뮤테이션 error:', error.message);
          //throw error;
          return true; //access token 신규 발행 실패, 위에서 초기화 했으므로 다음 단계로 진행해서 다음 단계에서 이후 처리
        }),
    );
    return refresh.filter((result) => result).flatMap(() => forward(operation));
    // filter : fromPromise의 Observerble 객체에서 유효한 객체를 필터링
    // flatMap : fromPromise의 Observerble 객체를 하나씩 꺼내서 순차로 실행 ([a, b, c ] ==> [a], [b], [c] => [a].do() after [b].do() after [c].do() )
  } else {
    console.log('graphQLErrors uncatch error:', graphQLErrors);
    const refToken = localStorage.getItem('worldland_ref_id') === 'true' ? true : false;
    console.log('graphQLErrors uncatch error refToken:', refToken);
    console.log('bye');
    if (graphQLErrors?.[0].message.includes(NOT_AUTH) && refToken !== true) {
      console.log('hello');
      // Not Authorized! 이면서 refresh token 이 없을때 로그인으로 이동
      if (typeof window !== 'undefined') {
        //window.location.href = `${web_server}/authentication/login`;
        //window.location.href = `/auth/auth2/login`;
      }
    } else {
      //} else if (graphQLErrors?.[0].message.includes(NOT_AUTH) && refToken === true) {
    }
    //throw graphQLErrors;
  }
});

const apolloClient = new ApolloClient({
  // link: concat(linkOnError, concat(authLink, httpLink())),
  link: concat(
    linkOnError,
    concat(
      authLink,
      ApolloLink.split(
        (operation) => operation.getContext().clientName === 'endpoint2',
        endpoint2, //if above
        endpoint1,
      ),
    ),
  ),
  //link: concat(authLink, httpLink()),
  //link: httpLink(),
  cache: new InMemoryCache(),
  ssrMode: false,
});

export default apolloClient;

// import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

// const client = new ApolloClient({
//   link: new HttpLink({ uri: process.env.REACT_APP_API_ENDPOINT }),
//   cache: new InMemoryCache(),
// });

// export default client;
