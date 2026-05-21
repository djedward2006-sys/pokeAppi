import os
from fastapi import FastAPI, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Dragon Ball Service", version="1.0.0")

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URI)
db = client.dragonball_db

class Character(BaseModel):
    id: Optional[str] = None
    nombre: str
    raza: str
    tecnica_principal: str
    imagen: str

@app.get("/api/dragonball", response_model=List[Character])
async def get_characters():
    characters = []
    cursor = db.characters.find()
    async for document in cursor:
        document["id"] = str(document["_id"])
        characters.append(Character(**document))
    return characters

@app.get("/api/dragonball/{name}", response_model=Character)
async def get_character_by_name(name: str):
    character = await db.characters.find_one({"nombre": name})
    if character:
        character["id"] = str(character["_id"])
        return Character(**character)
    raise HTTPException(status_code=404, detail="Character not found")

@app.on_event("startup")
async def startup_db_client():
    app.mongodb_client = client
    app.mongodb = db

@app.on_event("shutdown")
async def shutdown_db_client():
    app.mongodb_client.close()
