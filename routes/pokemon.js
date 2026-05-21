const express = require("express");
const router = express.Router();

const mysql = require("../db/mysql");

/**
 * @swagger
 * /api/pokemon:
 *   get:
 *     summary: Obtener todos los Pokémon
 *     responses:
 *       200:
 *         description: Lista de Pokémon
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get("/", async (req, res) => {
  try {
    const [rows] = await mysql.query("SELECT * FROM pokemon");
    res.json(rows);
  } catch (err) {
    console.error("Error MySQL:", err.message);
    res.status(500).json({ error: "db_error", message: "Error en MySQL" });
  }
});

/**
 * @swagger
 * /api/pokemon/{name}:
 *   get:
 *     summary: Obtener un Pokémon por nombre
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
router.get("/:name", async (req, res) => {
  const { name } = req.params;

  try {
    const [rows] = await mysql.query(
      "SELECT * FROM pokemon WHERE nombre = ?",
      [name]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "not_found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error MySQL:", err.message);
    res.status(500).json({ error: "db_error", message: "Error en MySQL" });
  }
});

module.exports = router;