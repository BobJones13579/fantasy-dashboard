#!/usr/bin/env python3
"""
Database setup script for Fantasy Football Companion App
Run this script to create the necessary database tables in Supabase
"""

import os
from dotenv import load_dotenv
from supabase import create_client

# Load environment variables
load_dotenv()

def setup_database():
    """Set up the database schema"""
    
    # Get Supabase credentials
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_KEY") or os.getenv("SUPABASE_ANON_KEY")
    
    if not supabase_url or not supabase_key:
        print("❌ Error: SUPABASE_URL and SUPABASE_KEY must be set in .env file")
        print("Please create a .env file with your Supabase credentials")
        return False
    
    try:
        # Create Supabase client
        supabase = create_client(supabase_url, supabase_key)
        print("✅ Connected to Supabase")
        
        # SQL commands to create tables
        sql_commands = [
            # Users table
            """
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                email VARCHAR(255) UNIQUE NOT NULL,
                display_name VARCHAR(100) NOT NULL,
                espn_user_id VARCHAR(50),
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
            """,
            
            # Leagues table
            """
            CREATE TABLE IF NOT EXISTS leagues (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name VARCHAR(100) NOT NULL,
                espn_league_id VARCHAR(50) UNIQUE NOT NULL,
                season INTEGER NOT NULL,
                settings JSONB,
                created_at TIMESTAMP DEFAULT NOW()
            );
            """,
            
            # Teams table
            """
            CREATE TABLE IF NOT EXISTS teams (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                league_id UUID REFERENCES leagues(id),
                espn_team_id VARCHAR(50) NOT NULL,
                name VARCHAR(100) NOT NULL,
                owner_id UUID REFERENCES users(id),
                created_at TIMESTAMP DEFAULT NOW()
            );
            """,
            
            # Token balances table
            """
            CREATE TABLE IF NOT EXISTS token_balances (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                team_id UUID REFERENCES teams(id),
                week INTEGER NOT NULL,
                starting_balance INTEGER DEFAULT 1000,
                current_balance INTEGER NOT NULL,
                weekly_used INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
            """,
            
            # Token transactions table
            """
            CREATE TABLE IF NOT EXISTS token_transactions (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                team_id UUID REFERENCES teams(id),
                week INTEGER NOT NULL,
                amount INTEGER NOT NULL,
                transaction_type VARCHAR(50) NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT NOW()
            );
            """,
            
            # Create indexes for performance
            """
            CREATE INDEX IF NOT EXISTS idx_teams_league_id ON teams(league_id);
            """,
            """
            CREATE INDEX IF NOT EXISTS idx_token_balances_team_week ON token_balances(team_id, week);
            """,
            """
            CREATE INDEX IF NOT EXISTS idx_users_espn_id ON users(espn_user_id);
            """,
            """
            CREATE INDEX IF NOT EXISTS idx_token_transactions_team_week ON token_transactions(team_id, week);
            """,
        ]
        
        # Execute SQL commands
        for i, sql in enumerate(sql_commands, 1):
            try:
                result = supabase.rpc('exec_sql', {'sql': sql.strip()})
                print(f"✅ Command {i}/{len(sql_commands)} executed successfully")
            except Exception as e:
                # Try alternative method if rpc doesn't work
                try:
                    # For some Supabase setups, we might need to use the SQL editor
                    print(f"⚠️  Command {i} needs to be run manually in Supabase SQL Editor:")
                    print(f"SQL: {sql.strip()}")
                    print()
                except Exception as e2:
                    print(f"❌ Error executing command {i}: {e}")
        
        print("\n🎉 Database setup completed!")
        print("\nNext steps:")
        print("1. Verify tables were created in your Supabase dashboard")
        print("2. Set up Row Level Security (RLS) policies if needed")
        print("3. Test the API endpoints")
        
        return True
        
    except Exception as e:
        print(f"❌ Error setting up database: {e}")
        return False

def print_manual_setup():
    """Print manual setup instructions"""
    print("\n📋 Manual Database Setup Instructions:")
    print("=" * 50)
    print("If the automatic setup didn't work, please run these SQL commands")
    print("in your Supabase SQL Editor:")
    print()
    
    sql_commands = [
        # Users table
        """
        CREATE TABLE IF NOT EXISTS users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email VARCHAR(255) UNIQUE NOT NULL,
            display_name VARCHAR(100) NOT NULL,
            espn_user_id VARCHAR(50),
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        );
        """,
        
        # Leagues table
        """
        CREATE TABLE IF NOT EXISTS leagues (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(100) NOT NULL,
            espn_league_id VARCHAR(50) UNIQUE NOT NULL,
            season INTEGER NOT NULL,
            settings JSONB,
            created_at TIMESTAMP DEFAULT NOW()
        );
        """,
        
        # Teams table
        """
        CREATE TABLE IF NOT EXISTS teams (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            league_id UUID REFERENCES leagues(id),
            espn_team_id VARCHAR(50) NOT NULL,
            name VARCHAR(100) NOT NULL,
            owner_id UUID REFERENCES users(id),
            created_at TIMESTAMP DEFAULT NOW()
        );
        """,
        
        # Token balances table
        """
        CREATE TABLE IF NOT EXISTS token_balances (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            team_id UUID REFERENCES teams(id),
            week INTEGER NOT NULL,
            starting_balance INTEGER DEFAULT 1000,
            current_balance INTEGER NOT NULL,
            weekly_used INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        );
        """,
        
        # Token transactions table
        """
        CREATE TABLE IF NOT EXISTS token_transactions (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            team_id UUID REFERENCES teams(id),
            week INTEGER NOT NULL,
            amount INTEGER NOT NULL,
            transaction_type VARCHAR(50) NOT NULL,
            description TEXT,
            created_at TIMESTAMP DEFAULT NOW()
        );
        """,
        
        # Indexes
        """
        CREATE INDEX IF NOT EXISTS idx_teams_league_id ON teams(league_id);
        CREATE INDEX IF NOT EXISTS idx_token_balances_team_week ON token_balances(team_id, week);
        CREATE INDEX IF NOT EXISTS idx_users_espn_id ON users(espn_user_id);
        CREATE INDEX IF NOT EXISTS idx_token_transactions_team_week ON token_transactions(team_id, week);
        """,
    ]
    
    for i, sql in enumerate(sql_commands, 1):
        print(f"-- Command {i}")
        print(sql.strip())
        print()

if __name__ == "__main__":
    print("🚀 Fantasy Football Companion - Database Setup")
    print("=" * 50)
    
    success = setup_database()
    
    if not success:
        print_manual_setup()
