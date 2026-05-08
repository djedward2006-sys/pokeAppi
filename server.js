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

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en el puerto ${PORT}`);
});

// conectar MongoDB
connect();