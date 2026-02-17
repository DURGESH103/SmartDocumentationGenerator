from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional
from app.core.config import settings   # ⭐ IMPORTANT

class MongoDB:
    client: Optional[AsyncIOMotorClient] = None
    
    @classmethod
    async def connect_db(cls):
        mongodb_url = settings.MONGODB_URL   # ⭐ CHANGE HERE
        
        if not mongodb_url:
            raise ValueError("MONGODB_URL not found in settings")
        
        cls.client = AsyncIOMotorClient(mongodb_url)
        print("✅ Connected to MongoDB Atlas")
    
    @classmethod
    async def close_db(cls):
        if cls.client:
            cls.client.close()
            print("❌ Closed MongoDB connection")
    
    @classmethod
    def get_db(cls):
        if not cls.client:
            raise RuntimeError("Database not connected")
        return cls.client.smartdoc
    
    @classmethod
    def get_users_collection(cls):
        return cls.get_db().users


mongodb = MongoDB()
