from datetime import datetime
from fastapi import HTTPException, status
from app.db.mongo import mongodb
from app.core.security import hash_password, verify_password, create_access_token
from app.auth.schemas import UserRegister, UserLogin
from bson import ObjectId
import uuid

class AuthService:
    @staticmethod
    async def register_user(user_data: UserRegister) -> dict:
        """Register new user"""
        users = mongodb.get_users_collection()
        
        # Check if email already exists
        existing_user = await users.find_one({"email": user_data.email})
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create workspace_id for user
        workspace_id = str(uuid.uuid4())
        
        # Create user document
        user_doc = {
            "name": user_data.name,
            "email": user_data.email,
            "hashed_password": hash_password(user_data.password),
            "workspace_id": workspace_id,
            "created_at": datetime.utcnow()
        }
        
        # Insert into MongoDB
        result = await users.insert_one(user_doc)
        
        return {
            "message": "User registered successfully",
            "user_id": str(result.inserted_id)
        }
    
    @staticmethod
    async def login_user(credentials: UserLogin) -> dict:
        """Login user and return JWT token"""
        users = mongodb.get_users_collection()
        
        # Find user by email
        user = await users.find_one({"email": credentials.email})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Verify password
        if not verify_password(credentials.password, user["hashed_password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Create access token with workspace_id
        access_token = create_access_token(data={
            "sub": user["email"],
            "workspace_id": user["workspace_id"]
        })
        
        return {
            "access_token": access_token,
            "token_type": "bearer"
        }
    
    @staticmethod
    async def get_user_by_email(email: str) -> dict:
        """Get user by email"""
        users = mongodb.get_users_collection()
        user = await users.find_one({"email": email})
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "workspace_id": user["workspace_id"],
            "created_at": user["created_at"]
        }
