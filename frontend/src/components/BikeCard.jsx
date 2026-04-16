import { Link } from 'react-router-dom'

function BikeCard({ bike }) {
  const formatPrice = (price) => {
    return 'PKR ' + price.toLocaleString('en-PK')
  }

  return (
    <Link to={`/bikes/${bike._id}`} className="group block">
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:-translate-y-1">
        
        {/* Image */}
        <div className="h-48 bg-gray-100 overflow-hidden">
          <img
            src={bike.images[0]}
            alt={bike.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'https://placehold.co/400x200?text=Bike+Image'
            }}
          />
        </div>

        {/* Content */}
        <div className="p-5">
          <h2 className="text-lg font-bold text-gray-900 group-hover:text-orange-500 transition-colors">
            {bike.name}
          </h2>
          <p className="text-sm text-gray-500 mt-1">{bike.model}</p>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-orange-500 font-bold text-lg">
              {formatPrice(bike.price)}
            </span>
            <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
              {bike.engineCC}cc
            </span>
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
            <span>⛽ City: {bike.fuelAverage.city} km/l</span>
            <span>•</span>
            <span>Highway: {bike.fuelAverage.highway} km/l</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default BikeCard