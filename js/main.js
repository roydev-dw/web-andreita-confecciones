/* Declaración de variables */
const TASA_IVA = 0.19;
let productos = [];
let carrito = [];

const contenedorProductos = document.getElementById('cont-productos-card');
const contadorCarrito = document.getElementById('contador-carrito');
const itemsCarrito = document.getElementById('items-carrito');
const modalCarrito = document.getElementById('modal-carrito');
const cerrarCarrito = document.getElementById('cerrar-carrito');
const botonContinuar = document.getElementById('boton-continuar');
const subTotalCarrito = document.getElementById('sub-total');
const IVACarrito = document.getElementById('IVA');
const totalCarrito = document.getElementById('total');
const cerrarCompra = document.getElementById('cerrar-compra');
const formularioNoticias = document.getElementById('formulario-noticias');

const menuHamburguesa = document.querySelector('.menu-burguer');
const menu = document.querySelector('.menu');
const mainContenido = document.querySelector('.contenido');

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
          <p class="precio-producto">$${precio.toLocaleString('es-CL', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}</p>
        </div>
        <div class="productos-card-btn">
          <button class="agregar-carrito" id="${id}"></button>
        </div>
      </div>
    `;
  });

  const botonAgregar = document.querySelectorAll('.agregar-carrito');

  botonAgregar.forEach((boton) => {
    boton.addEventListener('click', function (e) {
      e.preventDefault();
      const idProducto = parseInt(this.id);
      const producto = productos.find((producto) => producto.id === idProducto);

      if (producto) {
        const productoEnCarrito = carrito.find((item) => item.id === producto.id);
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
  const productoEnCarrito = carrito.find((item) => item.id === producto.id);

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
  carrito = carrito.filter((item) => item.id !== id);
  guardarCarrito();
  displayCarrito();
  actualizarTotal();
  actualizarContadorCarrito();
}

function displayCarrito() {
  itemsCarrito.innerHTML = '';

  carrito.forEach((item) => {
    const fila = document.getElementById(`item-${item.id}`);
    if (fila) {
      fila.querySelector('.cantidad-input').value = item.cantidad;
    } else {
      itemsCarrito.innerHTML += ` 
      <tr id="item-${item.id}" class="carrito-item">
        <td><img src="${item.imagen}" alt="${item.nombre}"></td>
        <td class="id-producto">${item.id}</td>
        <td>${item.nombre}</td>
        <td>$${item.precio.toLocaleString('es-CL', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })}</td>
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

  document.querySelectorAll('.cantidad-input').forEach((input) => {
    input.addEventListener('change', function (e) {
      e.preventDefault();
      const id = parseInt(this.id.split('-')[1]);
      const nuevaCantidad = parseInt(this.value);
      actualizarCantidad(id, nuevaCantidad);
    });
  });

  document.querySelectorAll('.quitar-cantidad').forEach((boton) => {
    boton.addEventListener('click', function (e) {
      e.preventDefault();
      const id = parseInt(this.getAttribute('data-id'));
      quitarCantidad(id);
    });
  });

  document.querySelectorAll('.agregar-cantidad').forEach((boton) => {
    boton.addEventListener('click', function (e) {
      e.preventDefault();
      const id = parseInt(this.getAttribute('data-id'));
      agregarCantidad(id);
    });
  });

  document.querySelectorAll('.eliminar-producto').forEach((boton) => {
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
  const productoEnCarrito = carrito.find((item) => item.id === id);

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
  const productoEnCarrito = carrito.find((item) => item.id === id);

  if (productoEnCarrito) {
    productoEnCarrito.cantidad += 1;
    actualizarContadorCarrito();
    guardarCarrito();
    displayCarrito();
    actualizarTotal();
  }
}

function quitarCantidad(id) {
  const productoEnCarrito = carrito.find((item) => item.id === id);

  if (productoEnCarrito && productoEnCarrito.cantidad > 1) {
    productoEnCarrito.cantidad -= 1;
    actualizarContadorCarrito();
    guardarCarrito();
    displayCarrito();
    actualizarTotal();
  }
}

function actualizarTotal() {
  const totalSinIVA = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const iva = totalSinIVA * TASA_IVA;
  const totalConIVA = totalSinIVA + iva;
  const totalFormateado = totalConIVA.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  subTotalCarrito.innerHTML = `Sub total: $${totalSinIVA.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  IVACarrito.innerHTML = `IVA: $${iva.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  totalCarrito.innerHTML = `Total: $${totalFormateado}`;
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
    width: '320px',
    customClass: {
      popup: 'notificacion',
      icon: 'icono-sweet',
    },
    showClass: {
      popup: `
        animate__animated
        animate__tada
      `,
    },
    hideClass: {
      popup: `
        animate__animated
        animate__fadeOut
      `,
    },
  });
}

