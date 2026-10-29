const COLUMNAS = ["hornear", "reponer", "pausa"];
const CLAVE_TABLERO = "largucho-tablero";
let tablero = {
  hornear: [
    { nombre: "Pan del día", cantidad: 120 },
    { nombre: "Pan marraqueta", cantidad: 250 },
    { nombre: "Pan sarnita", cantidad: 80 },
    { nombre: "Chamillo", cantidad: 50 },
  ],
  reponer: [
    { nombre: "Bizcocho", cantidad: 30 },
    { nombre: "Empanada de queso", cantidad: 2 },
  ],
  pausa: [
    { nombre: "Empanada de royal", cantidad: 0 },
    { nombre: "Cuernitos", cantidad: 0 },
  ],
};

try {
  const guardado = JSON.parse(localStorage.getItem(CLAVE_TABLERO));
  if (guardado && COLUMNAS.every(c => Array.isArray(guardado[c]))) tablero = guardado;
} catch (e) { /* Se conserva el tablero inicial */ }
function guardarTablero() { try { localStorage.setItem(CLAVE_TABLERO, JSON.stringify(tablero)); } catch (e) {} }

// ── 1. PINTAR EL TABLERO ────────────────────────────────────────────────
function renderTablero() {
  COLUMNAS.forEach((nombreColumna) => {
    const columna = document.querySelector(`[data-columna="${nombreColumna}"]`);
    const lista = columna.querySelector(".lista-columna");
    lista.innerHTML = "";

    tablero[nombreColumna].forEach((item, indice) => {
      const li = document.createElement("li");
      li.className = "ficha";

      li.draggable = true;

      li.dataset.columna = nombreColumna;
      li.dataset.indice = indice;

      const titulo = document.createElement("span");
      titulo.textContent = `${item.nombre} (${item.cantidad})`;
      const selector = document.createElement("select");
      selector.setAttribute("aria-label", `Mover ${item.nombre} a otra columna`);
      COLUMNAS.forEach(c => {
        const opcion = document.createElement("option");
        opcion.value = c; opcion.textContent = c[0].toUpperCase() + c.slice(1);
        opcion.selected = c === nombreColumna;
        selector.append(opcion);
      });
      selector.addEventListener("change", () => moverFicha(nombreColumna, indice, selector.value));
      li.append(titulo, selector);
      lista.append(li);
    });

    const total = tablero[nombreColumna].reduce((suma, i) => suma + i.cantidad, 0);

    const n = tablero[nombreColumna].length;
    columna.querySelector(".total").textContent =
      `${n} ${n === 1 ? "item" : "items"} · ${total} unidades`;
  });

  dibujarGrafico();
}

function moverFicha(origen, indice, destino) {
  if (origen === destino || !COLUMNAS.includes(origen) || !COLUMNAS.includes(destino)) return;
  const item = tablero[origen]?.[indice];
  if (!item) return;
  tablero[origen].splice(indice, 1);
  tablero[destino].push(item);
  guardarTablero();
  renderTablero();
}

// ── 2. DRAG & DROP: LOS EVENTOS, EN ORDEN ───────────────────────────────
const elTablero = document.querySelector("#tablero");

elTablero.addEventListener("dragstart", (event) => {
  const ficha = event.target.closest(".ficha");
  if (!ficha) return;

  event.dataTransfer.setData("text/plain", JSON.stringify({
    columna: ficha.dataset.columna,
    indice: Number(ficha.dataset.indice),
  }));

  event.dataTransfer.effectAllowed = "move";
  ficha.classList.add("arrastrando");
});

elTablero.addEventListener("dragend", (event) => {
  const ficha = event.target.closest(".ficha");
  if (ficha) ficha.classList.remove("arrastrando");
  document.querySelectorAll(".columna").forEach(c => c.classList.remove("encima"));
});

elTablero.addEventListener("dragover", (event) => {
  const columna = event.target.closest(".columna");
  if (!columna) return;

  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
  columna.classList.add("encima");
});

elTablero.addEventListener("dragleave", (event) => {
  const columna = event.target.closest(".columna");
  if (columna) columna.classList.remove("encima");
});

elTablero.addEventListener("drop", (event) => {
  const columna = event.target.closest(".columna");
  if (!columna) return;

  event.preventDefault();

  const destino = columna.dataset.columna;
  let origen;
  try { origen = JSON.parse(event.dataTransfer.getData("text/plain")); } catch (e) { return; }

  moverFicha(origen.columna, origen.indice, destino);
});

// ── 3. CANVAS: EL TAMAÑO ────────────────────────────────────────────────
const canvas = document.querySelector("#grafico");
const ctx = canvas.getContext("2d");

