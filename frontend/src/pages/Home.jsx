import { useEffect, useState } from 'react'
import axios from 'axios'
import BikeCard from '../components/BikeCard'

function Home() {
  const [bikes, setBikes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/bikes`)
      .then(res => {
        setBikes(res.data)
        setLoading(false)
      })
      .catch(err => {
        setError('Failed to load bikes')
        setLoading(false)
      })
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="text-4xl mb-3">🏍️</div>
        <p className="text-gray-500 animate-pulse">Loading bikes...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-red-500">{error}</p>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Find Your Perfect <span className="text-orange-500">Bike</span>
        </h1>
        <p className="text-gray-500 mt-3 text-lg">
          Browse our collection and let our AI agent help you decide
        </p>
      </div>

      {/* Bike Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {bikes.map(bike => (
          <BikeCard key={bike._id} bike={bike} />
        ))}
      </div>
    </div>
  )
}

export default Home