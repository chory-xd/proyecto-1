# Panadería Largucho — guía breve para exponer el código

Esta guía propone fragmentos que sí existen en el proyecto y explica qué decir al presentarlos. No es necesario memorizar cada línea: lo importante es explicar el propósito, la entrada, el proceso y el resultado.

## 1. Diseño adaptable y temas claro/oscuro (`estilos.css`)

Fragmento representativo:

```css
:root {
  --color-fondo: #e9dcc8;
  --color-superficie: #f5ead8;
  --color-texto: #35251b;
  --color-principal: #b86d36;
}

body.tema-oscuro {
  --color-fondo: #1b1511;
  --color-superficie: #30231c;
  --color-texto: #f4e8d8;
}
```

**Qué explicar:** “Usamos variables CSS para definir una paleta centralizada. Así podemos cambiar los colores de muchas partes del sitio sin editar cada tarjeta por separado. La clase `tema-oscuro` reemplaza los valores para ofrecer un segundo tema.”

También se puede mostrar `@media (max-width: 760px)`: las media queries reorganizan la cabecera, las tarjetas y el formulario para que se adapten a pantallas pequeñas.

## 2. Ilustración del Illimani y teleféricos (`estilos.css` + `imagenes/`)

La cabecera utiliza `background-image` para cargar `imagenes/illimani-teleferico-claro.svg`. Cuando el usuario activa el modo oscuro, una regla de `body.tema-oscuro .encabezado` cambia la ilustración por `illimani-teleferico-oscuro.svg`.

**Qué explicar:** “Separamos la ilustración del contenido HTML porque es decorativa. El título, los enlaces y el botón siguen siendo elementos reales y accesibles. Tenemos dos versiones de la ilustración para conservar el contraste en ambos temas.”

## 3. Datos de productos (`datos.js`)

```js
const productos = [
  { id: "pan-dia", nombre: "Pan del día", precio: 0.8, categoria: "panes", stock: 100, disponible: true },
  { id: "paneton-clasico", nombre: "Panetón clásico", precio: 45, categoria: "masitas", stock: 100, disponible: true, temporada: true },
  { id: "paneton-chocolate", nombre: "Panetón de chocolate", precio: 55, categoria: "masitas", stock: 100, disponible: true, temporada: true }
];
```

**Qué explicar:** “Los productos se representan como objetos dentro de un arreglo. Cada objeto tiene un identificador, nombre, precio, categoría y disponibilidad. El identificador permite reconocer el mismo producto en el catálogo y en la bandeja.”

*Nota:* el fragmento es ilustrativo; para exponer, conviene abrir `datos.js` y mostrar los registros completos que están realmente en el proyecto.

## 4. Renderizado dinámico del catálogo (`render.js`)

El archivo `render.js` obtiene los productos, crea elementos HTML y los inserta dentro del contenedor `#lista-productos`.

**Qué explicar:** “En lugar de escribir una tarjeta HTML por cada producto, generamos las tarjetas a partir de los datos. Si añadimos otro objeto al arreglo, el catálogo puede mostrarlo usando la misma estructura de renderizado.”

## 5. Cálculo y actualización de la bandeja (`tablero.js`)

El tablero escucha los botones de agregar, identifica el producto por su `data-producto-id`, actualiza las cantidades seleccionadas y vuelve a dibujar la bandeja y el total.

**Qué explicar:** “Usamos eventos para detectar la acción del usuario. El identificador del botón nos permite encontrar el producto correcto. Después actualizamos la selección guardada y recalculamos el total según precio por cantidad.”

En este proyecto los panetones se agregan desde la sección de temporada y se excluyen del catálogo genérico del tablero para evitar que aparezcan duplicados.

## 6. Preferencias y almacenamiento local (`preferencias.js`)

```js
const CLAVE = "panaderia:preferencias";
const PREFERENCIAS_POR_DEFECTO = { tema: "claro", orden: "nombre" };
```

**Qué explicar:** “`localStorage` permite conservar ciertas preferencias en el navegador, como el tema elegido y el orden del catálogo. Al volver a abrir la página, el sistema lee esos datos y los aplica. El bloque `try/catch` evita que un dato dañado detenga toda la página.”

## 7. Horarios automáticos (`horarios.js`)

El script consulta la fecha y hora local del navegador, compara el día y la hora con los dos turnos configurados y actualiza el indicador de atención.

**Qué explicar:** “No escribimos manualmente ‘abierto’ o ‘cerrado’. El programa compara la hora actual con los horarios de mañana y tarde y muestra el estado correspondiente. Así el indicador se actualiza según el momento en que la persona visita la página.”

## Guion de cierre para la exposición

“Este proyecto integra HTML para la estructura, CSS para la identidad visual adaptable y JavaScript para la interacción. Los productos se almacenan en estructuras de datos, se muestran dinámicamente y pueden agregarse a una bandeja que calcula el importe. Además, guardamos preferencias en el navegador, mostramos horarios según la hora local y ofrecemos acceso a la ubicación. La idea es que la página no sea solo informativa, sino una herramienta práctica para que los clientes conozcan los productos y preparen su pedido.”

## Recomendaciones antes de exponer

1. Abrir la web con Live Server y probar ambos temas.
2. Agregar un panetón clásico y uno de chocolate; comprobar que aparezcan una sola vez en la bandeja y que el total sea correcto.
3. Probar los filtros del catálogo y el orden por nombre/precio.
4. Probar la página en un ancho móvil y uno de escritorio.
5. Verificar los horarios con el reloj del equipo. El estado depende de la hora local configurada en el dispositivo.
6. Explicar una función por vez: qué recibe, qué hace y qué resultado produce.
