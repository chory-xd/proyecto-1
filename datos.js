// Catálogo local: no necesita conexión a Internet.
const negocio = {
  nombre: "Panadería Largucho",
  anioFundacion: 2018,
  telefono: "71575507"
};

const anioFundacion = negocio.anioFundacion;
const panesEnVitrina = 350;
let panesEnHorno = 350;
let empanadasEnStock = 96;

const productos = [
  { id: "pan-dia", nombre: "Pan del día", precio: 0.8, categoria: "panes", stock: 400, disponible: true, unidad: "unidad" },
  { id: "marraqueta", nombre: "Pan marraqueta", precio: 0.8, categoria: "panes", stock: 250, disponible: true, unidad: "unidad" },
  { id: "sarnita", nombre: "Pan sarnita", precio: 0.8, categoria: "panes", stock: 80, disponible: true, unidad: "unidad" },
  { id: "empanada-royal", nombre: "Empanada de royal", precio: 1.5, categoria: "masitas", stock: 0, disponible: false, unidad: "unidad" },
  { id: "bizcocho", nombre: "Bizcocho", precio: 5, categoria: "masitas", stock: 30, disponible: true, unidad: "unidad" },
  { id: "empanada-queso", nombre: "Empanada de queso", precio: 1, categoria: "masitas", stock: 2, disponible: true, unidad: "unidad" },
  { id: "chamillo", nombre: "Chamillo", precio: 0.8, categoria: "panes", stock: 50, disponible: true, unidad: "unidad" },
  { id: "cuernitos", nombre: "Cuernitos", precio: 0.8, categoria: "masitas", stock: 0, disponible: false, unidad: "unidad" }
];

console.log("Tipos:", typeof negocio, typeof productos, typeof productos[0].precio);
console.log("Negocio:", `${negocio.nombre} abrió en ${anioFundacion}; quedan ${empanadasEnStock} empanadas.`);
console.log('"0.8" == 0.8:', "0.8" == productos[0].precio);
console.log('"0.8" === 0.8:', "0.8" === productos[0].precio);

const panDelDia = productos[0];
const propiedad = "precio";
console.log("Precio del pan:", panDelDia[propiedad]);
const { nombre: nombrePan, precio: precioPan } = panDelDia;
console.log(`${nombrePan} cuesta Bs ${precioPan}`);

const panDeAyer = { ...panDelDia, nombre: "Pan de ayer", precio: 0.5 };
console.log("Ejemplo de copia de producto:", panDeAyer);

const nombresProductos = productos.map(p => p.nombre);
const productosDisponibles = productos.filter(p => p.disponible);
console.log("Productos disponibles:", productosDisponibles.length, "de", productos.length);
console.log("Primer producto sobre Bs 1:", productos.find(p => p.precio > 1));
console.log("¿Hay productos agotados?", productos.some(p => p.stock === 0));
console.log("¿Todos tienen precio positivo?", productos.every(p => p.precio > 0));
console.log("Valor del inventario: Bs", productos.reduce((total, p) => total + p.precio * p.stock, 0).toFixed(2));

class Producto {
  constructor(nombre, precio, stock) {
    this.nombre = nombre;
    this.precio = precio;
    this.stock = stock;
  }
  estaDisponible() { return this.stock > 0; }
  valorEnStock() { return this.precio * this.stock; }
}
class ProductoConDescuento extends Producto {
  constructor(nombre, precio, stock, descuento) {
    super(nombre, precio, stock);
    this.descuento = descuento;
  }
  precioFinal() { return this.precio * (1 - this.descuento / 100); }
}
const rosquete = new ProductoConDescuento("Rosquete", 1, 20, 25);
console.log("Ejemplo de clase:", rosquete.nombre, rosquete.precioFinal(), rosquete.estaDisponible());