function notificacionSuscripcion() {
  Swal.fire({
    icon: 'success',
    text: 'Se ha suscrito con exito.',
    showConfirmButton: false,
    timer: 1500,
    width: '400px',
    customClass: {
      popup: 'notificacion',
      icon: 'icono-sweet',
    },
    showClass: {
      popup: `
        animate__animated
        animate__tada
      `,
    },
    hideClass: {
      popup: `
        animate__animated
        animate__fadeOut
      `,
    },
  });
}

function mostrarFormularioNoticias() {
  formularioNoticias.innerHTML = `
  <p>Recibe nuestro boletin informativo, con noticias, descuentos, tips y demás.</p>
  <div class="cont-entrada">
    <i class="bi bi-envelope-at-fill"></i>
    <input type="email" id="correo" placeholder="Ingresa tu correo electrónico" required>
    <button type="submit" name="boton">Suscríbete</button>
  </div>`;

  document.querySelector('.formulario-noticias').addEventListener('submit', (e) => {
    e.preventDefault();

    const correo = document.getElementById('correo').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, ingrese un correo electrónico válido.',
      });
      return;
    }

    notificacionSuscripcion(correo);
    e.target.reset();
  });
}

function mostrarConfirmacionPedido() {
  const totalSinIVA = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const totalConIVA = totalSinIVA * (1 + TASA_IVA);

  const resumen = carrito
    .map((item) => {
      const precioTotalSinIVA = item.precio * item.cantidad;
      const precioConIVA = precioTotalSinIVA * (1 + TASA_IVA);
      return `
      <div class="resumen">
        <span>${item.nombre}</span>
        <span>${item.cantidad}</span>
        <span>$${precioConIVA.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
      </div>`;
    })
    .join('');

  Swal.fire({
    title: 'Resumen de tu compra',
    html: `
      <div class="linea"></div>
      <div>${resumen}</div>
      <div class="linea"></div>
      <p>Total a pagar: $${totalConIVA.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
    `,
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Continuar',
    reverseButtons: true,
    customClass: {
      popup: 'modal-resume',
      cancelButton: 'boton-cancelar',
      confirmButton: 'boton-confirmar',
      title: 'titulo',
    },
    showClass: {
      popup: '',
    },
    hideClass: {
      popup: '',
    },
    focusConfirm: false,
  }).then((result) => {
    if (result.isConfirmed) {
      const formulario = document.createElement('div');
      formulario.className = 'formulario-envio';
      formulario.innerHTML = `
      <h3 class="titulo-formulario">Ingresa tus datos para finalizar la compra</h3>
      <form id="formularioCompra" class="formulario-compra">
        <div class="campo-formulario">
          <div class="campo-entrada">
            <i class="bi bi-person"></i>
            <input type="text" id="nombre" class="input-formulario" placeholder="Nombre">
          </div>
        </div>
        <div class="campo-formulario">
          <div class="campo-entrada">
            <i class="bi bi-card-text"></i>
            <input type="text" id="rut" class="input-formulario" placeholder="RUT o DNI">
          </div>
        </div>
        <div class="campo-formulario">
          <div class="campo-entrada">
            <i class="bi bi-envelope"></i>
            <input type="email" id="correo-envio" name="email" class="input-formulario" placeholder="Correo">
          </div>
        </div>
        <div class="campo-formulario">
          <div class="campo-entrada">
            <i class="bi bi-telephone"></i>
            <input type="tel" id="telefono" class="input-formulario" placeholder="Teléfono">
          </div>
        </div>
        <div class="campo-formulario">
          <div class="campo-entrada">
            <i class="bi bi-house"></i>
            <input type="text" id="direccion" class="input-formulario" placeholder="Dirección de envío">
          </div>
        </div>
      </form>
      `;

      Swal.fire({
        title: 'Datos de Envio',
        html: formulario,
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonText: 'Finalizar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
        focusConfirm: false,
        customClass: {
          popup: 'modal-formulario-envio',
          title: 'titulo-formulario-envio',
          confirmButton: 'boton-confirmar',
          cancelButton: 'boton-cancelar',
        },
        showClass: {
          popup: '',
        },
        hideClass: {
          popup: '',
        },
        preConfirm: () => {
          const nombre = document.getElementById('nombre').value;
          const rut = document.getElementById('rut').value;
          const correo = document.getElementById('correo-envio').value;
          const telefono = document.getElementById('telefono').value;
          const direccion = document.getElementById('direccion').value;

          console.log({ nombre, rut, correo, telefono, direccion });

          if (!nombre || !rut || !correo || !telefono || !direccion) {
            Swal.showValidationMessage(`Por favor, complete todos los campos.`);
            return false;
          }

          if (!/^[a-zA-Z\s]+$/.test(nombre)) {
            Swal.showValidationMessage(`Por favor, ingrese un nombre válido (solo letras y espacios).`);
            return false;
          }

          const rutRegex = /^(?:\d{1,3}(?:\.\d{3})*|\d{1,8})-?[0-9Kk]$/;
          if (!rutRegex.test(rut)) {
            Swal.showValidationMessage(`Por favor, ingrese un RUT válido.`);
            return false;
          }

          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(correo)) {
            Swal.showValidationMessage(`Por favor, ingrese un correo electrónico válido.`);
            return false;
          }

          if (!/^\+?\d{7,14}$/.test(telefono)) {
            Swal.showValidationMessage(`Por favor, ingrese un número de teléfono válido.`);
            return false;
          }

          return {
            nombre,
            rut,
            correo,
            telefono,
            direccion,
          };
        },
      }).then((result) => {
        if (result.isConfirmed) {
          finalizarCompra();
        }
      });
    }
  });
}

