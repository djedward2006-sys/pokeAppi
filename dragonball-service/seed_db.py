import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")

characters = [
    {"nombre": "Goku", "raza": "Saiyan", "tecnica_principal": "Kamehameha", "imagen": "https://piks.eldesmarque.com/bin/2024/03/12/dragon_ball_shueisha_akira_toriyama_son_goku.jpg"},
    {"nombre": "Vegeta", "raza": "Saiyan", "tecnica_principal": "Final Flash", "imagen": "https://piks.eldesmarque.com/bin/2024/03/13/vegeta_dragon_ball_super.PNG"},
    {"nombre": "Gohan", "raza": "Híbrido Saiyan", "tecnica_principal": "Masenko", "imagen": "https://img.asmedia.epimg.net/resizer/v2/XJ2L7777777777777777777777.jpg?auth=d9f6b4d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d&width=1200"},
    {"nombre": "Piccolo", "raza": "Namekian", "tecnica_principal": "Special Beam Cannon", "imagen": "https://img.asmedia.epimg.net/resizer/v2/XJ2L7777777777777777777777.jpg?auth=d9f6b4d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d&width=1200"},
    {"nombre": "Trunks", "raza": "Híbrido Saiyan", "tecnica_principal": "Burning Attack", "imagen": "https://img.asmedia.epimg.net/resizer/v2/XJ2L7777777777777777777777.jpg?auth=d9f6b4d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d&width=1200"},
    {"nombre": "Frieza", "raza": "Frieza Race", "tecnica_principal": "Death Beam", "imagen": "https://img.asmedia.epimg.net/resizer/v2/XJ2L7777777777777777777777.jpg?auth=d9f6b4d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d&width=1200"},
    {"nombre": "Cell", "raza": "Androide", "tecnica_principal": "Solar Kamehameha", "imagen": "https://img.asmedia.epimg.net/resizer/v2/XJ2L7777777777777777777777.jpg?auth=d9f6b4d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d&width=1200"},
    {"nombre": "Majin Buu", "raza": "Majin", "tecnica_principal": "Transmutation Beam", "imagen": "https://img.asmedia.epimg.net/resizer/v2/XJ2L7777777777777777777777.jpg?auth=d9f6b4d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d&width=1200"},
    {"nombre": "Krillin", "raza": "Humano", "tecnica_principal": "Destructo Disc", "imagen": "https://img.asmedia.epimg.net/resizer/v2/XJ2L7777777777777777777777.jpg?auth=d9f6b4d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d&width=1200"},
    {"nombre": "Bulma", "raza": "Humano", "tecnica_principal": "Genio Inventivo", "imagen": "https://img.asmedia.epimg.net/resizer/v2/XJ2L7777777777777777777777.jpg?auth=d9f6b4d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d&width=1200"}
]

async def seed():
    client = AsyncIOMotorClient(MONGO_URI)
    db = client.dragonball_db
    collection = db.characters
    
    print("🌱 Seeding Dragon Ball characters...")
    
    # Optional: Clear existing data
    # await collection.delete_many({})
    
    for char in characters:
        await collection.update_one(
            {"nombre": char["nombre"]},
            {"$set": char},
            upsert=True
        )
    
    print("✅ Dragon Ball characters seeded successfully")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed())
