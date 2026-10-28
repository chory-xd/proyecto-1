// Menú móvil, acordeón y avisos con jQuery.
$(function () {
  $("#menu-toggle").on("click", function () {
    const abierto = $(this).attr("aria-expanded") === "true";
    $("#menu-movil").stop(true, true).slideToggle(200).toggleClass("abierto", !abierto);
    $(this).attr("aria-expanded", String(!abierto));
  });
  $("#menu-movil a").on("click", function () {
    if (window.matchMedia("(max-width: 600px)").matches) {
      $("#menu-movil").slideUp(150).removeClass("abierto");
      $("#menu-toggle").attr("aria-expanded", "false");
    }
  });

  $("#acordeon").on("click", ".titulo", function () {
    const $titulo = $(this);
    const $cuerpo = $titulo.next(".cuerpo");
    const abrir = $titulo.attr("aria-expanded") !== "true";
    $("#acordeon .cuerpo").not($cuerpo).stop(true, true).slideUp(180).prop("hidden", true);
    $("#acordeon .titulo").not($titulo).attr("aria-expanded", "false");
    if (abrir) $cuerpo.prop("hidden", false).stop(true, true).slideDown(180);
    else $cuerpo.stop(true, true).slideUp(180, () => $cuerpo.prop("hidden", true));
    $titulo.attr("aria-expanded", String(abrir));
  });

  $("#mostrar-avisos").on("click", function () {
    const $avisos = $("#avisos li");
    const visibles = $avisos.filter(":visible").length > 0;
    if (visibles) {
      $avisos.stop(true, true).fadeOut(120);
      $(this).text("Mostrar avisos");
    } else {
      $avisos.each(function (indice) { $(this).stop(true, true).delay(indice * 100).fadeIn(220); });
      $(this).text("Ocultar avisos");
    }
  });
});
