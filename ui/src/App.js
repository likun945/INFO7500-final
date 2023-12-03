import React from 'react';
import { Route, Link, BrowserRouter, Routes } from 'react-router-dom'
import { WagmiConfig, createConfig, configureChains, mainnet, sepolia } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import Home from './pages/home';
import Mint from './pages/mint';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [sepolia],
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
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/mint-nft" element={<Mint />}></Route>
            <Route path="/mint-erc20" element={<Mint />}></Route>
            <Route path="/auction" element={<Mint />}></Route>
          </Routes>
        </BrowserRouter>
      </div>
    </WagmiConfig>
  );
}

export default App;
