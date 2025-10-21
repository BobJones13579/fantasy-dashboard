# Fantasy Football Companion - Backend

This is the backend API for the Fantasy Football Companion App, built with FastAPI and Supabase.

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Supabase account and project

### Setup

1. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

4. **Set up database**
   ```bash
   python setup_database.py
   ```

5. **Start the server**
   ```bash
   uvicorn app.main:app --reload
   ```

The API will be available at `http://localhost:8000`

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## 🗄️ Database Schema

The app uses the following main tables:

- **users**: User accounts and authentication
- **leagues**: Fantasy football leagues
- **teams**: Teams within leagues
- **token_balances**: Weekly token balances for betting
- **token_transactions**: Transaction history

## 🔧 Development

### Project Structure

```
backend/
├── app/
│   ├── api/v1/          # API routes
│   ├── core/            # Configuration and database
│   ├── models/          # Pydantic models
│   ├── services/        # Business logic
│   └── utils/           # Utility functions
├── requirements.txt     # Python dependencies
├── setup_database.py    # Database setup script
└── README.md           # This file
```

### Adding New Features

1. Create models in `app/models/`
2. Add business logic in `app/services/`
3. Create API endpoints in `app/api/v1/`
4. Update the main app to include new routes

## 🧪 Testing

```bash
# Run tests (when implemented)
pytest

# Test specific endpoint
curl http://localhost:8000/health
```

## 🚀 Deployment

The backend is designed to be deployed on platforms like:
- Railway
- Render
- Heroku
- AWS/GCP/Azure

Make sure to set the appropriate environment variables in your deployment platform.

## 📝 Environment Variables

Required environment variables:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
SECRET_KEY=your_secret_key
```

## 🤝 Contributing

1. Follow the existing code structure
2. Add type hints to all functions
3. Include docstrings for public functions
4. Test your changes before submitting

## 📄 License

This project is part of the Fantasy Football Companion App.
