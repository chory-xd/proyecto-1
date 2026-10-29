// Funciones para dibujar las tarjetas de productos en el HTML.
const contenedor = document.querySelector("#lista-productos");

function crearTarjeta(producto) {
  const articulo = document.createElement("article");
  articulo.classList.add("tarjeta");
  if (!producto.disponible || producto.stock <= 0) articulo.classList.add("agotado");
  articulo.dataset.nombre = producto.nombre;
  articulo.dataset.productoId = producto.id;
  articulo.draggable = Boolean(producto.disponible && producto.stock > 0);
  articulo.dataset.categoria = producto.categoria;

  const categoria = document.createElement("span");
  categoria.className = "categoria";
  categoria.textContent = producto.categoria === "panes" ? "Pan" : "Masita";
  const titulo = document.createElement("h3");
  titulo.textContent = producto.nombre;
  const precio = document.createElement("p");
  precio.className = "precio";
  precio.textContent = `Bs ${Number(producto.precio).toFixed(2)}`;
  const stock = document.createElement("p");
  stock.className = "stock";
  stock.textContent = producto.disponible && producto.stock > 0 ? `${producto.stock} en stock` : "Agotado";

  const agregar = document.createElement("button");
  agregar.type = "button";
  agregar.className = "boton secundario agregar-a-bandeja";
  agregar.textContent = producto.disponible && producto.stock > 0 ? "Agregar +" : "Agotado";
  agregar.disabled = !producto.disponible || producto.stock <= 0;
  agregar.setAttribute("aria-label", `Agregar ${producto.nombre} a la bandeja`);
  articulo.append(categoria, titulo, precio, stock, agregar);
  return articulo;
}

function render(lista, destino = contenedor) {
  if (!destino) return;
  destino.replaceChildren();
  if (!lista || lista.length === 0) {
    const vacio = document.createElement("p");
    vacio.className = "sin-resultados";
    vacio.textContent = "No hay productos que coincidan con tu búsqueda.";
    destino.append(vacio);
    return;
  }
  lista.forEach(producto => destino.append(crearTarjeta(producto)));
}

if (contenedor && Array.isArray(productos)) render(productos);
