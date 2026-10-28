// Comparación entre JavaScript normal (Vanilla) y jQuery.
$(function () {
  console.log("jQuery versión:", $.fn.jquery);
  const vanillaP = document.querySelector("#salida-vanilla");
  const jqueryP = $("#salida-jquery");
  if (!vanillaP || !jqueryP.length) return;

  console.log("vanilla es elemento:", vanillaP instanceof HTMLElement);
  console.log("jQuery encuentra:", jqueryP.length, "elemento(s)");
  vanillaP.textContent = "Cambiado con vanilla: querySelector + textContent";
  jqueryP.text("Cambiado con jQuery: $() + .text()");

  $("#boton-vanilla").on("click", () => vanillaP.classList.toggle("resaltado"));
  $("#boton-jquery").on("click", function () {
    $(this).closest(".panel").find("#salida-jquery").toggleClass("resaltado");
  });
  $("#salida-jquery").addClass("destacado").attr("data-origen", "jquery").css("cursor", "pointer");
  vanillaP.classList.add("destacado");
  vanillaP.dataset.origen = "vanilla";
  vanillaP.style.cursor = "pointer";
  console.log("Tarjetas jQuery:", $(".tarjeta").length);
  console.log("Tarjetas vanilla:", document.querySelectorAll(".tarjeta").length);
});
