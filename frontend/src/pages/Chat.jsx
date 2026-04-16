import { useState, useRef, useEffect } from 'react'
import axios from 'axios'

const AVAILABLE_BIKES = [
  'Honda CB150F',
  'Yamaha YBR 125G',
  'Suzuki GS150',
  'Honda CG125',
  'Road Prince RP150CC',
]

const STORAGE_KEY = 'bikeexpert_chat_history'

function ScoreBar({ label, score, max = 20 }) {
  const percentage = (score / max) * 100
  const color = percentage >= 75 ? 'bg-green-500' : percentage >= 50 ? 'bg-orange-400' : 'bg-red-400'
  return (
    <div className="mb-2">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-bold text-gray-800">{score}/{max}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`${color} h-2 rounded-full transition-all duration-1000`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

function Chat() {
  const defaultMessages = [
    {
      role: 'assistant',
      content: '👋 Welcome to BikeExpert AI! I can help you compare bikes and find the best one for you.\n\nHow many bikes would you like to compare? (2–5)\n\nOr you can use the quick buttons below to select bikes directly!',
    },
  ]

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : defaultMessages
    } catch {
      return defaultMessages
    }
  })

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [comparison, setComparison] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_comparison')
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  })
  const [winner, setWinner] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_winner')
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  })
  const [selectedBikes, setSelectedBikes] = useState([])
  const [budgetFilter, setBudgetFilter] = useState('')
  const [showBudgetInput, setShowBudgetInput] = useState(false)
  const bottomRef = useRef(null)

  // Save chat history to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    if (comparison) localStorage.setItem(STORAGE_KEY + '_comparison', JSON.stringify(comparison))
  }, [comparison])

  useEffect(() => {
    if (winner) localStorage.setItem(STORAGE_KEY + '_winner', JSON.stringify(winner))
  }, [winner])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, comparison])

  const filteredBikes = budgetFilter
    ? AVAILABLE_BIKES.filter((_, i) => {
        const prices = [339000, 299000, 319000, 219000, 265000]
        return prices[i] <= parseInt(budgetFilter)
      })
    : AVAILABLE_BIKES

  const toggleBikeSelection = (bikeName) => {
    setSelectedBikes(prev =>
      prev.includes(bikeName)
        ? prev.filter(b => b !== bikeName)
        : prev.length < 5 ? [...prev, bikeName] : prev
    )
  }

  const sendQuickCompare = async () => {
    if (selectedBikes.length < 2) return
    const userMsg = `I want to compare these bikes: ${selectedBikes.join(', ')}`
    await sendMessage(userMsg)
    setSelectedBikes([])
  }

  const sendMessage = async (overrideText = null) => {
    const text = overrideText || input
    if (!text.trim() || loading) return

    const userMessage = { role: 'user', content: text }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/chat`, {
  messages: newMessages,
})

      const { reply, type, comparison: compData, winner: winnerData } = res.data
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])

      if (type === 'comparison' && compData) {
        setComparison(compData)
        setWinner(winnerData)
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Something went wrong. Please try again.',
      }])
    }

    setLoading(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearHistory = () => {
    setMessages(defaultMessages)
    setComparison(null)
    setWinner(null)
    setSelectedBikes([])
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(STORAGE_KEY + '_comparison')
    localStorage.removeItem(STORAGE_KEY + '_winner')
  }

  const formatPrice = (price) => 'PKR ' + price.toLocaleString('en-PK')

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900">
          🤖 Bike<span className="text-orange-500">Expert</span> AI Agent
        </h1>
        <p className="text-gray-500 mt-2">Compare bikes, get scores, and find your perfect ride</p>
      </div>

      {/* Budget Filter */}
      <div className="bg-white rounded-2xl shadow p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-800">💰 Budget Filter</h3>
          <button
            onClick={() => setShowBudgetInput(!showBudgetInput)}
            className="text-sm text-orange-500 hover:text-orange-600 font-medium"
          >
            {showBudgetInput ? 'Hide' : 'Set Budget'}
          </button>
        </div>
        {showBudgetInput && (
          <div className="flex gap-3">
            <input
              type="number"
              value={budgetFilter}
              onChange={e => setBudgetFilter(e.target.value)}
              placeholder="Enter max budget in PKR (e.g. 300000)"
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-orange-400"
            />
            <button
              onClick={() => setBudgetFilter('')}
              className="text-sm text-gray-500 hover:text-gray-700 px-3"
            >
              Clear
            </button>
          </div>
        )}
        {budgetFilter && (
          <p className="text-xs text-green-600 mt-2">
            ✓ Showing bikes under PKR {parseInt(budgetFilter).toLocaleString('en-PK')}
          </p>
        )}
      </div>

      {/* Quick Compare Buttons */}
      <div className="bg-white rounded-2xl shadow p-4 mb-4">
        <h3 className="font-bold text-gray-800 mb-3">⚡ Quick Compare</h3>
        <p className="text-xs text-gray-500 mb-3">Select 2–5 bikes and click Compare</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {filteredBikes.map(bike => (
            <button
              key={bike}
              onClick={() => toggleBikeSelection(bike)}
              className={`px-3 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                selectedBikes.includes(bike)
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300'
              }`}
            >
              {selectedBikes.includes(bike) ? '✓ ' : ''}{bike}
            </button>
          ))}
          {filteredBikes.length === 0 && (
            <p className="text-sm text-red-500">No bikes found within this budget.</p>
          )}
        </div>
        {selectedBikes.length >= 2 && (
          <button
            onClick={sendQuickCompare}
            className="w-full bg-orange-500 text-white py-2.5 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
          >
            Compare {selectedBikes.length} Bikes →
          </button>
        )}
        {selectedBikes.length === 1 && (
          <p className="text-xs text-gray-400 text-center">Select at least 1 more bike</p>
        )}
      </div>

      {/* Chat Window */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
          <span className="text-sm font-semibold text-gray-700">💬 Chat</span>
          <button
            onClick={clearHistory}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            🗑️ Clear History
          </button>
        </div>

        <div className="h-96 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-orange-500 text-white rounded-br-sm'
                  : 'bg-gray-100 text-gray-800 rounded-bl-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-gray-100 p-4 flex gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
            disabled={loading}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </div>

      {/* Comparison Table */}
      {comparison && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📊 Comparison Results</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl shadow-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-900 text-white">
                  <th className="px-6 py-4 text-left text-sm font-semibold">Criteria</th>
                  {comparison.map((b, i) => (
                    <th key={i} className="px-6 py-4 text-center text-sm font-semibold">
                      {b.name}
                      {winner && b.name === winner.name && (
                        <span className="ml-2 text-orange-400">👑</span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="px-6 py-3 text-sm text-gray-500 font-medium">Price</td>
                  {comparison.map((b, i) => (
                    <td key={i} className="px-6 py-3 text-center text-sm font-semibold">{formatPrice(b.price)}</td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="px-6 py-3 text-sm text-gray-500 font-medium">Engine CC</td>
                  {comparison.map((b, i) => (
                    <td key={i} className="px-6 py-3 text-center text-sm">{b.engineCC} CC</td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-6 py-3 text-sm text-gray-500 font-medium">Fuel Avg (City)</td>
                  {comparison.map((b, i) => (
                    <td key={i} className="px-6 py-3 text-center text-sm">{b.fuelAverage.city} km/l</td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="px-6 py-3 text-sm text-gray-500 font-medium">Fuel Avg (Highway)</td>
                  {comparison.map((b, i) => (
                    <td key={i} className="px-6 py-3 text-center text-sm">{b.fuelAverage.highway} km/l</td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-6 py-3 text-sm text-gray-500 font-medium">Color Options</td>
                  {comparison.map((b, i) => (
                    <td key={i} className="px-6 py-3 text-center text-sm">{b.colorOptions.length} options</td>
                  ))}
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="px-6 py-3 text-sm text-gray-500 font-medium">Features</td>
                  {comparison.map((b, i) => (
                    <td key={i} className="px-6 py-3 text-center text-sm">{b.features.length} features</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Score Progress Bars */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {comparison.map((b, i) => (
              <div key={i} className={`bg-white rounded-2xl shadow p-5 border-2 ${
                winner && b.name === winner.name ? 'border-orange-400' : 'border-transparent'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 text-sm">{b.name}</h3>
                  {winner && b.name === winner.name && (
                    <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-semibold">👑 Best</span>
                  )}
                </div>
                <ScoreBar label="Price" score={b.scores.price} />
                <ScoreBar label="Fuel Average" score={b.scores.fuelAverage} />
                <ScoreBar label="Engine CC" score={b.scores.engineCC} />
                <ScoreBar label="Value for Money" score={b.scores.valueForMoney} />
                <ScoreBar label="Features & Colors" score={b.scores.featuresAndColors} />
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-700">Total Score</span>
                    <span className={`text-2xl font-extrabold ${
                      winner && b.name === winner.name ? 'text-orange-500' : 'text-gray-800'
                    }`}>
                      {b.scores.total}<span className="text-sm text-gray-400">/100</span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                    <div
                      className={`h-3 rounded-full transition-all duration-1000 ${
                        winner && b.name === winner.name ? 'bg-orange-500' : 'bg-gray-500'
                      }`}
                      style={{ width: `${b.scores.total}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Winner Card */}
          {winner && (
            <div className="mt-6 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🏆</span>
                <div>
                  <p className="text-orange-100 text-sm font-medium">Best Bike Recommendation</p>
                  <h3 className="text-2xl font-extrabold">{winner.name}</h3>
                </div>
                <span className="ml-auto text-4xl font-extrabold">
                  {winner.totalScore}<span className="text-lg">/100</span>
                </span>
              </div>
              <p className="text-orange-100 text-sm leading-relaxed">
                {winner.name} scored the highest overall with {winner.totalScore} out of 100 points.
                It leads in: {
                  Object.entries(winner.scores)
                    .filter(([key]) => key !== 'total')
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 2)
                    .map(([key]) => key.replace(/([A-Z])/g, ' $1').toLowerCase())
                    .join(' and ')
                }.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Chat