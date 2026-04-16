import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow-lg">
      <Link to="/" className="text-2xl font-bold text-orange-400 tracking-wide">
        🏍️ BikeExpert
      </Link>
      <div className="flex gap-6 text-sm font-medium">
        <Link to="/" className="hover:text-orange-400 transition-colors">Home</Link>
        <Link to="/chat" className="bg-orange-400 text-gray-900 px-4 py-1.5 rounded-full hover:bg-orange-300 transition-colors font-semibold">
          AI Agent
        </Link>
      </div>
    </nav>
  )
}

export default Navbar