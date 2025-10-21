# ESPN Fantasy Football Personal Data Toolkit

A Python-based toolkit for accessing and analyzing your ESPN Fantasy Football league data.

## 🏈 What This Does

This toolkit connects to your ESPN Fantasy Football league and provides:
- **League Information**: Standings, team rosters, player stats
- **Matchup Analysis**: Weekly scores, projections, win probabilities  
- **Waiver Wire**: Free agent tracking and suggestions
- **Data Export**: JSON, CSV, and database storage options
- **Future Features**: Automated reports, Discord bots, web dashboards

## 🚀 Quick Start

### 1. Setup
```bash
# Clone or download this project
cd fantasy-dashboard

# Activate virtual environment
source venv/bin/activate

# Install dependencies (already done)
pip install -r requirements.txt
```

### 2. Authentication (Required for Private Leagues)
Your league (ID: 637913) is private, so you need authentication cookies:

```bash
# Run the cookie helper
python src/get_cookies.py

# Follow the instructions to get your ESPN cookies
# Then update the .env file with your actual values
```

### 3. Test Connection
```bash
# Test your setup
python src/main.py

# If successful, you'll see your league data!
```

## 📁 Project Structure

```
fantasy-dashboard/
├── docs/                  # Documentation
│   ├── 0-Overview/       # Project overview and goals
│   ├── 2-Tech-Specs/     # Technical documentation
│   └── ...
├── src/                   # Source code
│   ├── main.py           # Main application
│   ├── api/              # ESPN API wrapper
│   ├── analysis/         # Data analysis modules
│   └── utils/            # Helper functions
├── data/                  # Data storage
├── notebooks/            # Jupyter notebooks
└── requirements.txt      # Dependencies
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file with your ESPN cookies:
```bash
ESPN_S2=your_espn_s2_cookie_here
SWID={your_swid_cookie_here}
LEAGUE_ID=637913
SEASON_YEAR=2025
```

### League Information
- **League ID**: 637913
- **Season**: 2025
- **URL**: https://fantasy.espn.com/football/league/settings?leagueId=637913&seasonId=2025

## 📚 Documentation

- **[Project Overview](docs/0-Overview/README.md)** - Goals and roadmap
- **[Authentication Guide](docs/2-Tech-Specs/authentication-guide.md)** - How to get ESPN cookies
- **[API Documentation](docs/2-Tech-Specs/)** - Technical specifications

## 🛠️ Development

### Running Tests
```bash
# Test ESPN API connection
python test_espn_api.py

# Debug league connection
python src/debug_league.py
```

### Adding Features
1. Create new modules in `src/analysis/` or `src/reports/`
2. Update `src/main.py` to include new functionality
3. Document changes in `docs/`

## 🔒 Security Notes

- **Never commit cookies to version control**
- **Use environment variables for sensitive data**
- **Cookies expire periodically - refresh as needed**
- **This is for personal use only**

## 🎯 Roadmap

### Phase 1: Core Data Access ✅
- [x] ESPN API connection
- [x] League information display
- [x] Basic team and player data

### Phase 2: Analysis & Automation
- [ ] Weekly matchup analysis
- [ ] Waiver wire suggestions
- [ ] Performance reports
- [ ] Data export options

### Phase 3: Power User Features
- [ ] Web dashboard
- [ ] Discord/Slack integration
- [ ] Automated alerts
- [ ] Cross-league analysis

## 🤝 Contributing

This is a personal project, but suggestions and improvements are welcome!

## 📄 License

MIT License - See LICENSE file for details

## ⚠️ Disclaimer

This project uses an unofficial ESPN API. Use at your own risk and respect ESPN's terms of service.