function finalizarCompra() {
  carrito = [];
  guardarCarrito();
  actualizarContadorCarrito();
  actualizarTotal();
  Swal.fire({
    icon: 'success',
    title: '¡Compra realizada!',
    text: 'Tu compra ha sido confirmada. En breve recibiras un correo con la información sobre tu pedido.',
    showConfirmButton: false,
    timer: 5000,
    customClass: {
      popup: `modal-compra-finalizada 
              animate__animated
              animate__bounceIn`,
      icon: 'icono-sweet',
    },
  });
}

/* Eventos */
botonContinuar.addEventListener('click', () => {
  if (carrito.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Carrito vacío',
      text: 'Por favor, agregue un producto al carrito',
      showConfirmButton: true,
      timer: 2500,
      width: '400px',
      customClass: {
        popup: 'modal-carrito-vacio',
        icon: 'icono-sweet',
        confirmButton: 'boton-ok',
      },
      showClass: {
        popup: `
        animate__animated
        animate__tada
      `,
      },
      hideClass: {
        popup: `
        animate__animated
        animate__fadeOut
      `,
      },
    });
  } else {
    modalCarrito.style.display = 'none';
    mostrarConfirmacionPedido();
  }
});

document.querySelector('#icono-carrito').parentElement.addEventListener('click', (e) => {
  e.preventDefault();
  modalCarrito.style.display = 'flex';
  displayCarrito();
  actualizarTotal();
});

cerrarCarrito.addEventListener('click', () => {
  modalCarrito.style.display = 'none';
});

menuHamburguesa.addEventListener('click', () => {
  menu.classList.toggle('active');
  if (menu.classList.contains('active')) {
    mainContenido.style.marginTop = '160px';
    menu.style.marginTop = '10px';
  } else {
    mainContenido.style.marginTop = '0';
  }
});

obtenerProductos();
cargarCarrito();
mostrarFormularioNoticias();
