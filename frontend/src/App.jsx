import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import BikeDetail from './pages/BikeDetail'
import Chat from './pages/Chat'
import Navbar from './components/Navbar'

function App() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bikes/:id" element={<BikeDetail />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </div>
  )
}

export default App