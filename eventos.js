// Buscador y filtros del catálogo.
document.addEventListener("DOMContentLoaded", () => {
  const buscador = document.querySelector("#buscador");
  const filtros = document.querySelector("#filtros");
  const resultado = document.querySelector("#resultado");
  let categoriaActiva = "todos";
  let textoBuscado = "";

  function actualizar() {
    const visibles = productos
      .filter(p => categoriaActiva === "todos" || p.categoria === categoriaActiva)
      .filter(p => p.nombre.toLocaleLowerCase("es").includes(textoBuscado.toLocaleLowerCase("es")));
    const orden = document.querySelector("#orden")?.value || "nombre";
    visibles.sort((a,b) => orden === "precio-asc" ? Number(a.precio)-Number(b.precio) : orden === "precio-desc" ? Number(b.precio)-Number(a.precio) : a.nombre.localeCompare(b.nombre, "es"));
    render(visibles);
    if (resultado) resultado.textContent = `${visibles.length} de ${productos.length} productos`;
  }
  actualizar();
  document.addEventListener("largucho:orden", actualizar);

  buscador?.addEventListener("input", event => { textoBuscado = event.target.value.trim(); actualizar(); });
  filtros?.addEventListener("click", event => {
    const boton = event.target.closest("button[data-categoria]");
    if (!boton) return;
    categoriaActiva = boton.dataset.categoria;
    filtros.querySelectorAll("button").forEach(b => b.classList.toggle("activo", b === boton));
    actualizar();
  });
});
