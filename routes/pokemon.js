const express = require("express");
const router = express.Router();

const mysql = require("../db/mysql");
const { getDB } = require("../db/mongo");

/**
 * @swagger
 * /api/pokemon/mysql/{name}:
 *   get:
 *     summary: Obtener un Pokémon desde MySQL
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del Pokémon
 *     responses:
 *       200:
 *         description: Datos del Pokémon
 *       404:
 *         description: Pokémon no encontrado
 */
// MYSQL
router.get("/mysql/:name", async (req, res) => {
  const { name } = req.params;

  try {
    const [rows] = await mysql.query(
      "SELECT * FROM pokemon WHERE nombre = ?",
      [name]
    );

    if (rows.length === 0) {
      return res.json({ error: "not_found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error MySQL:", err.message);
    res.status(500).json({ error: "db_error", message: "Error en MySQL" });
  }
});

/**
 * @swagger
 * /api/pokemon/mongo/{name}:
 *   get:
 *     summary: Obtener un Pokémon desde MongoDB
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del Pokémon
 *     responses:
 *       200:
 *         description: Datos del Pokémon
 *       503:
 *         description: Base de datos no disponible
 */
// MONGO
router.get("/mongo/:name", async (req, res) => {
  const mongoDB = getDB();

  if (!mongoDB) {
    return res.status(503).json({
      error: "db_unavailable",
      message: "MongoDB no está conectado",
    });
  }

  const { name } = req.params;

  try {
    const pokemon = await mongoDB
      .collection("pokemon")
      .findOne({ nombre: name });

    if (!pokemon) {
      return res.json({ error: "not_found" });
    }

    res.json(pokemon);
  } catch (err) {
    console.error("Error MongoDB:", err.message);
    res.status(500).json({ error: "db_error", message: "Error en MongoDB" });
  }
});

module.exports = router;