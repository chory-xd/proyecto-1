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
const LOCAL = { lat: -16.5, lng: -68.15 };

function distanciaKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const aRad = (g) => (g * Math.PI) / 180;
  const dLat = aRad(lat2 - lat1);
  const dLng = aRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(aRad(lat1)) * Math.cos(aRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const $ubic = document.querySelector("#estado-ubicacion");

document.querySelector("#ubicarme")?.addEventListener("click", () => {

  if (!navigator.geolocation) {
    $ubic.textContent = "Tu navegador no permite compartir la ubicación.";
    $ubic.className = "error";
    return;
  }

  $ubic.textContent = "Pidiendo permiso...";
  $ubic.className = "cargando";

  navigator.geolocation.getCurrentPosition(

    (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      const km = distanciaKm(latitude, longitude, LOCAL.lat, LOCAL.lng);
      $ubic.textContent =
        `Estás a ${km.toFixed(1)} km del local (precisión: ${Math.round(accuracy)} m).`;
      $ubic.className = "ok";
    },

    (error) => {
      const mensajes = {
        [error.PERMISSION_DENIED]:
          "No diste permiso. Puedes seguir usando la página igual.",
        [error.POSITION_UNAVAILABLE]:
          "No se pudo determinar tu ubicación. ¿Estás bajo techo?",
        [error.TIMEOUT]:
          "Tardó demasiado. Intenta de nuevo.",
      };
      $ubic.textContent = mensajes[error.code] || "No se pudo obtener la ubicación.";
      $ubic.className = "error";
    },

    {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 300000,
    }
  );
});

// ── 7. LO QUE SORPRENDE EN LA ENTREGA ───────────────────────────────────
