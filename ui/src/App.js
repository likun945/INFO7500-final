import React from 'react';
import './App.css';
import { WagmiConfig, createConfig, configureChains, mainnet, sepolia } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public'
import Home from './pages/home'
import Network from './pages/network';
import Profile from './pages/Profile';
import Mint from './pages/mint';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [alchemyProvider({ apiKey: 'Ar08CeP55EpgbRw1Osj_41IpKQr-PO_J' }), publicProvider()],
)

// Set up wagmi config
const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains })
  ],
  publicClient,
  webSocketPublicClient
})

function App() {
  return (
    <WagmiConfig config={config}>
      <div className="App">
        <Profile></Profile>
        <Home></Home>
        <Network />
      </div>
    </WagmiConfig>
  );
}

export default App;
