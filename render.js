// Funciones para dibujar las tarjetas de productos en el HTML.
const contenedor = document.querySelector("#lista-productos");

function crearTarjeta(producto) {
  const articulo = document.createElement("article");
  articulo.classList.add("tarjeta");
  if (!producto.disponible || producto.stock <= 0) articulo.classList.add("agotado");
  articulo.dataset.nombre = producto.nombre;
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

  articulo.append(categoria, titulo, precio, stock);
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
