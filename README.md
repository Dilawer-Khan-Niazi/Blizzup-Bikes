#  Blizzup Bikes — Bike Expert AI Agent

A full-stack web application that displays bikes and features an AI-powered agent that compares bikes, scores them out of 100, and recommends the best one.

##  Live Demo
- Frontend: (Vercel URL — add after deployment)
- Backend: (Render URL — add after deployment)

##  Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React.js + Vite + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas + Mongoose |
| AI Agent | Groq API (Llama 3.3 70B) |
| Deployment | Vercel (frontend) + Render (backend) |

##  Features
- Bikes displayed in responsive card grid
- Full bike detail page with image gallery
- AI Agent with multi-turn conversation
- Quick Compare buttons (select bikes with one click)
- Budget filter to show affordable bikes only
- Scoring system out of 100 with animated progress bars
- Chat history saved across browser sessions
- Winner recommendation with detailed justification

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Groq API key (free at console.groq.com)

### Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `/backend` folder:

PORT=5000
MONGODB_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key

Seed the database:
```bash
node seed.js
```

Start the backend:
```bash
npm run start
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

##  AI Agent Scoring Criteria
| Criteria | Points | Logic |
|----------|--------|-------|
| Price | 20 | Lower price = higher score |
| Fuel Average | 20 | Higher km/l = higher score |
| Engine CC | 20 | Higher CC = higher score |
| Value for Money | 20 | Best specs-to-price ratio |
| Features & Colors | 20 | More options = higher score |

## Project Structure
blizzup-bikes/
├── backend/
│   ├── models/Bike.js
│   ├── routes/bikes.js
│   ├── routes/chat.js
│   ├── seed.js
│   └── server.js
└── frontend/
└── src/
├── components/
│   ├── Navbar.jsx
│   └── BikeCard.jsx
└── pages/
├── Home.jsx
├── BikeDetail.jsx
└── Chat.jsx

## Author
Dilawer Khan 