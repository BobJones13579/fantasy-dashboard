# Fantasy Football Companion - Frontend

This is the frontend application for the Fantasy Football Companion App, built with React, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

The app will be available at `http://localhost:3000`

## 🎨 Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Updates**: Live odds and score updates
- **Token System**: Betting with virtual tokens
- **League Integration**: Connect to ESPN fantasy leagues
- **Modern UI**: Clean, sportsbook-style interface

## 🛠️ Tech Stack

- **React 18**: Frontend framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Supabase**: Database and authentication
- **React Query**: Data fetching and caching

## 📁 Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   ├── services/        # API services
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript type definitions
│   └── constants/      # App constants
├── tailwind.config.js  # Tailwind configuration
└── package.json        # Dependencies and scripts
```

## 🎯 Available Scripts

- `npm start`: Start development server
- `npm build`: Build for production
- `npm test`: Run tests
- `npm run eject`: Eject from Create React App

## 🔧 Development

### Adding New Components

1. Create component in `src/components/`
2. Add TypeScript interfaces in `src/types/`
3. Use Tailwind classes for styling
4. Follow the existing component patterns

### Styling Guidelines

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Maintain consistent color scheme
- Use semantic HTML elements

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## 🚀 Deployment

The frontend is designed to be deployed on:
- Vercel (recommended)
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

### Build for Production

```bash
npm run build
```

The build files will be in the `build/` directory.

## 📝 Environment Variables

Required environment variables:

```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🎨 Design System

### Colors

- **Primary**: Blue (#2563eb)
- **Success**: Green (#059669)
- **Warning**: Yellow (#d97706)
- **Error**: Red (#dc2626)
- **Background**: Gray (#f3f4f6)

### Typography

- **Headings**: Font weight 600-700
- **Body**: Font weight 400
- **Small text**: Font weight 300

## 🤝 Contributing

1. Follow the existing code structure
2. Use TypeScript for all new code
3. Add proper type definitions
4. Test your changes before submitting
5. Follow the design system guidelines

## 📄 License

This project is part of the Fantasy Football Companion App.