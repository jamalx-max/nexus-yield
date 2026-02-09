import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Navbar } from './components/layout/Navbar'
import { Dashboard } from './components/Dashboard'
import { LandingPage } from './components/LandingPage'
import { WhyPage } from './components/WhyPage'

function App() {
  return (
    <ErrorBoundary>
      <WalletProvider>
        <StacksWalletProvider>
          <ToastProvider>
            <Router>
              <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <Navbar />
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/why" element={<WhyPage />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
              </div>
            </Router>
          </ToastProvider>
        </StacksWalletProvider>
      </WalletProvider>
    </ErrorBoundary>
  );
}

export default App
