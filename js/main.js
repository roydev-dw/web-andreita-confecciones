//Declaracion de variables
let carrito = [];

const contadorCarrito = document.getElementById('contador-carrito');
const itemsCarrito = document.getElementById('items-carrito');
const modalCarrito = document.getElementById('modal-carrito');
const cerrarCarrito = document.getElementById('cerrar-carrito');
const botonVerificar = document.getElementById('verificar');
const totalCarrito = document.getElementById('total');
const modalCompra = document.getElementById('modal-compra');
const cerrarCompra = document.getElementById('cerrar-compra');

//Funciones
function actualizarContadorCarrito() {
  contadorCarrito.textContent = carrito.length;
};

function guardarCarrito () {
  localStorage.setItem('carrito', JSON.stringify(carrito));
};

function displayCarrito () {
  itemsCarrito.innerHTML = '';
  carrito.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = `${item.nombre} - $${item.precio}`;
    itemsCarrito.appendChild(li);
  });
};

function actualizarTotal() {
  let total = 0;
  for (let i = 0; i < carrito.length; i++) {
    total = total + carrito[i].precio;
  };
  totalCarrito.textContent = `Total: $${total}`;
};

function cargarCarrito () {
  const carritoGuardado = localStorage.getItem('carrito');
  if(carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
    actualizarContadorCarrito();
    actualizarTotal();
  }
}

//Eventos
document.querySelectorAll('.agregar-carrito').forEach((button) => {
  button.addEventListener('click', function (e) {
    e.preventDefault();
    const tarjetaProducto = button.closest('.productos-card');
    const nombreProducto = tarjetaProducto.querySelector('h2').textContent;
    const precioProducto = parseFloat(tarjetaProducto.querySelector('.precio-producto').textContent.replace('$',''));
    const producto = {nombre: nombreProducto, precio: precioProducto};
    carrito.push(producto);
    actualizarContadorCarrito();
    guardarCarrito();
    actualizarTotal();
  });
});

document.querySelector('#icono-carrito').parentElement.addEventListener('click', function(e) {
  e.preventDefault();
  modalCarrito.style.display = 'flex';
  displayCarrito();
  actualizarTotal();
});

cerrarCarrito.addEventListener('click', function() {
  modalCarrito.style.display = 'none';

});

botonVerificar.addEventListener('click', function() {
  modalCompra.style.display = 'flex';
  carrito = [];
  actualizarContadorCarrito();
  guardarCarrito();
  actualizarTotal();
  modalCarrito.style.display = 'none';
});

cerrarCompra.addEventListener('click', function() {
  modalCompra.style.display = 'none';
});

cargarCarrito();