// ── 4. DIBUJAR ──────────────────────────────────────────────────────────
function dibujarGrafico() {
  const totales = COLUMNAS.map(c =>
    tablero[c].reduce((suma, i) => suma + i.cantidad, 0)
  );
  const maximo = Math.max(...totales, 1);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const margen = 40;
  const anchoBarra = 110;
  const separacion = 60;
  const alturaUtil = canvas.height - margen * 2;

  const estilo = getComputedStyle(document.body);
  const colorBarra = estilo.getPropertyValue("--color-principal").trim() || "#1a4a7a";
  const colorTexto = estilo.getPropertyValue("--color-texto").trim() || "#1f2933";

  COLUMNAS.forEach((nombre, i) => {
    const x = margen + i * (anchoBarra + separacion);
    const alto = (totales[i] / maximo) * alturaUtil;
    const y = canvas.height - margen - alto;

    ctx.fillStyle = colorBarra;
    ctx.fillRect(x, y, anchoBarra, alto);

    ctx.fillStyle = colorTexto;
    ctx.font = "14px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(nombre, x + anchoBarra / 2, canvas.height - margen + 20);
    ctx.fillText(String(totales[i]), x + anchoBarra / 2, y - 8);
  });

  ctx.beginPath();
  ctx.moveTo(margen - 10, canvas.height - margen);
  ctx.lineTo(canvas.width - margen + 10, canvas.height - margen);
  ctx.strokeStyle = colorTexto;
  ctx.lineWidth = 1;
  ctx.stroke();
}

// ── 5. ANIMAR: EL LOOP ──────────────────────────────────────────────────

// ── 6. LO QUE NO FUNCIONA EN MÓVIL ──────────────────────────────────────
renderTablero();

