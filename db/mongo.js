const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

let db = null;

async function connect() {
  try {
    await client.connect();
    db = client.db(process.env.MONGO_DB_NAME || "pokeapi");
    console.log("✅ MongoDB conectado");
    return db;
  } catch (err) {
    console.error("❌ Error conectando a MongoDB:", err.message);
    return null;
  }
}

function getDB() {
  return db;
}

module.exports = { connect, getDB };