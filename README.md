# Fantasy Football Companion App

A comprehensive fantasy football companion platform that enhances private leagues with betting-style odds, strategic analytics, and social competition features.

## 🎯 Overview

The Fantasy Football Companion App connects to existing fantasy platforms (ESPN, Yahoo, Sleeper) to generate custom odds, FAAB predictions, and trade analysis - all without handling real money. It's designed for fantasy football enthusiasts who want deeper engagement, strategic insights, and fun social competition within their existing leagues.

## ✨ Key Features

- **🏆 Live Matchup Odds Board**: Real-time betting-style odds with win probabilities, spreads, and totals
- **💰 FAAB/Waiver Bid Predictor**: Strategic waiver wire bidding with league-specific intelligence  
- **📊 Trade Tree & Value Flow Tracker**: Historical trade analysis and value tracking
- **🪙 Token-Based Betting System**: 1000 tokens per week for friendly competition
- **📱 Mobile-First Design**: Responsive UI optimized for phone usage
- **⚡ Real-Time Updates**: Live odds and score updates every 30 seconds

## 🛠️ Tech Stack

### Backend
- **FastAPI**: Python web framework
- **Supabase**: PostgreSQL database with real-time subscriptions
- **ESPN API**: Fantasy football data integration

### Frontend  
- **React.js**: Frontend framework with TypeScript
- **Tailwind CSS**: Utility-first CSS framework
- **React Query**: Data fetching and caching

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- Supabase account

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your Supabase credentials
python setup_database.py
uvicorn app.main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials
npm start
```

## 📚 Documentation

Comprehensive documentation is available in the `/docs` folder:

- **[Project Overview](docs/0-Overview/README.md)**: Project introduction and navigation
- **[Product Roadmap](docs/1-Product/roadmap.md)**: Development phases and milestones
- **[Technical Architecture](docs/2-Design/system-architecture.md)**: System design and components
- **[Implementation Plan](docs/3-Development/implementation-plan.md)**: Step-by-step development guide
- **[Quick Start Guide](docs/3-Development/quick-start-guide.md)**: Immediate next steps

## 🎮 Usage

1. **Connect Your League**: Link your ESPN fantasy league
2. **View Odds Board**: See comprehensive matchup odds and probabilities
3. **Place Token Bets**: Use your weekly 1000 tokens for friendly competition
4. **Track FAAB Strategy**: Get intelligent waiver wire recommendations
5. **Analyze Trades**: Explore historical trade data and value flow

## 🏗️ Development Status

**Current Phase**: Phase 1 - Core Infrastructure (Weeks 1-4)
- ✅ Backend API setup with FastAPI
- ✅ Frontend React application with Tailwind CSS
- ✅ Token management system
- ✅ Database schema design
- 🔄 ESPN API integration (in progress)

**Next Steps**: 
- Live matchup odds board
- Betting interface
- FAAB predictor
- Trade tracker

## 📊 Project Structure

```
fantasy-dashboard/
├── backend/                 # FastAPI backend
│   ├── app/                # Application code
│   ├── requirements.txt    # Python dependencies
│   └── setup_database.py   # Database setup script
├── frontend/               # React frontend
│   ├── src/               # Source code
│   ├── public/            # Static assets
│   └── package.json       # Node dependencies
├── docs/                  # Comprehensive documentation
│   ├── 0-Overview/        # Project overview
│   ├── 1-Product/         # Product planning
│   ├── 2-Design/          # Technical design
│   ├── 3-Development/     # Development process
│   ├── 4-Debugging/       # Debugging guides
│   └── 5-Prompts/         # AI prompts
└── README.md              # This file
```

## 🤝 Contributing

This is a passion project for fantasy football enthusiasts. Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Follow the coding standards in the documentation
4. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🎯 Target Audience

- Fantasy football power users and commissioners
- Friend groups and dynasty leagues
- Users who want deeper engagement and strategic insights
- People who enjoy sports betting concepts without real money

## 🔮 Future Vision

- Cross-platform support (Yahoo, Sleeper)
- Advanced analytics and machine learning
- Mobile app (React Native or PWA)
- League expansion beyond initial test group
- Advanced social features and competitions

---

**Built with ❤️ for fantasy football enthusiasts**