import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { WalletProvider, StacksWalletProvider } from './providers'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WalletProvider>
      <StacksWalletProvider>
        <App />
      </StacksWalletProvider>
    </WalletProvider>
  </StrictMode>,
)
