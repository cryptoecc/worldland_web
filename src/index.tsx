import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from 'styled-components';
import { theme } from 'style/theme';
import GlobalStyle from 'style/GlobalStyle';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { HelmetProvider } from 'react-helmet-async';
import { worldland, worldland_testnet } from 'utils/wagmi';
import { Provider } from 'react-redux';
import { store } from 'store/store';
import { ToastProvider } from 'react-toast-notifications';
import { projectId } from 'configs/services/wagmi-credentials';
import client from 'apollo/apolloClient';
import { ApolloProvider } from '@apollo/client';

const chains = [worldland, worldland_testnet, sepolia]; // will add mainnet in production

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});

const ethereumClient = new EthereumClient(wagmiConfig, chains);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <>
    <Provider store={store}>
      <HelmetProvider>
        <WagmiConfig config={wagmiConfig}>
          <ThemeProvider theme={theme}>
            <GlobalStyle />
            <ToastProvider>
              <ApolloProvider client={client}>
                <App />
              </ApolloProvider>
            </ToastProvider>
          </ThemeProvider>
        </WagmiConfig>
        <Web3Modal
          projectId={projectId}
          ethereumClient={ethereumClient}
          // chainImages={chainImages}
          defaultChain={worldland}
        />
      </HelmetProvider>
    </Provider>
  </>,
);
