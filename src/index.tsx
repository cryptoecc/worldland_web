import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from 'styled-components';
import { theme } from 'style/theme';
import GlobalStyle from 'style/GlobalStyle';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { arbitrum, mainnet, } from 'wagmi/chains';
import { worldland, worldland_testnet, chainImages } from 'utils/wagmi';

const chains = [worldland, worldland_testnet, arbitrum, mainnet,];
const projectId = '90f6c51de51a4046732827e944ba4958';

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
    <HelmetProvider>
      <WagmiConfig config={wagmiConfig}>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <App />
        </ThemeProvider>
      </WagmiConfig>
      <Web3Modal
        projectId={projectId}
        ethereumClient={ethereumClient}
        // chainImages={chainImages}
        defaultChain={worldland}
      />
    </HelmetProvider>
  </>,
);
