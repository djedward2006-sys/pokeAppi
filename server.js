require("dotenv").config();
const express = require("express");

const path = require("path");
const cors = require("cors");
const { connect } = require("./db/mongo");

const app = express();

app.use(cors());
app.use(express.json());

// rutas API
app.use("/api/pokemon", require("./routes/pokemon"));

// Verificación de variables (sin mostrar valores sensibles)
console.log("🔍 Verificando variables de entorno:");
console.log("- MYSQL_HOST:", process.env.MYSQL_HOST ? "✅" : "❌");
console.log("- MONGO_URI:", process.env.MONGO_URI ? "✅" : "❌");

// Iniciar servidor
const PORT = process.env.PORT || 3000;

async function start() {
  // Intentar conectar MongoDB primero
  await connect();
  
  app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo en el puerto ${PORT}`);
  });
}

start();