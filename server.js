require("dotenv").config();
const express = require("express");

const path = require("path");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// rutas API
const { swaggerUi, specs } = require("./config/swagger");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
// Configuración para el frontend
app.get("/api/config", (req, res) => {
  res.json({
    pokemon: "/api/pokemon", // Ruta relativa
    naruto: process.env.NARUTO_SERVICE_URL || "http://localhost:8081/api/naruto",
    dragonball: process.env.DRAGONBALL_SERVICE_URL || "http://localhost:8000/api/dragonball",
  });
});

app.use("/api/pokemon", require("./routes/pokemon"));

// Verificación de variables (sin mostrar valores sensibles)
console.log("🔍 Verificando variables de entorno:");
console.log("- MYSQL_HOST:", process.env.MYSQL_HOST ? "✅" : "❌");

// Iniciar servidor
const PORT = process.env.PORT || 3000;

function start() {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo en el puerto ${PORT}`);
  });
}

start();