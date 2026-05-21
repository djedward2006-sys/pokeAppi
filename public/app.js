const searchInput = document.getElementById("search");
const statusEl = document.getElementById("status");
const characterDisplay = document.getElementById("character-display");
const appContainer = document.getElementById("app-container");

let currentSeries = "pokemon";
let backgroundInterval = null;
let currentBgIndex = 0;

// Colección de fondos por serie
const BACKGROUNDS = {
  pokemon: [
    "https://images3.alphacoders.com/273/27328.jpg",
    "https://images.alphacoders.com/605/605705.jpg",
    "https://images2.alphacoders.com/711/711283.jpg",
    "https://images4.alphacoders.com/605/605701.jpg"
  ],
  naruto: [
    "https://images8.alphacoders.com/613/613926.jpg",
    "https://images2.alphacoders.com/225/225430.png",
    "https://images6.alphacoders.com/606/606139.jpg",
    "https://images2.alphacoders.com/594/594870.jpg"
  ],
  dragonball: [
    "https://images2.alphacoders.com/248/248316.jpg",
    "https://images6.alphacoders.com/607/607421.jpg",
    "https://images5.alphacoders.com/606/606132.jpg",
    "https://images3.alphacoders.com/134/1344426.png"
  ]
};

// URLs de los microservicios (se actualizarán dinámicamente)
let API_URLS = {
  pokemon: "/api/pokemon",
  naruto: "http://localhost:8081/api/naruto",
  dragonball: "http://localhost:8000/api/dragonball"
};

// Cargar configuración desde el backend
async function loadConfig() {
  try {
    const res = await fetch("/api/config");
    if (res.ok) {
      const config = await res.json();
      API_URLS = config;
      console.log("✅ Configuración cargada:", API_URLS);
    }
  } catch (err) {
    console.error("❌ Error cargando configuración:", err);
  }
}

// Manejo de fondos dinámicos
function startBackgroundRotation() {
  if (backgroundInterval) clearInterval(backgroundInterval);
  
  currentBgIndex = 0;
  updateBackground();
  
  // Cambiar cada 1 minuto (60000ms)
  backgroundInterval = setInterval(() => {
    currentBgIndex = (currentBgIndex + 1) % BACKGROUNDS[currentSeries].length;
    updateBackground();
  }, 60000);
}

function updateBackground() {
  const imageUrl = BACKGROUNDS[currentSeries][currentBgIndex];
  document.body.style.backgroundImage = `url("${imageUrl}")`;
}

// Switch Series Theme and Mode
function switchSeries(serie) {
  currentSeries = serie;
  
  // Update UI classes
  appContainer.className = `series-hub theme-${serie}`;
  document.body.className = `theme-${serie}`;
  
  // Update button active state
  document.querySelectorAll(".series-btn").forEach(btn => {
    btn.classList.remove("active");
  });
  document.querySelector(`.btn-${serie}`).classList.add("active");
  
  // Update placeholder
  searchInput.placeholder = `Busca un personaje de ${serie}...`;
  
  // Clear display or show empty state
  characterDisplay.innerHTML = `<div class="empty-state"><p>Buscando en la base de datos de ${serie}...</p></div>`;
  
  setStatus("", "");
  startBackgroundRotation();
}

// Buscar con Enter
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    buscar(currentSeries);
  }
});

async function buscar(serie) {
  const name = searchInput.value.trim();

  if (!name) {
    setStatus("Escribe un nombre", "error");
    searchInput.focus();
    return;
  }

  setStatus("Canalizando chakra/energía...", "loading");

  try {
    const url = `${API_URLS[serie]}/${name}`;
    const res = await fetch(url);

    if (!res.ok) {
      if (res.status === 404) {
        setStatus("Personaje no encontrado", "error");
        characterDisplay.innerHTML = `<div class="empty-state"><p>No se encontró a "${name}" en ${serie}.</p></div>`;
      } else {
        setStatus("Error: " + res.statusText, "error");
      }
      return;
    }

    const data = await res.json();
    setStatus("¡Encontrado!", "success");
    mostrarPersonaje(data, serie);

  } catch (err) {
    setStatus("❌ Error conectando al servicio " + serie, "error");
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

function mostrarPersonaje(p, serie) {
  const nombre = p.nombre || p.name;
  const imagen = p.imagen || p.image || "https://via.placeholder.com/150";
  
  let rows = "";
  if (serie === "pokemon") {
    rows = `
      <div class="info-item"><span class="label">Tipo</span><span class="value">${p.tipo}</span></div>
      <div class="info-item"><span class="label">ID</span><span class="value">#${p.id}</span></div>
    `;
  } else if (serie === "naruto") {
    rows = `
      <div class="info-item"><span class="label">Aldea</span><span class="value">${p.aldea}</span></div>
      <div class="info-item"><span class="label">Clan</span><span class="value">${p.clan}</span></div>
    `;
  } else if (serie === "dragonball") {
    rows = `
      <div class="info-item"><span class="label">Raza</span><span class="value">${p.raza}</span></div>
      <div class="info-item"><span class="label">Técnica</span><span class="value">${p.tecnica_principal}</span></div>
    `;
  }

  characterDisplay.innerHTML = `
    <div class="char-card">
      <img src="${imagen}" alt="${nombre}" class="char-img">
      <h2 class="char-name">${nombre}</h2>
      <div class="char-info">
        ${rows}
      </div>
    </div>
  `;
}

// Inicializar
document.addEventListener("DOMContentLoaded", async () => {
  await loadConfig();
  switchSeries("pokemon");
});