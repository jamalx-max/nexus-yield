import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Navbar } from './components/layout/Navbar'
import { Dashboard } from './components/Dashboard'
import { LandingPage } from './components/LandingPage'
import { WhyPage } from './components/WhyPage'

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Toaster />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/why" element={<WhyPage />} />
        <Route path="/dashboard" element={
          <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Background Grid */}
            <div className="fixed inset-0 pointer-events-none z-0">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:40px_40px] opacity-50" />
            </div>

            <div className="relative z-10">
              <Navbar />
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Dashboard />
              </main>
            </div>
          </div>
        } />
        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </ErrorBoundary>
  )
}

export default App
