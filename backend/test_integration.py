#!/usr/bin/env python3
"""
Comprehensive integration test for Fantasy Football Companion App
Tests Supabase connection, database operations, and API endpoints
"""

import sys
import os
import requests
import json
from uuid import uuid4
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import get_supabase
from app.services.token_service import TokenService

def test_supabase_connection():
    """Test Supabase database connection"""
    print("🔗 Testing Supabase Connection")
    print("-" * 40)
    
    try:
        supabase = get_supabase()
        if supabase:
            print("✅ Supabase client created successfully")
            
            # Test a simple query to verify connection
            response = supabase.table("users").select("id").limit(1).execute()
            print("✅ Database query executed successfully")
            print(f"   Response: {len(response.data)} records")
            return True
        else:
            print("❌ Failed to create Supabase client")
            return False
    except Exception as e:
        print(f"❌ Supabase connection error: {e}")
        return False

def test_token_service():
    """Test token service operations"""
    print("\n🪙 Testing Token Service")
    print("-" * 40)
    
    try:
        token_service = TokenService()
        supabase = get_supabase()
        
        # Create test data: user, league, team
        print("   Creating test data...")
        
        # Create test user
        user_response = supabase.table("users").insert({
            "email": "test@example.com",
            "display_name": "Test User"
        }).execute()
        test_user_id = user_response.data[0]["id"]
        print(f"   Created test user: {test_user_id}")
        
        # Create test league
        league_response = supabase.table("leagues").insert({
            "name": "Test League",
            "espn_league_id": "123456",
            "season": 2024
        }).execute()
        test_league_id = league_response.data[0]["id"]
        print(f"   Created test league: {test_league_id}")
        
        # Create test team
        team_response = supabase.table("teams").insert({
            "league_id": test_league_id,
            "espn_team_id": "1",
            "name": "Test Team",
            "owner_id": test_user_id
        }).execute()
        test_team_id = team_response.data[0]["id"]
        test_week = 1
        
        print(f"   Created test team: {test_team_id}")
        print(f"   Test Week: {test_week}")
        
        # Test token allocation
        print("   Testing token allocation...")
        balance = token_service.allocate_weekly_tokens(test_team_id, test_week)
        if balance:
            print(f"✅ Token allocation successful: {balance.current_balance} tokens")
        else:
            print("❌ Token allocation failed")
            return False
        
        # Test token deduction
        print("   Testing token deduction...")
        success = token_service.deduct_tokens(test_team_id, 100, test_week, "Test bet")
        if success:
            print("✅ Token deduction successful")
        else:
            print("❌ Token deduction failed")
            return False
        
        # Test getting balance
        print("   Testing balance retrieval...")
        updated_balance = token_service.get_balance(test_team_id, test_week)
        if updated_balance:
            print(f"✅ Balance retrieval successful: {updated_balance.current_balance} tokens")
        else:
            print("❌ Balance retrieval failed")
            return False
        
        # Test transaction history
        print("   Testing transaction history...")
        transactions = token_service.get_transaction_history(test_team_id, test_week)
        print(f"✅ Transaction history retrieved: {len(transactions)} transactions")
        
        return True
        
    except Exception as e:
        print(f"❌ Token service error: {e}")
        return False

def test_api_endpoints():
    """Test API endpoints"""
    print("\n🌐 Testing API Endpoints")
    print("-" * 40)
    
    base_url = "http://localhost:8000"
    
    # Test health endpoint
    try:
        response = requests.get(f"{base_url}/health")
        if response.status_code == 200:
            print("✅ Health endpoint working")
        else:
            print(f"❌ Health endpoint failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health endpoint error: {e}")
        return False
    
    # Test token endpoints
    try:
        # Test token balance endpoint (should return 404 for non-existent team)
        response = requests.get(f"{base_url}/api/v1/tokens/balance/{uuid4()}/1")
        if response.status_code == 404:
            print("✅ Token balance endpoint working (404 for non-existent team)")
        else:
            print(f"❌ Token balance endpoint unexpected response: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Token endpoint error: {e}")
        return False
    
    # Test ESPN endpoints
    try:
        # Test ESPN connection endpoint (should return 400 for no configured league)
        response = requests.get(f"{base_url}/api/v1/espn/test-connection")
        if response.status_code == 400:
            print("✅ ESPN connection endpoint working (400 for no configured league)")
        else:
            print(f"❌ ESPN connection endpoint unexpected response: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ ESPN endpoint error: {e}")
        return False
    
    return True

def test_database_tables():
    """Test database table structure"""
    print("\n🗄️ Testing Database Tables")
    print("-" * 40)
    
    try:
        supabase = get_supabase()
        
        # Test each table
        tables = ["users", "leagues", "teams", "token_balances", "token_transactions"]
        
        for table in tables:
            try:
                response = supabase.table(table).select("*").limit(1).execute()
                print(f"✅ Table '{table}' accessible")
            except Exception as e:
                print(f"❌ Table '{table}' error: {e}")
                return False
        
        return True
        
    except Exception as e:
        print(f"❌ Database table test error: {e}")
        return False

def main():
    """Run all integration tests"""
    print("🧪 Fantasy Football Companion - Integration Tests")
    print("=" * 60)
    
    tests = [
        ("Supabase Connection", test_supabase_connection),
        ("Database Tables", test_database_tables),
        ("Token Service", test_token_service),
        ("API Endpoints", test_api_endpoints),
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} test crashed: {e}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 Test Results Summary")
    print("=" * 60)
    
    passed = 0
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} {test_name}")
        if result:
            passed += 1
    
    print(f"\n🎯 Overall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! System is ready for development.")
        print("\n🚀 Next Steps:")
        print("1. Configure your ESPN league in the API")
        print("2. Test with real fantasy football data")
        print("3. Start building the frontend features")
    else:
        print("⚠️  Some tests failed. Please check the errors above.")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
