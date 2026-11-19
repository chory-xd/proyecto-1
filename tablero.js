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
  const widgetPan = document.querySelector("#pan-flotante-widget");
  const botonPanFlotante = document.querySelector("#boton-pan-flotante");
  const badgePanFlotante = document.querySelector("#pan-flotante-badge");
  const burbujaTexto = document.querySelector("#pan-burbuja-texto");
  const linkWhatsapp = document.querySelector("#pan-whatsapp");
  let timerCelebracion = 0;
  let timerBurbuja = 0;

  function animarPanFlotante(mensajeTemporal) {
    if (!widgetPan) return;
    widgetPan.classList.remove("pan-celebra");
    void widgetPan.offsetWidth;
    widgetPan.classList.add("pan-celebra", "burbuja-visible");
    if (mensajeTemporal && burbujaTexto) {
      burbujaTexto.innerHTML = mensajeTemporal;
    }
    window.clearTimeout(timerCelebracion);
    window.clearTimeout(timerBurbuja);
    timerCelebracion = window.setTimeout(() => {
      widgetPan.classList.remove("pan-celebra");
    }, 1100);
    timerBurbuja = window.setTimeout(() => {
      widgetPan.classList.remove("burbuja-visible");
    }, 3400);
  }

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
    animarPanFlotante(`<strong>¡Qué rico! 🥖✨</strong><br>Agregaste <b>${p.nombre}</b> a tu bandeja.`);
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
      const fotos = {
        "pan-dia": "pan-dia", "marraqueta": "marraqueta", "sarnita": "sarnita",
        "empanada-royal": "empanada-royal", "bizcocho": "bizcocho",
        "empanada-queso": "empanada-queso", "chamillo": "chamillo", "cuernitos": "cuernitos",
        "paneton-clasico": "paneton-clasico", "paneton-chocolate": "paneton-chocolate"
      };
      let productosDibujados = 0;
      Object.entries(seleccion).forEach(([id, cantidad]) => {
        const p = productos.find(x => x.id === id);
        if (!p || Number(cantidad) < 1) return;
        const grupo = document.createElement("div");
        grupo.className = `surtido-producto surtido-${id}`;
        grupo.title = `${p.nombre}: ${cantidad} unidad(es)`;
        const circulo = document.createElement("div");
        circulo.className = "galleta-circulo";
        const foto = document.createElement("img");
        foto.src = id === "paneton-clasico"
          ? "https://images.pexels.com/photos/29511942/pexels-photo-29511942.jpeg?auto=compress&cs=tinysrgb&w=300"
          : id === "paneton-chocolate"
            ? "https://images.pexels.com/photos/10530452/pexels-photo-10530452.jpeg?auto=compress&cs=tinysrgb&w=300"
            : `imagenes/${fotos[id] || "pan-dia"}.webp`;
        foto.alt = "";
        foto.loading = "lazy";
        const cantidadBadge = document.createElement("span");
        cantidadBadge.className = "surtido-cantidad";
        cantidadBadge.textContent = String(cantidad);
        circulo.append(foto, cantidadBadge);
        const nombre = document.createElement("span");
        nombre.className = "surtido-nombre";
        nombre.textContent = p.nombre;
        grupo.append(circulo, nombre);
        circulos.append(grupo);
        productosDibujados++;
      });
      if (!productosDibujados) {
        const vacio = document.createElement("span");
        vacio.className = "circulos-vacios";
        vacio.textContent = "Tu surtido aparecerá aquí cuando agregues productos.";
        circulos.append(vacio);
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
    if (badgePanFlotante) {
      badgePanFlotante.hidden = unidades === 0;
      badgePanFlotante.textContent = `${unidades}`;
    }
    if (burbujaTexto && !ultimoAgregado) {
      if (unidades > 0) {
        burbujaTexto.innerHTML = `<strong>¡Tienes ${unidades} ${unidades === 1 ? "pan" : "panes"} en tu bandeja!</strong><br>Total estimado: <b>${precio(total)}</b>. ¿Confirmamos tu pedido?`;
      } else {
        burbujaTexto.innerHTML = `<strong>¡Recién salido del horno! 🥖</strong><br>Arma tu pedido en la bandeja o escríbenos directo.`;
      }
    }
    if (linkWhatsapp) {
      const detalle = Object.entries(seleccion)
        .map(([id, n]) => {
          const p = productos.find(x => x.id === id);
          return p && Number(n) > 0 ? `- ${n}x ${p.nombre} (${precio(p.precio * Number(n))})` : "";
        })
        .filter(Boolean)
        .join("\n");
      const textoWa = detalle
        ? `Hola Panadería Largucho, vengo de su web y quiero hacer este pedido:\n${detalle}\nTotal: ${precio(total)}`
        : "Hola Panadería Largucho, vengo de su web y quiero consultar / hacer un pedido de pan artesanal";
      linkWhatsapp.href = `https://wa.me/59171575507?text=${encodeURIComponent(textoWa)}`;
    }
    ultimoAgregado = "";
    try { localStorage.setItem(CLAVE_SELECCION,JSON.stringify(seleccion)); } catch {}
  }
  productos.forEach(p => {
    if (p.temporada) return; // Los panetones se agregan desde su sección especial.
    const tarjeta = document.createElement("div"); tarjeta.className = "producto-arrastrable"; tarjeta.draggable = Boolean(p.disponible && p.stock > 0);
    tarjeta.dataset.productoId = p.id;
    const fotos = {"pan-dia":"pan-dia","marraqueta":"marraqueta","sarnita":"sarnita","empanada-royal":"empanada-royal","bizcocho":"bizcocho","empanada-queso":"empanada-queso","chamillo":"chamillo","cuernitos":"cuernitos","paneton-clasico":"paneton-clasico","paneton-chocolate":"paneton-chocolate"};
    const miniatura = document.createElement("img"); miniatura.className = "producto-miniatura"; miniatura.src = p.temporada ? `imagenes/${p.id}.svg` : `imagenes/${fotos[p.id] || "pan-dia"}.webp`; miniatura.alt = ""; miniatura.loading = "lazy";
    const titulo = document.createElement("span"); titulo.className = "producto-nombre"; titulo.textContent = `${p.nombre} · ${precio(p.precio)}${!p.disponible || p.stock <= 0 ? " (agotado)" : ""}`;
    const boton = document.createElement("button"); boton.type = "button"; boton.textContent = "Agregar +"; boton.className = "boton secundario"; boton.disabled = !p.disponible || p.stock <= 0;
    boton.addEventListener("click", () => agregar(p.id));
    tarjeta.addEventListener("dragstart", e => { e.dataTransfer.setData("application/x-largucho-producto",p.id); e.dataTransfer.setData("text/plain",p.id); e.dataTransfer.effectAllowed="copy"; tarjeta.classList.add("arrastrando"); });
    tarjeta.addEventListener("dragend", () => { tarjeta.classList.remove("arrastrando"); destino.classList.remove("encima"); });
    tarjeta.append(miniatura,titulo,boton); catalogo.append(tarjeta);
  });
  const catalogoPrincipal = document.querySelector("#lista-productos");
  catalogoPrincipal?.addEventListener("click", e => {
    const boton = e.target.closest(".agregar-a-bandeja");
    if (!boton) return;
    const tarjeta = boton.closest("[data-producto-id]");
    if (tarjeta) agregar(tarjeta.dataset.productoId);
  });
  document.querySelector("#productos-temporada")?.addEventListener("click", e => {
    const boton = e.target.closest(".agregar-temporada");
    if (!boton) return;
    const id = boton.dataset.productoId || boton.closest("[data-producto-id]")?.dataset.productoId;
    if (id) agregar(id);
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
  widgetPan?.addEventListener("mouseleave", () => {
    widgetPan.classList.remove("burbuja-visible");
  });
  botonPanFlotante?.addEventListener("click", () => {
    animarPanFlotante();
    const form = document.querySelector("#form-pedido");
    if (form) {
      form.classList.add("resaltado-pedido");
      window.setTimeout(() => form.classList.remove("resaltado-pedido"), 1400);
    }
  });
  document.querySelector("#pan-burbuja-cerrar")?.addEventListener("click", e => {
    e.stopPropagation();
    widgetPan?.classList.remove("burbuja-visible");
  });
  document.querySelector("#pan-ir-pedido")?.addEventListener("click", () => {
    widgetPan?.classList.remove("burbuja-visible");
    animarPanFlotante();
  });
  pintar();
})();