// Selección de productos para pedidos: independiente del tablero de producción.
(function iniciarPedidoTablero() {
  const catalogo = document.querySelector("#catalogo-tablero");
  const destino = document.querySelector("#zona-pedir");
  const lista = document.querySelector("#seleccion-tablero");
  if (!catalogo || !destino || !lista || typeof productos === "undefined") return;
  const CLAVE_SELECCION = "largucho-seleccion-tablero";
  let seleccion = {};
  let ultimoAgregado = "";
  try { const anterior = JSON.parse(localStorage.getItem(CLAVE_SELECCION) || "{}"); if (anterior && typeof anterior === "object" && !Array.isArray(anterior)) seleccion = anterior; } catch {}
  const precio = valor => `Bs ${valor.toFixed(2).replace(".", ",")}`;
  const aviso = document.querySelector("#aviso-tablero");
  function agregar(id) {
    const p = productos.find(x => x.id === id);
    if (!p || !p.disponible || p.stock <= 0) return;
    seleccion[id] = Math.min(p.stock, 100, (Number(seleccion[id]) || 0) + 1);
    ultimoAgregado = id;
    pintar();
    destino.classList.remove("canasta-late");
    void destino.offsetWidth;
    destino.classList.add("canasta-late");
    window.setTimeout(() => destino.classList.remove("canasta-late"), 650);
    aviso.textContent = `${p.nombre} agregado a tu canasta.`;
  }
  function pintar() {
    lista.replaceChildren(); let total = 0;
    Object.keys(seleccion).forEach(id => {
      const p = productos.find(x => x.id === id);
      if (!p || !p.disponible || p.stock <= 0) { delete seleccion[id]; return; }
      const n = Math.max(1, Math.min(100, p.stock, Number(seleccion[id]) || 1)); seleccion[id] = n;
      total += p.precio * n;
      const li = document.createElement("li"); li.className = "seleccion-item";
      if (id === ultimoAgregado) { li.classList.add("producto-entra"); }
      const titulo = document.createElement("span"); titulo.textContent = `${p.nombre} — ${precio(p.precio * n)}`;
      const cantidad = document.createElement("input"); cantidad.type = "number"; cantidad.min = "1"; cantidad.max = String(Math.min(100,p.stock)); cantidad.value = String(n); cantidad.setAttribute("aria-label", `Cantidad de ${p.nombre}`);
      cantidad.addEventListener("change", () => { seleccion[id] = Math.max(1, Math.min(100,p.stock, Number(cantidad.value) || 1)); pintar(); });
      const quitar = document.createElement("button"); quitar.type = "button"; quitar.textContent = "Quitar"; quitar.className = "boton secundario";
      quitar.addEventListener("click", () => { delete seleccion[id]; pintar(); });
      li.append(titulo,cantidad,quitar); lista.append(li);
    });
    if (!lista.children.length) { const li = document.createElement("li"); li.textContent = "Todavía no seleccionaste productos."; lista.append(li); }
    document.querySelector("#total-seleccion").textContent = `Total: ${precio(total)}`;
    const circulos = document.querySelector("#bandeja-circulos");
    if (circulos) {
      circulos.replaceChildren();
      let dibujados = 0;
      Object.entries(seleccion).forEach(([id, cantidad]) => {
        const p = productos.find(x => x.id === id);
        if (!p) return;
        for (let i = 0; i < Number(cantidad) && dibujados < 36; i++, dibujados++) {
          const circulo = document.createElement("span");
          circulo.className = `galleta-circulo color-${dibujados % 6}`;
          circulo.textContent = p.nombre;
          circulo.title = `${p.nombre} · Bs ${p.precio.toFixed(2)}`;
          circulos.append(circulo);
        }
      });
      if (!dibujados) {
        const vacio = document.createElement("span");
        vacio.className = "circulos-vacios";
        vacio.textContent = "Tu bandeja está vacía";
        circulos.append(vacio);
      }
      if (Object.values(seleccion).reduce((n, x) => n + Number(x || 0), 0) > 36) {
        const extra = document.createElement("span");
        extra.className = "circulos-extra";
        extra.textContent = `+${Object.values(seleccion).reduce((n, x) => n + Number(x || 0), 0) - 36} unidades`;
        circulos.append(extra);
      }
    }
    const resumen = document.querySelector("#resumen-bandeja-formulario");
    const listaFormulario = document.querySelector("#productos-elegidos-formulario");
    const totalFormulario = document.querySelector("#total-elegido-formulario");
    if (resumen && listaFormulario && totalFormulario) {
      listaFormulario.replaceChildren();
      Object.entries(seleccion).forEach(([id, n]) => {
        const p = productos.find(x => x.id === id); if (!p || Number(n) < 1) return;
        const li = document.createElement("li");
        li.textContent = `${p.nombre} × ${n} — ${precio(p.precio * Number(n))}`;
        listaFormulario.append(li);
      });
      resumen.hidden = Object.keys(seleccion).length === 0;
      totalFormulario.textContent = `Total: ${precio(total)}`;
    }
    const unidades = Object.values(seleccion).reduce((s, n) => s + (Number(n) || 0), 0);
    const contador = document.querySelector("#contador-canasta");
    if (contador) contador.textContent = `${unidades} ${unidades === 1 ? "producto" : "productos"} en tu canasta`;
    ultimoAgregado = "";
    try { localStorage.setItem(CLAVE_SELECCION,JSON.stringify(seleccion)); } catch {}
  }
  productos.forEach(p => {
    const tarjeta = document.createElement("div"); tarjeta.className = "producto-arrastrable"; tarjeta.draggable = Boolean(p.disponible && p.stock > 0);
    tarjeta.dataset.productoId = p.id;
    const titulo = document.createElement("span"); titulo.textContent = `${p.nombre} · ${precio(p.precio)}${!p.disponible || p.stock <= 0 ? " (agotado)" : ""}`;
    const boton = document.createElement("button"); boton.type = "button"; boton.textContent = "Agregar +"; boton.className = "boton secundario"; boton.disabled = !p.disponible || p.stock <= 0;
    boton.addEventListener("click", () => agregar(p.id));
    tarjeta.addEventListener("dragstart", e => { e.dataTransfer.setData("application/x-largucho-producto",p.id); e.dataTransfer.setData("text/plain",p.id); e.dataTransfer.effectAllowed="copy"; tarjeta.classList.add("arrastrando"); });
    tarjeta.addEventListener("dragend", () => { tarjeta.classList.remove("arrastrando"); destino.classList.remove("encima"); });
    tarjeta.append(titulo,boton); catalogo.append(tarjeta);
  });
  const catalogoPrincipal = document.querySelector("#lista-productos");
  catalogoPrincipal?.addEventListener("click", e => {
    const boton = e.target.closest(".agregar-a-bandeja");
    if (!boton) return;
    const tarjeta = boton.closest("[data-producto-id]");
    if (tarjeta) agregar(tarjeta.dataset.productoId);
  });
  catalogoPrincipal?.addEventListener("dragstart", e => {
    const tarjeta = e.target.closest(".tarjeta[data-producto-id]");
    if (!tarjeta || !tarjeta.draggable) return;
    e.dataTransfer.setData("application/x-largucho-producto", tarjeta.dataset.productoId);
    e.dataTransfer.setData("text/plain", tarjeta.dataset.productoId);
    e.dataTransfer.effectAllowed = "copy";
  });
  document.querySelector("#vaciar-seleccion")?.addEventListener("click", () => {
    if (!Object.keys(seleccion).length) { aviso.textContent = "La bandeja ya está vacía."; return; }
    if (!confirm("¿Vaciar todos los productos de tu bandeja?")) return;
    seleccion = {}; pintar(); aviso.textContent = "Bandeja vaciada.";
  });
  document.querySelector("#hacer-pedido-bandeja")?.addEventListener("click", e => {
    if (!Object.keys(seleccion).length) {
      e.preventDefault(); aviso.textContent = "Primero agrega productos a tu bandeja."; return;
    }
    aviso.textContent = "Tus productos se mostrarán en el formulario. Completa tus datos para confirmar.";
  });
  destino.addEventListener("dragover", e => { if (e.dataTransfer.types.includes("application/x-largucho-producto") || e.dataTransfer.types.includes("text/plain")) { e.preventDefault(); e.dataTransfer.dropEffect="copy"; destino.classList.add("encima"); } });
  destino.addEventListener("dragleave", e => { if (!destino.contains(e.relatedTarget)) destino.classList.remove("encima"); });
  destino.addEventListener("drop", e => { const id=e.dataTransfer.getData("application/x-largucho-producto") || e.dataTransfer.getData("text/plain"); if (!id) return; e.preventDefault(); e.stopPropagation(); destino.classList.remove("encima"); agregar(id); });
  window.addEventListener("largucho-bandeja-vaciada", () => { seleccion = {}; pintar(); });
  pintar();
})();
