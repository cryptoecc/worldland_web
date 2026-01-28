# 📡 WorldLand API 연동 가이드

> **버전**: 1.0  
> **작성일**: 2026-01-27  
> **목적**: 새 프론트엔드에서 백엔드 API를 연동하기 위한 가이드

---

## 📋 목차

1. [API 개요](#1-api-개요)
2. [GraphQL API](#2-graphql-api)
3. [REST API](#3-rest-api)
4. [프론트엔드 구현 가이드](#4-프론트엔드-구현-가이드)
5. [타입 정의](#5-타입-정의)

---

## 1. API 개요

### 1.1 엔드포인트

| 환경 | GraphQL | REST |
|------|---------|------|
| **프로덕션** | `https://be.worldland.foundation/api/graphql` | `https://be.worldland.foundation` |
| **로컬 개발** | `http://localhost:4000/graphql` | `http://localhost:4000` |

### 1.2 인증

- **방식**: JWT Bearer Token
- **헤더**: `Authorization: Bearer {token}`
- **토큰 만료**: 1시간
- **저장 위치**: `localStorage` (key: `worldland_token`)

### 1.3 환경 변수

```env
# .env.local
VITE_API_BASE_URL=http://localhost:4000
VITE_GRAPHQL_ENDPOINT=/graphql
VITE_WLD_MAINNET_RPC=https://seoul.worldland.foundation
VITE_WLD_TESTNET_RPC=https://gwangju.worldland.foundation
```

---

## 2. GraphQL API

### 2.1 스키마 타입

```graphql
# Types
type DailyNode {
  id: ID!
  date: String!
  node_count: Int!
}

type DailyWallet {
  date: String!
  wallet_count: Int!
}

type User {
  id: ID!
  username: String!
}

type DaoList {
  id: ID!
  contract_type: String
  receiver_address: String!
  amount: String!
  initial_timestamp: Int
  lock_period: Int
  vest_period: Int
}

type CodeWord {
  id: ID!
  date: String!
  data: String!
}

type AuthPayload {
  token: String!
  user: User!
}

type TransactionResponse {
  success: Boolean!
  message: String!
  transactionId: String
}
```

### 2.2 Query

#### dailyNodes - 일별 노드 수 조회
```graphql
query GetDailyNodes {
  dailyNodes {
    id
    date
    node_count
  }
}
```

**응답 예시:**
```json
{
  "data": {
    "dailyNodes": [
      { "id": "1", "date": "01/27", "node_count": 152 },
      { "id": "2", "date": "01/26", "node_count": 148 }
    ]
  }
}
```

**용도:** 메인 대시보드 노드 통계 차트

---

#### latestDailyWallet - 최신 지갑 수 조회
```graphql
query GetLatestDailyWallet {
  latestDailyWallet {
    date
    wallet_count
  }
}
```

**응답 예시:**
```json
{
  "data": {
    "latestDailyWallet": {
      "date": "2026-01-27T00:00:00.000Z",
      "wallet_count": 3500
    }
  }
}
```

**용도:** 메인 대시보드 지갑 수 표시

---

#### codeWord - 코드워드 난이도 조회
```graphql
query GetCodeWord {
  codeWord {
    id
    date
    data
  }
}
```

**응답 예시:**
```json
{
  "data": {
    "codeWord": [
      { "id": "1", "date": "01/27", "data": "0.12345" }
    ]
  }
}
```

**용도:** ECCPoW 난이도 차트

---

#### daoInfo - DAO 목록 조회
```graphql
query GetDaoInfo {
  daoInfo {
    id
    contract_type
    receiver_address
    amount
    initial_timestamp
    lock_period
    vest_period
  }
}
```

**용도:** Admin 페이지 DAO 관리

---

### 2.3 Mutation

#### login - 관리자 로그인
```graphql
mutation Login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    token
    user {
      id
      username
    }
  }
}
```

**변수:**
```json
{
  "username": "admin",
  "password": "password123"
}
```

**응답 예시:**
```json
{
  "data": {
    "login": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "1",
        "username": "admin"
      }
    }
  }
}
```

**주의:** 비밀번호는 SHA256 해시로 비교됨

---

#### addDaoList - DAO 목록 추가
```graphql
mutation AddDaoList($receivers: [String]!, $amounts: [String]!) {
  addDaoList(receivers: $receivers, amounts: $amounts)
}
```

**헤더 필요:** `Authorization: Bearer {token}`

**변수:**
```json
{
  "receivers": ["0x1234...", "0x5678..."],
  "amounts": ["1000", "2000"]
}
```

**응답:**
```json
{
  "data": {
    "addDaoList": "Data added successfully"
  }
}
```

---

#### sendETH - ETH 전송 (Faucet)
```graphql
mutation SendETH($toAddress: String!, $amount: String!) {
  sendETH(toAddress: $toAddress, amount: $amount) {
    success
    message
    transactionId
  }
}
```

**변수:**
```json
{
  "toAddress": "0x1234567890abcdef...",
  "amount": "0.1"
}
```

**응답 예시:**
```json
{
  "data": {
    "sendETH": {
      "success": true,
      "message": "Transaction sent successfully",
      "transactionId": "0xabcdef..."
    }
  }
}
```

---

## 3. REST API

### 3.1 Contact

#### POST /contact/send-email
**설명:** 문의 이메일 전송

**요청:**
```typescript
interface ContactRequest {
  name: string;
  company: string;
  email: string;
  phone: string;
  comment: string;
}
```

```bash
curl -X POST https://be.worldland.foundation/contact/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "company": "ACME Inc",
    "email": "john@example.com",
    "phone": "+82-10-1234-5678",
    "comment": "I have a question about..."
  }'
```

**응답:**
```json
{
  "message": "이메일이 성공적으로 전송되었습니다."
}
```

---

### 3.2 Node

#### GET /node/count
**설명:** 일별 노드 수 조회

```bash
curl https://be.worldland.foundation/node/count
```

**응답:**
```json
[
  { "id": 1, "date": "01/27", "node_count": 152 },
  { "id": 2, "date": "01/26", "node_count": 148 }
]
```

---

#### GET /node/totalsupply
**설명:** WLC 총 공급량 조회

```bash
curl https://be.worldland.foundation/node/totalsupply
```

**응답:**
```json
{
  "totalsupply": "40996800.0"
}
```

---

#### GET /node/exchangeSupply
**설명:** 거래소 유통량 조회

```bash
curl https://be.worldland.foundation/node/exchangeSupply
```

**응답:**
```json
{
  "exchangeSupply": "12345678.90"
}
```

---

### 3.3 Admin

#### POST /admin/login
**설명:** 관리자 로그인

**요청:**
```json
{
  "username": "admin",
  "password": "password123"
}
```

**응답:**
```json
{
  "message": "로그인 성공",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

#### GET /admin/admin-info
**설명:** 관리자 정보 조회 (인증 필요)

**헤더:** `Authorization: Bearer {token}`

**응답:**
```json
{
  "id": "admin"
}
```

---

#### POST /admin/dao-list
**설명:** DAO 목록 등록 (인증 필요)

**헤더:** `Authorization: Bearer {token}`

**요청:**
```json
{
  "types": ["vesting", "locked"],
  "_receivers": ["0x1234...", "0x5678..."],
  "_amounts": ["1000000000000000000", "2000000000000000000"],
  "initial_timestamps": [1706345600, 1706345600],
  "lock_timestamps": [31536000, 31536000],
  "vest_timestamps": [63072000, 63072000]
}
```

**응답:**
```json
{
  "message": "Data insertion complete"
}
```

---

#### GET /admin/dao-info
**설명:** DAO 목록 조회 (인증 필요)

**헤더:** `Authorization: Bearer {token}`

**응답:**
```json
{
  "data": [
    {
      "id": 1,
      "contract_type": "vesting",
      "receiver_address": "0x1234...",
      "amount": "1000",
      "initial_timestamp": 1706345600,
      "lock_period": 31536000,
      "vest_period": 63072000
    }
  ]
}
```

---

## 4. 프론트엔드 구현 가이드

### 4.1 API 클라이언트 설정

```typescript
// src/api/client.ts
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: `${import.meta.env.VITE_API_BASE_URL}/graphql`,
  credentials: 'include',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('worldland_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// REST API client
export const restClient = {
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  
  async get<T>(endpoint: string): Promise<T> {
    const token = localStorage.getItem('worldland_token');
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });
    if (!response.ok) throw new Error('API Error');
    return response.json();
  },
  
  async post<T>(endpoint: string, data: unknown): Promise<T> {
    const token = localStorage.getItem('worldland_token');
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('API Error');
    return response.json();
  },
};
```

### 4.2 GraphQL 쿼리 정의

```typescript
// src/api/graphql/queries.ts
import { gql } from '@apollo/client';

export const GET_DAILY_NODES = gql`
  query GetDailyNodes {
    dailyNodes {
      id
      date
      node_count
    }
  }
`;

export const GET_LATEST_WALLET = gql`
  query GetLatestDailyWallet {
    latestDailyWallet {
      date
      wallet_count
    }
  }
`;

export const GET_CODEWORD = gql`
  query GetCodeWord {
    codeWord {
      id
      date
      data
    }
  }
`;

export const GET_DAO_INFO = gql`
  query GetDaoInfo {
    daoInfo {
      id
      contract_type
      receiver_address
      amount
      initial_timestamp
      lock_period
      vest_period
    }
  }
`;
```

```typescript
// src/api/graphql/mutations.ts
import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        id
        username
      }
    }
  }
`;

export const ADD_DAO_LIST = gql`
  mutation AddDaoList($receivers: [String]!, $amounts: [String]!) {
    addDaoList(receivers: $receivers, amounts: $amounts)
  }
`;

export const SEND_ETH = gql`
  mutation SendETH($toAddress: String!, $amount: String!) {
    sendETH(toAddress: $toAddress, amount: $amount) {
      success
      message
      transactionId
    }
  }
`;
```

### 4.3 커스텀 훅

```typescript
// src/hooks/useNodeStats.ts
import { useQuery } from '@tanstack/react-query';
import { apolloClient } from '@/api/client';
import { GET_DAILY_NODES, GET_LATEST_WALLET } from '@/api/graphql/queries';

export function useNodeStats() {
  const nodesQuery = useQuery({
    queryKey: ['dailyNodes'],
    queryFn: async () => {
      const { data } = await apolloClient.query({
        query: GET_DAILY_NODES,
      });
      return data.dailyNodes;
    },
    staleTime: 1000 * 60 * 5, // 5분
  });

  const walletQuery = useQuery({
    queryKey: ['latestWallet'],
    queryFn: async () => {
      const { data } = await apolloClient.query({
        query: GET_LATEST_WALLET,
      });
      return data.latestDailyWallet;
    },
    staleTime: 1000 * 60 * 5,
  });

  return {
    nodes: nodesQuery.data,
    wallet: walletQuery.data,
    isLoading: nodesQuery.isLoading || walletQuery.isLoading,
    error: nodesQuery.error || walletQuery.error,
  };
}
```

```typescript
// src/hooks/useAuth.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apolloClient } from '@/api/client';
import { LOGIN } from '@/api/graphql/mutations';

interface AuthState {
  token: string | null;
  user: { id: string; username: string } | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      
      login: async (username: string, password: string) => {
        const { data } = await apolloClient.mutate({
          mutation: LOGIN,
          variables: { username, password },
        });
        
        const { token, user } = data.login;
        localStorage.setItem('worldland_token', token);
        
        set({
          token,
          user,
          isAuthenticated: true,
        });
      },
      
      logout: () => {
        localStorage.removeItem('worldland_token');
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
```

```typescript
// src/hooks/useTokenSupply.ts
import { useQuery } from '@tanstack/react-query';
import { restClient } from '@/api/client';

interface SupplyData {
  totalSupply: string;
  exchangeSupply: string;
}

export function useTokenSupply() {
  return useQuery<SupplyData>({
    queryKey: ['tokenSupply'],
    queryFn: async () => {
      const [totalRes, exchangeRes] = await Promise.all([
        restClient.get<{ totalsupply: string }>('/node/totalsupply'),
        restClient.get<{ exchangeSupply: string }>('/node/exchangeSupply'),
      ]);
      
      return {
        totalSupply: totalRes.totalsupply,
        exchangeSupply: exchangeRes.exchangeSupply,
      };
    },
    staleTime: 1000 * 60 * 10, // 10분
  });
}
```

### 4.4 컴포넌트 사용 예시

```tsx
// src/components/features/dashboard/NetworkStats.tsx
import { useNodeStats } from '@/hooks/useNodeStats';
import { useTokenSupply } from '@/hooks/useTokenSupply';
import { StatCard } from '@/components/ui/stat-card';
import { Skeleton } from '@/components/ui/skeleton';

export function NetworkStats() {
  const { nodes, wallet, isLoading: nodesLoading } = useNodeStats();
  const { data: supply, isLoading: supplyLoading } = useTokenSupply();

  if (nodesLoading || supplyLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  const latestNodeCount = nodes?.[0]?.node_count ?? 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        title="Active Nodes"
        value={latestNodeCount.toLocaleString()}
        icon="node"
      />
      <StatCard
        title="Total Wallets"
        value={wallet?.wallet_count?.toLocaleString() ?? '0'}
        icon="wallet"
      />
      <StatCard
        title="Total Supply"
        value={`${parseFloat(supply?.totalSupply ?? '0').toLocaleString()} WLC`}
        icon="coins"
      />
    </div>
  );
}
```

---

## 5. 타입 정의

```typescript
// src/types/api.ts

// GraphQL Types
export interface DailyNode {
  id: string;
  date: string;
  node_count: number;
}

export interface DailyWallet {
  date: string;
  wallet_count: number;
}

export interface User {
  id: string;
  username: string;
}

export interface DaoList {
  id: string;
  contract_type: string | null;
  receiver_address: string;
  amount: string;
  initial_timestamp: number | null;
  lock_period: number | null;
  vest_period: number | null;
}

export interface CodeWord {
  id: string;
  date: string;
  data: string;
}

export interface AuthPayload {
  token: string;
  user: User;
}

export interface TransactionResponse {
  success: boolean;
  message: string;
  transactionId: string | null;
}

// REST API Types
export interface ContactRequest {
  name: string;
  company: string;
  email: string;
  phone: string;
  comment: string;
}

export interface ContactResponse {
  message: string;
}

export interface TotalSupplyResponse {
  totalsupply: string;
}

export interface ExchangeSupplyResponse {
  exchangeSupply: string;
}

export interface AdminLoginRequest {
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  message: string;
  token: string;
}

export interface AdminInfoResponse {
  id: string;
}

export interface DaoListRequest {
  types: string[];
  _receivers: string[];
  _amounts: string[];
  initial_timestamps: number[];
  lock_timestamps: number[];
  vest_timestamps: number[];
}

export interface DaoInfoResponse {
  data: DaoList[];
}
```

---

## 📌 API 연동 체크리스트

### 메인 대시보드
- [ ] `dailyNodes` - 노드 수 차트
- [ ] `latestDailyWallet` - 지갑 수 표시
- [ ] `codeWord` - ECCPoW 난이도 차트
- [ ] `/node/totalsupply` - 총 공급량
- [ ] `/node/exchangeSupply` - 거래소 공급량

### 인증
- [ ] `login` mutation - 로그인
- [ ] 토큰 저장/관리
- [ ] 인증 상태 유지

### Admin
- [ ] `daoInfo` - DAO 목록 조회
- [ ] `addDaoList` - DAO 추가
- [ ] `/admin/login` - REST 로그인 (백업)
- [ ] `/admin/admin-info` - 관리자 정보

### Contact
- [ ] `/contact/send-email` - 문의 폼

### Faucet
- [ ] `sendETH` - 테스트 토큰 전송

---

*이 문서는 백엔드 API 변경 시 업데이트됩니다.*
