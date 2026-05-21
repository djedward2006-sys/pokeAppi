const pool = require("./mysql");

const pokemonData = [
  { nombre: "Pikachu", tipo: "Eléctrico", imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png" },
  { nombre: "Charmander", tipo: "Fuego", imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png" },
  { nombre: "Squirtle", tipo: "Agua", imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png" },
  { nombre: "Bulbasaur", tipo: "Planta", imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png" },
  { nombre: "Jigglypuff", tipo: "Normal/Hada", imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png" },
  { nombre: "Meowth", tipo: "Normal", imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/52.png" },
  { nombre: "Psyduck", tipo: "Agua", imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/54.png" },
  { nombre: "Snorlax", tipo: "Normal", imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png" },
  { nombre: "Lucario", tipo: "Lucha/Aceo", imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/448.png" },
  { nombre: "Greninja", tipo: "Agua/Siniestro", imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/658.png" }
];

async function seed() {
  try {
    console.log("🌱 Seeding Pokemon...");
    
    // Create table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pokemon (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(50) NOT NULL UNIQUE,
        tipo VARCHAR(50) NOT NULL,
        imagen VARCHAR(255)
      )
    `);

    // Clear existing data (optional, but good for idempotency)
    // await pool.query("DELETE FROM pokemon");

    for (const p of pokemonData) {
      await pool.query(
        "INSERT IGNORE INTO pokemon (nombre, tipo, imagen) VALUES (?, ?, ?)",
        [p.nombre, p.tipo, p.imagen]
      );
    }

    console.log("✅ Pokemon seeded successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding Pokemon:", err.message);
    process.exit(1);
  }
}

seed();
