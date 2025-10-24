# Quick Start Guide

## TLDR

Step-by-step guide to get started with development of the Fantasy Football Companion App.

## Prerequisites

- Documentation structure set up ✅
- Meta-docs template understood
- Project context reviewed
- Development environment ready

## 🚀 **START HERE: Phase 1, Week 1**

### **Step 1: Backend Setup**
```bash
cd /Users/jimingxu/Dev/fantasy-dashboard
mkdir backend && cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install fastapi uvicorn supabase python-dotenv pydantic
mkdir -p app/{api/v1,core,models,services,utils}
```

```bash
cd /Users/jimingxu/Dev/fantasy-dashboard
npx create-react-app frontend --template typescript
cd frontend
npm install @supabase/supabase-js @tanstack/react-query tailwindcss
npx tailwindcss init -p
```

### **Step 3: Configure Supabase**
1. Create Supabase project at [supabase.com](https://supabase.com)
2. Create `.env` files with project URL and keys
3. Set up database schema (see implementation plan)

### **Step 4: Test Setup**
```bash
# Backend
cd backend && uvicorn app.main:app --reload

# Frontend  
cd frontend && npm start
```

**Verify:** Backend on `localhost:8000`, Frontend on `localhost:3000`

## 🎯 **Next Steps**

**Week 1:** Token system, basic betting, database setup
**Week 2:** Betting engine, odds calculation, market types
**Week 3:** Core API, real-time updates, authentication
**Week 4:** React components, UI, mobile optimization

## 📚 **Reference Documents**

- Implementation Plan: `docs/3-Development/implementation-plan.md`
- Roadmap: `docs/1-Product/roadmap.md`
- Architecture: `docs/2-Design/system-architecture.md`
- API Spec: `docs/2-Design/api-spec.md`

## ✅ **Success Criteria**

- [ ] Backend server starts without errors
- [ ] Frontend loads in browser
- [ ] Supabase connection working
- [ ] Database tables created
- [ ] Basic API endpoints respond
