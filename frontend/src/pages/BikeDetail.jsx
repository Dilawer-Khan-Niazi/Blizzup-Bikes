import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

function BikeDetail() {
  const { id } = useParams()
  const [bike, setBike] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/bikes/${id}`)
      .then(res => {
        setBike(res.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-gray-500 animate-pulse">Loading bike details...</p>
    </div>
  )

  if (!bike) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-red-500">Bike not found.</p>
    </div>
  )

  const formatPrice = (price) => 'PKR ' + price.toLocaleString('en-PK')

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">

      {/* Back button */}
      <Link to="/" className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 mb-6 font-medium">
        ← Back to all bikes
      </Link>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

          {/* Image Gallery */}
          <div className="bg-gray-50 p-6">
            <div className="rounded-xl overflow-hidden h-64 mb-4 bg-gray-100">
              <img
                src={bike.images[activeImage]}
                alt={bike.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/600x400?text=Bike+Image'
                }}
              />
            </div>
            <div className="flex gap-3">
              {bike.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImage === index ? 'border-orange-500' : 'border-transparent'
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/100x100?text=Bike'
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="p-8">
            <h1 className="text-3xl font-extrabold text-gray-900">{bike.name}</h1>
            <p className="text-gray-500 mt-1">{bike.model}</p>

            <div className="mt-4">
              <span className="text-3xl font-bold text-orange-500">
                {formatPrice(bike.price)}
              </span>
            </div>

            {/* Specs */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500 text-sm">Engine</span>
                <span className="font-semibold text-gray-800">{bike.engineCC} CC</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500 text-sm">Fuel Average (City)</span>
                <span className="font-semibold text-gray-800">{bike.fuelAverage.city} km/l</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500 text-sm">Fuel Average (Highway)</span>
                <span className="font-semibold text-gray-800">{bike.fuelAverage.highway} km/l</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500 text-sm">Color Options</span>
                <span className="font-semibold text-gray-800 text-right text-sm">
                  {bike.colorOptions.join(', ')}
                </span>
              </div>
            </div>

            {/* Features */}
            <div className="mt-6">
              <h3 className="font-bold text-gray-800 mb-3">Features</h3>
              <div className="flex flex-wrap gap-2">
                {bike.features.map((feature, index) => (
                  <span
                    key={index}
                    className="bg-orange-50 text-orange-700 text-xs px-3 py-1.5 rounded-full border border-orange-200"
                  >
                    ✓ {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BikeDetail