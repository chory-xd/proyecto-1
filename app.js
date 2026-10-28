// Funciones generales de la página y formulario de pedidos.
document.addEventListener("DOMContentLoaded", () => {
  const subtitulo = document.querySelector(".subtitulo");
  if (subtitulo) subtitulo.textContent = `Recién horneado, hecho con cariño desde ${anioFundacion}.`;

  const selectProducto = document.querySelector("#producto");
  const fecha = document.querySelector("#fecha");
  const form = document.querySelector("#form-pedido");
  const cantidad = document.querySelector("#cantidad");
  const total = document.querySelector("#total-pedido");
  const mensaje = document.querySelector("#mensaje-pedido");

  function fechaActual() {
    const hoy = new Date();
    return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-${String(hoy.getDate()).padStart(2, "0")}`;
  }
  const fechaLocal = fechaActual();
  if (fecha) { fecha.min = fechaLocal; fecha.value = fechaLocal; }

  if (selectProducto) {
    productos.forEach(p => {
      const option = document.createElement("option");
      option.value = p.id;
      option.textContent = `${p.nombre} — Bs ${p.precio.toFixed(2)}${p.disponible && p.stock > 0 ? "" : " (agotado)"}`;
      option.disabled = !p.disponible || p.stock <= 0;
      selectProducto.append(option);
    });
  }

  function actualizarTotal() {
    const producto = productos.find(p => p.id === selectProducto.value);
    const unidades = Number(cantidad.value) || 0;
    total.textContent = `Bs ${producto ? calcularTotal(producto.precio, unidades).toFixed(2).replace(".", ",") : "0,00"}`;
  }
  selectProducto?.addEventListener("change", actualizarTotal);
  cantidad?.addEventListener("input", actualizarTotal);

  function obtenerPedidos() {
    try { const datos = JSON.parse(localStorage.getItem("largucho-pedidos") || "[]"); return Array.isArray(datos) ? datos : []; }
    catch { return []; }
  }
  function actualizarContador() {
    const pedidos = obtenerPedidos();
    const contador = document.querySelector("#contador-pedidos");
    if (contador) contador.textContent = pedidos.length ? `${pedidos.length} pedido(s) guardado(s) en este navegador.` : "Todavía no hay pedidos guardados.";
    const tabla = document.querySelector("#lista-pedidos");
    if (!tabla) return;
    tabla.replaceChildren();
    if (!pedidos.length) {
      const fila = tabla.insertRow(); const celda = fila.insertCell();
      celda.colSpan = 7; celda.textContent = "Todavía no hay pedidos guardados.";
      return;
    }
    pedidos.forEach((pedido, indice) => {
      const fila = tabla.insertRow();
      [pedido.nombre, pedido.telefono, pedido.productoNombre || pedido.producto,
       pedido.cantidad, `Bs ${Number(pedido.total || 0).toFixed(2).replace(".", ",")}`,
       pedido.fecha].forEach(valor => { const celda = fila.insertCell(); celda.textContent = valor ?? ""; });
      const celdaAccion = fila.insertCell();
      const boton = document.createElement("button");
      boton.type = "button"; boton.className = "boton peligro boton-borrar-fila";
      boton.textContent = "Eliminar"; boton.dataset.indice = String(indice);
      boton.setAttribute("aria-label", `Eliminar pedido de ${pedido.nombre || "cliente"}`);
      celdaAccion.append(boton);
    });
  }
  actualizarContador();
  document.querySelector("#lista-pedidos")?.addEventListener("click", event => {
    const boton = event.target.closest("button[data-indice]");
    if (!boton) return;
    const indice = Number(boton.dataset.indice);
    const pedidos = obtenerPedidos();
    if (!Number.isInteger(indice) || indice < 0 || indice >= pedidos.length) return;
    if (!confirm(`¿Eliminar el pedido de ${pedidos[indice].nombre || "este cliente"}?`)) return;
    pedidos.splice(indice, 1);
    try {
      localStorage.setItem("largucho-pedidos", JSON.stringify(pedidos));
      actualizarContador();
      mensaje.className = "mensaje ok"; mensaje.textContent = "Pedido eliminado correctamente.";
    } catch {
      mensaje.className = "mensaje error"; mensaje.textContent = "No se pudo eliminar el pedido.";
    }
  });

  form?.addEventListener("submit", event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const fechaHoy = fechaActual();
    fecha.min = fechaHoy;
    if (fecha.value < fechaHoy) {
      fecha.setCustomValidity("La fecha de entrega no puede ser anterior a hoy.");
      fecha.reportValidity();
      return;
    }
    fecha.setCustomValidity("");
    const datos = Object.fromEntries(new FormData(form).entries());
    const producto = productos.find(p => p.id === datos.producto);
    if (!producto) return;
    datos.productoNombre = producto.nombre;
    datos.precioUnitario = producto.precio;
    datos.total = calcularTotal(producto.precio, Number(datos.cantidad));
    datos.creado = new Date().toLocaleString();
    const pedidos = obtenerPedidos();
    pedidos.push(datos);
    try {
      localStorage.setItem("largucho-pedidos", JSON.stringify(pedidos));
      mensaje.className = "mensaje ok";
      mensaje.textContent = `Gracias ${datos.nombre}. El pedido se guardó en este equipo. Recuerda confirmarlo por teléfono.`;
      form.reset();
      fecha.min = fechaActual();
      fecha.value = fecha.min;
      cantidad.value = "1";
      actualizarTotal();
      actualizarContador();
    } catch {
      mensaje.className = "mensaje error";
      mensaje.textContent = "No se pudo guardar en este navegador. Comprueba el espacio disponible o ejecuta la página con un servidor local.";
    }
  });
  fecha?.addEventListener("input", () => fecha.setCustomValidity(""));

  document.querySelector("#copiar-pedidos")?.addEventListener("click", async () => {
    const pedidos = obtenerPedidos();
    if (!pedidos.length) { mensaje.className = "mensaje error"; mensaje.textContent = "No hay pedidos guardados para copiar."; return; }
    const texto = pedidos.map((p, i) => `${i + 1}. ${p.nombre} | ${p.telefono} | ${p.productoNombre} x${p.cantidad} | Total Bs ${Number(p.total).toFixed(2)} | Entrega: ${p.fecha}${p.notas ? " | " + p.notas : ""}`).join("\n");
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(texto);
      else {
        const area = document.createElement("textarea"); area.value = texto; document.body.append(area); area.select();
        const copiado = document.execCommand("copy"); area.remove();
        if (!copiado) throw new Error("copia no disponible");
      }
      mensaje.className = "mensaje ok"; mensaje.textContent = "Pedidos copiados. Ya puedes pegarlos en tu mensaje.";
    } catch {
      window.prompt("Copia manualmente los pedidos:", texto);
    }
  });
  document.querySelector("#borrar-pedidos")?.addEventListener("click", () => {
    if (!obtenerPedidos().length) { mensaje.textContent = "No hay pedidos para borrar."; return; }
    if (confirm("¿Seguro que deseas borrar los pedidos guardados en este equipo?")) {
      localStorage.removeItem("largucho-pedidos"); actualizarContador();
      mensaje.className = "mensaje ok"; mensaje.textContent = "Se borraron los pedidos guardados en este navegador.";
    }
  });
});
