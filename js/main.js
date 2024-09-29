/* Declaración de variables */

const productos = [
  {
    id: 1,
    nombre: "Delantal perritos y flores",
    descripcion: "¡Combina estilo y ternura con este delantal de perritos y flores!",
    precio: 17990,
    imagen: "./assets/productos/delantal-uno.webp",
  },
  {
    id: 2,
    nombre: "Bandana Rosada",
    descripcion: "Una bandana rosada ideal para darle un toque chic a tu look.",
    precio: 6990,
    imagen: "./assets/productos/bandana-rosada.webp",
  },
  {
    id: 3,
    nombre: "Delantal Gatos",
    descripcion: "Delantal divertido con estampado de gatos, perfecto para los amantes de los felinos.",
    precio: 16990,
    imagen: "./assets/productos/delantal-gatos.webp",
  },
  {
    id: 4,
    nombre: "Delantal Mariposas",
    descripcion: "Este delantal con mariposas es perfecto para cocinar con estilo y elegancia.",
    precio: 13990,
    imagen: "./assets/productos/delantal-mariposas.webp",
  },
  {
    id: 5,
    nombre: "Polerón Rosado",
    descripcion: "Polerón suave y cómodo, ideal para mantenerte abrigado y a la moda.",
    precio: 24990,
    imagen: "./assets/productos/poleron-rosado.webp",
  },
  {
    id: 6,
    nombre: "Coquettes Animal Print",
    descripcion: "Un par de coquettes con estampado animal print, perfectos para un look moderno.",
    precio: 9990,
    imagen: "./assets/productos/coquette-animalprint.webp",
  }
];


let carrito = [];
const contenedorProductos = document.getElementById('cont-productos-card');
const contadorCarrito = document.getElementById('contador-carrito');
const itemsCarrito = document.getElementById('items-carrito');
const modalCarrito = document.getElementById('modal-carrito');
const cerrarCarrito = document.getElementById('cerrar-carrito');
const botonVerificar = document.getElementById('verificar');
const totalCarrito = document.getElementById('total');
const modalCompra = document.getElementById('modal-compra');
const cerrarCompra = document.getElementById('cerrar-compra');

/* Funciones */

function mostarProductos() {
  productos.forEach(({ id, nombre, descripcion, precio, imagen }) => {
    contenedorProductos.innerHTML += `
      <div class="productos-card" id="producto-${id}">
        <img src="${imagen}" alt="${nombre}">
        <div class="productos-card-texto">
          <h2 class="nombre-producto">${nombre}</h2>
          <p class="descripcion-producto">${descripcion}</p>
          <p class="precio-producto">$${precio.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
        </div>
        <div class="productos-card-btn">
          <button class="agregar-carrito" id="${id}">Agregar al carrito</button>
        </div>
      </div>
    `;
  });

  const botonAgregar = document.querySelectorAll('.agregar-carrito');

  botonAgregar.forEach(boton => {
    boton.addEventListener('click', function () {
      const idProducto = parseInt(this.id);
      const producto = productos.find(producto => producto.id === idProducto);

      if (producto) {
        const productoEnCarrito = carrito.find(item => item.id === producto.id);
        if (productoEnCarrito) {
          productoEnCarrito.cantidad++;
        } else {
          carrito.push({ ...producto, cantidad: 1 });
        }

        actualizarContadorCarrito();
        guardarCarrito();
        mostrarNotificacion();
      }
    });
  });
}

