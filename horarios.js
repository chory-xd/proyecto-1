// Estado automático de atención de Panadería Largucho (hora local del dispositivo).
document.addEventListener("DOMContentLoaded", () => {
  const estado = document.querySelector("#estado-horario");
  if (!estado) return;

  function actualizarEstado() {
    const ahora = new Date();
    const dia = ahora.getDay(); // 0 domingo ... 6 sábado
    const minutos = ahora.getHours() * 60 + ahora.getMinutes();
    const diaAtencion = dia >= 0 && dia <= 5;
    const turnoManana = minutos >= 7 * 60 && minutos < 9 * 60;
    const turnoTarde = minutos >= 16 * 60 && minutos < 18 * 60;
    const abierto = diaAtencion && (turnoManana || turnoTarde);

    estado.textContent = abierto ? "● ABIERTO AHORA" : "● CERRADO AHORA";
    estado.classList.toggle("abierto", abierto);
    estado.classList.toggle("cerrado", !abierto);
    estado.setAttribute("aria-label", abierto
      ? "La panadería está abierta en este momento"
      : "La panadería está cerrada en este momento");
  }

  actualizarEstado();
  window.setInterval(actualizarEstado, 60000);
});
