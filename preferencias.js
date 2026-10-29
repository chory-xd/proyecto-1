// ── 1. localStorage Y sessionStorage ────────────────────────────────────
const CLAVE = "panaderia:preferencias";

const PREFERENCIAS_POR_DEFECTO = { tema: "claro", orden: "nombre" };

// ── 2. LEER CON try/catch ───────────────────────────────────────────────
function leerPreferencias() {
  try {
    const texto = localStorage.getItem(CLAVE);
    if (!texto) return { ...PREFERENCIAS_POR_DEFECTO };

    const guardado = JSON.parse(texto);

    return { ...PREFERENCIAS_POR_DEFECTO, ...guardado };

  } catch (error) {
    console.warn("Preferencias corruptas, se usan las por defecto:", error.message);
    return { ...PREFERENCIAS_POR_DEFECTO };
  }
}

function guardarPreferencias(prefs) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(prefs));
    return true;
  } catch (error) {
    console.warn("No se pudo guardar:", error.message);
    return false;
  }
}

// ── 3. APLICAR LO GUARDADO AL CARGAR ────────────────────────────────────
let preferencias = leerPreferencias();

function aplicarPreferencias() {

  document.body.classList.toggle("tema-oscuro", preferencias.tema === "oscuro");

  const boton = document.querySelector("#tema-toggle");
  if (boton) boton.setAttribute("aria-pressed", String(preferencias.tema === "oscuro"));
  if (boton) boton.textContent = preferencias.tema === "oscuro" ? "☀️ Modo claro" : "🌙 Modo oscuro";

  const orden = document.querySelector("#orden");
  if (orden) orden.value = preferencias.orden;
  document.dispatchEvent(new Event("largucho:orden"));

  if (document.querySelector("#estado-prefs")) document.querySelector("#estado-prefs").textContent =
    `Tema ${preferencias.tema}, ordenado por ${preferencias.orden}.`;
}

aplicarPreferencias();

// ── 4. GUARDAR AL CAMBIAR ───────────────────────────────────────────────
document.querySelector("#tema-toggle")?.addEventListener("click", () => {
  preferencias.tema = preferencias.tema === "oscuro" ? "claro" : "oscuro";
  guardarPreferencias(preferencias);
  aplicarPreferencias();
});

document.querySelector("#orden")?.addEventListener("change", (event) => {
  preferencias.orden = event.target.value;
  guardarPreferencias(preferencias);
  aplicarPreferencias();
});

document.querySelector("#olvidar")?.addEventListener("click", () => {
  localStorage.removeItem(CLAVE);
  preferencias = { ...PREFERENCIAS_POR_DEFECTO };
  aplicarPreferencias();
  if (document.querySelector("#estado-prefs")) document.querySelector("#estado-prefs").textContent = "Preferencias olvidadas.";
});

// ── 5. LO QUE NUNCA VA EN localStorage ──────────────────────────────────

// ── 6. GEOLOCATION ──────────────────────────────────────────────────────
// Coordenadas de referencia que ya estaban en eventos.js.
// IMPORTANTE: confirmar en el mapa que son las de Panadería Largucho.
const LOCAL = { lat: -16.9277998, lng: -68.2477373 };

function distanciaKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const rad = grados => grados * Math.PI / 180;
  const dLat = rad(lat2 - lat1);
  const dLng = rad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const botonUbicacion = document.querySelector("#ubicarme");
const estadoUbicacion = document.querySelector("#estado-ubicacion");
botonUbicacion?.addEventListener("click", () => {
  if (!navigator.geolocation) {
    estadoUbicacion.textContent = "Tu navegador no admite geolocalización.";
    return;
  }
  botonUbicacion.disabled = true;
  estadoUbicacion.textContent = "Calculando tu distancia a Panadería Largucho...";
  navigator.geolocation.getCurrentPosition(
    posicion => {
      const { latitude, longitude } = posicion.coords;
      const km = distanciaKm(latitude, longitude, LOCAL.lat, LOCAL.lng);
      const distancia = km < 1 ? `${Math.round(km * 1000)} metros` : `${km.toFixed(2).replace(".", ",")} kilómetros`;
      estadoUbicacion.textContent = `Distancia aproximada a Panadería Largucho: ${distancia} (en línea recta).`;
      estadoUbicacion.className = "ok";
      botonUbicacion.disabled = false;
    },
    error => {
      estadoUbicacion.textContent = error.code === 1 ? "Permite el acceso a tu ubicación para conocer tu distancia a Panadería Largucho." : "No se pudo obtener tu ubicación. Activa el GPS e inténtalo nuevamente. En algunos navegadores se necesita HTTPS.";
      estadoUbicacion.className = "error";
      botonUbicacion.disabled = false;
    },
    { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
  );
});

// ── 7. LO QUE SORPRENDE EN LA ENTREGA ───────────────────────────────────
