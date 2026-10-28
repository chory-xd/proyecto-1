// Funciones pequeñas que se pueden reutilizar en toda la página.
function totalDeclarada(precio, cantidad) { return precio * cantidad; }
const totalExpresion = function (precio, cantidad) { return precio * cantidad; };
const calcularTotal = (precio, cantidad) => Number(precio) * Number(cantidad);
const doble = n => n * 2;
const aplicarDescuento = (total, porcentaje) => total - total * (porcentaje / 100);
const conImpuesto = (monto, tasa = 13) => monto * (1 + tasa / 100);

function aplicarATodos(lista, fn) {
  const salida = [];
  for (const elemento of lista) salida.push(fn(elemento));
  return salida;
}
function crearContador() {
  let cuenta = 0;
  return () => ++cuenta;
}
const panesVendidos = crearContador();
console.log("Ejemplos de funciones:", calcularTotal(0.8, 10), aplicarDescuento(100, 20), conImpuesto(100).toFixed(2));
console.log("Contador de panes vendidos (demo):", panesVendidos(), panesVendidos());

const PATRONES = {
  telefono: /^[0-9]{7,8}$/,
  correo: /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i,
  ci: /^[0-9]{5,10}(-[0-9A-Za-z]{1,3})?$/
};
console.log("Teléfono de ejemplo válido:", PATRONES.telefono.test("70123456"));
console.log("Correo de ejemplo válido:", PATRONES.correo.test("ana@correo.bo"));