function agregarAlCarrito(producto) {
  const productoEnCarrito = carrito.find(item => item.id === producto.id);

  if (productoEnCarrito) {
    productoEnCarrito.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  actualizarContadorCarrito();
  guardarCarrito();
  displayCarrito();
  actualizarTotal();
}

function eliminarProducto(id) {
  carrito = carrito.filter(item => item.id !== id);
  guardarCarrito();
  displayCarrito();
  actualizarTotal();
  actualizarContadorCarrito();
}

function displayCarrito() {
  itemsCarrito.innerHTML = '';

  carrito.forEach((item) => {
    itemsCarrito.innerHTML += `
      <tr id="item-${item.id}" class="carrito-item">
        <td><img src="${item.imagen}" alt="${item.nombre}"></td>
        <td>${item.id}</td>
        <td>${item.nombre}</td>
        <td>$${item.precio}</td>
        <td class="contenedor-botones">
          <button class="quitar-cantidad" data-id="${item.id}">-</button>
          <input type="text" min="1" class="cantidad-input" id="cantidad-${item.id}" value="${item.cantidad}">
          <button class="agregar-cantidad" data-id="${item.id}">+</button>
          <button class="eliminar-producto" data-id="${item.id}">Eliminar</button>
        </td>
      </tr>
    `;
  });

  document.querySelectorAll('.cantidad-input').forEach(input => {
    input.addEventListener('change', function () {
      const id = parseInt(this.id.split('-')[1]);
      const nuevaCantidad = parseInt(this.value);
      actualizarCantidad(id, nuevaCantidad);
    });
  });

  document.querySelectorAll('.quitar-cantidad').forEach(boton => {
    boton.addEventListener('click', function () {
      const id = parseInt(this.getAttribute('data-id'));
      quitarCantidad(id);
    });
  });

  document.querySelectorAll('.agregar-cantidad').forEach(boton => {
    boton.addEventListener('click', function () {
      const id = parseInt(this.getAttribute('data-id'));
      agregarCantidad(id);
    });
  });

  document.querySelectorAll('.eliminar-producto').forEach(boton => {
    boton.addEventListener('click', function () {
      const id = parseInt(this.getAttribute('data-id'));
      eliminarProducto(id);
    });
  });

  actualizarContadorCarrito();
  actualizarTotal();
}

function actualizarCantidad(id, nuevaCantidad) {
  const productoEnCarrito = carrito.find(item => item.id === id);

  if (productoEnCarrito) {
    const cantidadActualizada = Math.max(1, nuevaCantidad);
    productoEnCarrito.cantidad = cantidadActualizada;

    actualizarContadorCarrito();
    actualizarTotal();
    guardarCarrito();
    displayCarrito();
  }
}

function agregarCantidad(id) {
  const productoEnCarrito = carrito.find(item => item.id === id);

  if (productoEnCarrito) {
    productoEnCarrito.cantidad += 1;
    actualizarContadorCarrito();
    guardarCarrito();
    displayCarrito();
    actualizarTotal();
  }
}

function quitarCantidad(id) {
  const productoEnCarrito = carrito.find(item => item.id === id);

  if (productoEnCarrito && productoEnCarrito.cantidad > 1) {
    productoEnCarrito.cantidad -= 1;

    actualizarContadorCarrito();
    guardarCarrito();
    displayCarrito();
    actualizarTotal();
  }
}

function actualizarTotal() {
  const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  totalCarrito.textContent = `Total: $${total}`;
}

function actualizarContadorCarrito() {
  const totalProductos = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  contadorCarrito.textContent = totalProductos;
}

function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function cargarCarrito() {
  const carritoGuardado = localStorage.getItem('carrito');
  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
    actualizarContadorCarrito();
    actualizarTotal();
    displayCarrito();
  }
}

function mostrarNotificacion() {
  const modalAgregado = document.getElementById('modal-agregado-carrito');
  modalAgregado.style.display = 'block';
  modalAgregado.style.opacity = '1';

  setTimeout(function () {
    modalAgregado.style.opacity = '0';
    setTimeout(() => {
      modalAgregado.style.display = 'none';
      modalAgregado.style.opacity = '1';
    }, 1000);
  }, 1500);
}

/* Eventos */

document.querySelector('#icono-carrito').parentElement.addEventListener('click', (e) => {
  e.preventDefault();
  modalCarrito.style.display = 'flex';
  displayCarrito();
  actualizarTotal();
});

cerrarCarrito.addEventListener('click', () => {
  modalCarrito.style.display = 'none';
});

botonVerificar.addEventListener('click', () => {
  modalCompra.style.display = 'flex';
  carrito = [];
  actualizarContadorCarrito();
  guardarCarrito();
  actualizarTotal();
  modalCarrito.style.display = 'none';
});

cerrarCompra.addEventListener('click', () => {
  modalCompra.style.display = 'none';
});

document.querySelector('.formulario-noticias').addEventListener('submit', (e) => {
  e.preventDefault();
  const modalSuscripcion = document.getElementById('modal-suscripcion');

  modalSuscripcion.style.display = 'block';

  setTimeout(() => {
    modalSuscripcion.style.opacity = '0';
    setTimeout(() => {
      modalSuscripcion.style.display = 'none';
      modalSuscripcion.style.opacity = '1';
    }, 1000);
  }, 1500);

  e.target.reset();
});

mostarProductos();
cargarCarrito();