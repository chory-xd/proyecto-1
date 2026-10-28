// Demostración de JSON, Fetch y jQuery. Requiere servidor local para leer datos.json.
const estadoRemoto = document.querySelector("#estado");
const listaRemota = document.querySelector("#lista-remota");

function mostrarEstado(texto, tipo = "info") {
  if (!estadoRemoto) return;
  estadoRemoto.textContent = texto;
  estadoRemoto.className = tipo;
}
function pintarRemoto(lista) {
  if (!listaRemota) return;
  listaRemota.replaceChildren();
  lista.forEach(p => {
    const art = document.createElement("article");
    art.className = `tarjeta${p.disponible ? "" : " agotado"}`;
    const h3 = document.createElement("h3"); h3.textContent = p.nombre;
    const precio = document.createElement("p"); precio.className = "precio"; precio.textContent = `Bs ${Number(p.precio).toFixed(2)} / ${p.unidad || "unidad"}`;
    const stock = document.createElement("p"); stock.className = "stock"; stock.textContent = p.disponible ? `${p.stock} en stock` : "Agotado";
    art.append(h3, precio, stock); listaRemota.append(art);
  });
}
async function cargarConFetch(url = "datos.json") {
  mostrarEstado("Cargando datos con Fetch…", "cargando");
  try {
    const respuesta = await fetch(url);
    if (!respuesta.ok) throw new Error(`El servidor respondió ${respuesta.status}`);
    const datos = await respuesta.json();
    if (!Array.isArray(datos.productos)) throw new Error("El JSON no contiene una lista de productos válida.");
    pintarRemoto(datos.productos);
    mostrarEstado(`${datos.productos.length} productos de ${datos.negocio.nombre}`, "ok");
  } catch (error) {
    mostrarEstado(`No se pudieron cargar los datos: ${error.message}. Si abriste el HTML con doble clic, usa el servidor local.`, "error");
    if (listaRemota) listaRemota.replaceChildren();
  }
}
document.querySelector("#cargar-fetch")?.addEventListener("click", () => cargarConFetch());
document.querySelector("#cargar-roto")?.addEventListener("click", () => cargarConFetch("no-existe.json"));
$("#cargar-jquery").on("click", function () {
  mostrarEstado("Cargando datos con jQuery…", "cargando");
  $.getJSON("datos.json")
    .done(datos => {
      if (!Array.isArray(datos.productos)) { mostrarEstado("El JSON no contiene productos válidos.", "error"); return; }
      pintarRemoto(datos.productos);
      mostrarEstado(`${datos.productos.length} productos cargados con jQuery.`, "ok");
    })
    .fail(jqXHR => mostrarEstado(`Falló la carga JSON (estado ${jqXHR.status}). Usa el servidor local y revisa datos.json.`, "error"));
});
