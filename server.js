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

// frontend
app.use(express.static(path.join(__dirname, "public")));

// conectar MongoDB y luego iniciar servidor
connect().then(() => {
  app.listen(3000, () => {
    console.log("Servidor en http://localhost:3000");
  });
});