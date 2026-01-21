import { Navbar } from './components/layout'
import { Dashboard } from './components/Dashboard'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Dashboard />
      </main>
    </div>
  )
}

export default App
