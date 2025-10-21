from supabase import create_client
from app.core.config import settings

# Initialize Supabase clients (will be None if credentials not provided)
supabase = None
supabase_admin = None

def get_supabase():
    """Get Supabase client for regular operations"""
    global supabase
    if supabase is None and settings.SUPABASE_URL and settings.SUPABASE_ANON_KEY:
        supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)
    return supabase

def get_supabase_admin():
    """Get Supabase client with service role for admin operations"""
    global supabase_admin
    if supabase_admin is None and settings.SUPABASE_URL and settings.SUPABASE_SERVICE_KEY:
        supabase_admin = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)
    return supabase_admin
