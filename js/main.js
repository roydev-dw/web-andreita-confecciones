const productos = [
  {
    id: 1,
    nombre: "Delantal perritos y flores 1",
    descripcion: "¡Combina estilo y ternura con este delantal de perritos y flores!",
    precio: 9990,
    imagen: "./assets/productos/delantal-uno.webp",
  },
  {
    id: 2,
    nombre: "Delantal perritos y flores 2",
    descripcion: "¡Combina estilo y ternura con este delantal de perritos y flores!",
    precio: 9990,
    imagen: "./assets/productos/delantal-uno.webp",
  },
  {
    id: 3,
    nombre: "Delantal perritos y flores 3",
    descripcion: "¡Combina estilo y ternura con este delantal de perritos y flores!",
    precio: 9990,
    imagen: "./assets/productos/delantal-uno.webp",
  },
  {
    id: 4,
    nombre: "Delantal perritos y flores 4",
    descripcion: "¡Combina estilo y ternura con este delantal de perritos y flores!",
    precio: 9990,
    imagen: "./assets/productos/delantal-uno.webp",
  },
  {
    id: 5,
    nombre: "Delantal perritos y flores 5",
    descripcion: "¡Combina estilo y ternura con este delantal de perritos y flores!",
    precio: 9990,
    imagen: "./assets/productos/delantal-uno.webp",
  },
  {
    id: 6,
    nombre: "Delantal perritos y flores 6",
    descripcion: "¡Combina estilo y ternura con este delantal de perritos y flores!",
    precio: 9990,
    imagen: "./assets/productos/delantal-uno.webp",
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

function mostarProductos() {
  productos.forEach(({ id, nombre, descripcion, precio, imagen }) => {
    contenedorProductos.innerHTML += `
      <div class="productos-card" id="producto-${id}">
        <img src="${imagen}" alt="${nombre}">
        <div class="productos-card-texto">
          <h2 class="nombre-producto">${nombre}</h2>
          <p class="descripcion-producto">${descripcion}</p>
          <p class="precio-producto">$${precio}</p>
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