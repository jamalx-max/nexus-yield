import { useState } from 'react'
import { Navbar } from './components/layout'
import { Dashboard } from './components/Dashboard'
import { LandingPage } from './components/LandingPage'
import { WhyPage } from './components/WhyPage'

function App() {
  const [view, setView] = useState<'landing' | 'dashboard' | 'why'>('landing')

  if (view === 'landing') {
    return (
      <LandingPage 
        onLaunch={() => setView('dashboard')} 
        onWhy={() => setView('why')}
      />
    )
  }

  if (view === 'why') {
    return (
      <WhyPage 
        onDeploy={() => setView('dashboard')}
        onBack={() => setView('landing')}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Grid */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:40px_40px] opacity-50" />
      </div>

      <div className="relative z-10">
        <Navbar onBrandClick={() => setView('landing')} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Dashboard />
        </main>
      </div>
    </div>
  )
}

export default App
