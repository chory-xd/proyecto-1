PANADERÍA LARGUCHO — PROYECTO LOCAL
===================================

ARCHIVOS
- index.html: estructura de la página.
- estilos.css: diseño adaptable.
- datos.js: catálogo y ejemplos de JavaScript.
- render.js: tarjetas de productos.
- funciones.js: funciones, cálculos, validaciones y ejemplos.
- app.js: formulario, total y guardado local de pedidos.
- eventos.js: buscador y filtros.
- jquery-comparado.js: demostración Vanilla JS / jQuery.
- jquery-panel.js: menú, acordeón y avisos.
- remoto.js: demostración Fetch y jQuery AJAX.
- datos.json: catálogo para las demostraciones de Fetch y $.getJSON.
- jquery-3.7.1.min.js: debes copiar aquí la biblioteca jQuery 3.7.1 descargada previamente.
- logo.png y panadero.jpg.jpeg: tus imágenes locales (opcionales).

IMPORTANTE SOBRE JQUERY
Este ZIP no incluye la biblioteca jquery-3.7.1.min.js porque no se proporcionó el archivo original.
Copia jquery-3.7.1.min.js a esta carpeta para que funcionen las demostraciones jQuery.
Puedes abrir la página principal sin esa biblioteca, pero las funciones jQuery no funcionarán hasta agregarla.

CÓMO PROBAR LA PÁGINA PRINCIPAL SIN INTERNET
1. Coloca todos los archivos en una sola carpeta.
2. Copia las imágenes logo.png y panadero.jpg.jpeg si las tienes.
3. Para la página y los productos locales, abre index.html con doble clic.
4. Los pedidos se guardan en localStorage de ese navegador/equipo. No se envían a ningún negocio ni a Internet.

CÓMO PROBAR FETCH Y JSON SIN INTERNET
La API fetch y $.getJSON suelen bloquear la lectura de datos.json al abrir el HTML con file://.
Necesitas un servidor local; no necesita Internet.
Si tienes Python instalado:
- Abre CMD o la terminal dentro de esta carpeta.
- Ejecuta: python -m http.server 8000
- Abre: http://localhost:8000
En Windows, si el comando anterior no funciona, prueba: py -m http.server 8000
Mantén abierta la terminal mientras pruebas la página.

PEDIDOS
El formulario guarda pedidos solo en el navegador local. Para enviar pedidos automáticamente a un teléfono, correo o sistema externo se requiere integrar un servicio o servidor; eso no se puede lograr solo con HTML y JavaScript sin una vía de envío.

DATOS
Revisa los precios, el stock, horarios, dirección y teléfono antes de publicar el sitio.
