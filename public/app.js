// ==========================================
// POKÉDEX — App Logic
// ==========================================

const searchInput = document.getElementById("search");
const statusEl = document.getElementById("status");

// Buscar con Enter
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    // Buscar en MySQL por defecto con Enter
    buscar("mysql");
  }
});

async function buscar(db) {
  const name = searchInput.value.trim().toLowerCase();

  if (!name) {
    setStatus("Escribe un nombre", "error");
    searchInput.focus();
    return;
  }

  setStatus("Buscando...", "loading");

  try {
    const res = await fetch(`/api/pokemon/${db}/${name}`);
    const data = await res.json();

    if (data.error === "not_found") {
      setStatus("Pokémon no encontrado", "error");
      return;
    }

    if (data.error === "db_unavailable") {
      setStatus("⚠️ " + data.message, "error");
      return;
    }

    if (data.error) {
      setStatus("❌ Error: " + (data.message || data.error), "error");
      return;
    }

    setStatus("¡Encontrado!", "success");
    mostrarPokemon(data);

  } catch (err) {
    setStatus("❌ Error en servidor", "error");
    console.error("Fetch error:", err);
  }
}

function setStatus(text, type) {
  statusEl.innerText = text;
  statusEl.className = "status-text";
  if (type) {
    statusEl.classList.add(type);
  }
}

function mostrarPokemon(p) {
  document.getElementById("name").innerText = p.nombre;
  document.getElementById("front").src = p.imagen_frontal;
  document.getElementById("back").src = p.imagen_trasera;

  // Construir info con filas elegantes
  const infoEl = document.getElementById("info");
  infoEl.innerHTML = `
    <div class="info-row">
      <span class="info-label">Tipo</span>
      <span class="info-value">${p.tipo || '—'}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Peso</span>
      <span class="info-value">${p.peso || '—'}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Altura</span>
      <span class="info-value">${p.altura || '—'}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Evolución</span>
      <span class="info-value">${p.evolucion || '—'}</span>
    </div>
  `;

  document.getElementById("modal").style.display = "block";
  document.body.style.overflow = "hidden";
}

function cerrar() {
  document.getElementById("modal").style.display = "none";
  document.body.style.overflow = "";
}

// Cerrar modal con Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") cerrar();
});