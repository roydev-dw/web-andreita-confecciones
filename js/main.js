/* Declaración de variables */

let productos = [];
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
const formularioNoticias = document.getElementById('formulario-noticias');

/* Funciones */

async function obtenerProductos() {
  try {
    const response = await fetch('https://run.mocky.io/v3/65980541-56f7-47d5-b688-faf251c8932f');
    if (!response.ok) {
      throw new Error('Error al cargar los productos. Codigo de respuesta: ' + response.status);
    }
    productos = await response.json();
    mostrarProductos();
  } catch (error) {
    mostrarError(error.message);
  }
}

function mostrarError(mensaje) {
  Swal.fire({
    icon: 'error',
    title: '¡Error!',
    text: 'Ha ocurrido un error inesperado. Por favor, intenta de nuevo más tarde. ' + mensaje,
    confirmButtonText: 'Aceptar',
  });
}

function mostrarProductos() {
  contenedorProductos.innerHTML = '';

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
    boton.addEventListener('click', function (e) {
      e.preventDefault();
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
        notificacionAgregar();
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
    const fila = document.getElementById(`item-${item.id}`)
    if (fila) {
      fila.querySelector('.cantidad-input').value = item.cantidad;
    } else {
      itemsCarrito.innerHTML += ` 
      <tr id="item-${item.id}" class="carrito-item">
        <td><img src="${item.imagen}" alt="${item.nombre}"></td>
        <td>${item.id}</td>
        <td>${item.nombre}</td>
        <td>$${item.precio.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
        <td class="contenedor-botones">
          <button class="quitar-cantidad" data-id="${item.id}">-</button>
          <input type="text" min="1" class="cantidad-input" id="cantidad-${item.id}" value="${item.cantidad}">
          <button class="agregar-cantidad" data-id="${item.id}">+</button>
          <button class="eliminar-producto" data-id="${item.id}">Eliminar</button>
        </td>
      </tr>
    `;
    }
  });

  document.querySelectorAll('.cantidad-input').forEach(input => {
    input.addEventListener('change', function (e) {
      e.preventDefault();
      const id = parseInt(this.id.split('-')[1]);
      const nuevaCantidad = parseInt(this.value);
      actualizarCantidad(id, nuevaCantidad);
    });
  });

  document.querySelectorAll('.quitar-cantidad').forEach(boton => {
    boton.addEventListener('click', function (e) {
      e.preventDefault();
      const id = parseInt(this.getAttribute('data-id'));
      quitarCantidad(id);
    });
  });

  document.querySelectorAll('.agregar-cantidad').forEach(boton => {
    boton.addEventListener('click', function (e) {
      e.preventDefault();
      const id = parseInt(this.getAttribute('data-id'));
      agregarCantidad(id);
    });
  });

  document.querySelectorAll('.eliminar-producto').forEach(boton => {
    boton.addEventListener('click', function (e) {
      e.preventDefault();
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
  const totalFormateado = total.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  totalCarrito.textContent = `Total: $${totalFormateado}`;
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

function notificacionAgregar() {
  Swal.fire({
    icon: 'success',
    text: 'Agregado al carrito.',
    showConfirmButton: false,
    timer: 1500,
    width: '400px',
    customClass: {
      icon: 'icono-sweet'
    },
    showClass: {
      popup: `
        animate__animated
        animate__tada
      `
    },
    hideClass: {
      popup: `
        animate__animated
        animate__fadeOut
      `
    }
  });
};

function notificacionSuscripcion() {
  Swal.fire({
    icon: 'success',
    text: 'Se ha suscrito con exito.',
    showConfirmButton: false,
    timer: 1500,
    width: '400px',
    customClass: {
      icon: 'icono-sweet'
    },
    showClass: {
      popup: `
        animate__animated
        animate__tada
      `
    },
    hideClass: {
      popup: `
        animate__animated
        animate__fadeOut
      `
    }
  });
};

function mostrarFormularioNoticias() {
  formularioNoticias.innerHTML = `
      <p>Recibe nuestro boletin informativo, con noticias, descuentos, tips y demás.</p>
      <div class="cont-entrada">
        <i class="bi bi-envelope-at-fill"></i>
        <input type="email" name="" value="" placeholder="Ingresa tu correo electrónico" required>
        <button type="submit" name="boton">Suscríbete</button>
      </div>
  `;

  document.querySelector('.formulario-noticias').addEventListener('submit', (e) => {
    e.preventDefault();
    notificacionSuscripcion();
    e.target.reset();
  });
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

obtenerProductos();
cargarCarrito();
mostrarFormularioNoticias();