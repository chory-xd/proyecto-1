#panaderia largucho

**estudiante:** rodrigo mamani mamani

**cliente:** micro empresa de panaderia

**URL publicada:**


##Que resuelve
El sitio web soluciona un problema crítico de control de inventario y previsión de la demanda en la panadería. En ocasiones, clientes casuales o eventuales compran grandes cantidades de pan sin previo aviso, lo que genera desabastecimiento y provoca que los clientes habituales y constantes se queden sin el producto. 

A través de esta plataforma web, se implementa un sistema de reservas anticipadas. Esto permite a los clientes programar sus pedidos con unos días de antelación, garantizando su abastecimiento. Al mismo tiempo, optimiza la producción del horno, permitiendo calcular con precisión la cantidad exacta de pan que se debe hornear cada día para reducir el desperdicio de materia prima y asegurar la frescura del producto. 

##como esta construido

**semantica:**

 El proyecto se estructuró utilizando etiquetas semánticas nativas de HTML para dar un orden jerárquico correcto a la panadería. Se usó `<header>` para la cabecera principal, `<nav>` junto con `<ul>` y `<li>` para estructurar de forma limpia el menú de navegación, `<main>` para agrupar todo el bloque de contenido central, `<section>` para separar las áreas de productos, horarios y formularios de pedidos, `<article>` para aislar de forma independiente cada variedad de pan, `<aside>` para el dato curioso complementario ("¿Sabías?") y `<footer>` con la etiqueta `<address>` para ordenar los datos de contacto y ubicación de la empresa.

**layout:**

La estructura del sitio se organizó combinando técnicas modernas de alineación. En la cabecera (`<header>`) se utilizó CSS Flexbox con la propiedad `justify-content: space-between` para empujar de forma limpia el bloque de navegación hacia la izquierda y el logotipo hacia el extremo derecho. Para la sección de productos (`#productos`), se implementó una rejilla bidimensional con CSS Grid usando `grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr))` y variables personalizadas (`gap: var(--espacio)`), lo que permite que las tarjetas de pan se acomoden automáticamente una al lado de la otra y se adapten de forma completamente responsiva al tamaño de cualquier pantalla.

**diseño:**

Se aplicó una identidad visual cálida y limpia mediante el uso de Custom Properties (Variables CSS). La paleta cromática destaca por un tono dorado principal (`#f1b959`) utilizado para los títulos y enlaces, el cual representa el color del pan artesanal, complementado con un fondo suave de tono crema (`#FAF7F2`) que mejora el contraste y la legibilidad. Los elementos de la lista de productos incorporan bordes redondeados (`border-radius`), un fondo blanco plano y sombras sutiles que generan un efecto moderno de tarjetas flotantes. Además, se integró una línea divisoria dorada debajo del menú para separar visualmente el bloque de presentación de la sección comercial de productos.

##capturas
![escritorio](./captura1.png)
![escritorio](./captura2.png)
![escritorio](./captura3.png)
![escritorio](./captura4.png)



##lo mas dificil
lo mas dificil para mi fue el, entender los diferentes tipos de leguaje de programacion que utilizamos , que yo no lo domino pero pude realizar un sitio web presentable.