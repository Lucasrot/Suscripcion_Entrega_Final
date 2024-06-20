const carrito = JSON.parse(localStorage.getItem("carrito")) || []

const crearTarjetaProducto = (producto) => {
    const containerProductos = document.getElementById("containerProductos")
    const tarjeta = document.createElement("div")
    tarjeta.className = "card m-2"
    tarjeta.style.width = "18rem"
    tarjeta.id = producto.nombre
    tarjeta.innerHTML = `
        <img src="${producto.foto}" class="card-img-top"  alt="${producto.nombre}">
        <div class="card-body">
            <h5 class="card-title">${producto.nombre}</h5>
            <p class="card-text">${producto.entrenamiento}</p>
            <p class="card-text"><strong>Precio: $${producto.precio.toFixed(2)}</strong></p>
            <button class="btn btn-primary btn-agregar-carrito">Agregar al carrito</button>
        </div>
    `
    containerProductos.append(tarjeta)
}

const crearTarjetaProductoCarrito = (producto, index) => {
    const carritoProductos = document.getElementById("carritoProductos")
    const tarjeta = document.createElement("div")
    tarjeta.className = "card m-2"
    tarjeta.style.width = "18rem"
    tarjeta.id = producto.nombre
    tarjeta.innerHTML = `
        <img src="${producto.foto}" class="card-img-top" alt="${producto.nombre}">
        <div class="card-body">
            <h5 class="card-title">${producto.nombre}</h5>
            <p class="card-text">${producto.entrenamiento}</p>
            <p class="card-text"><strong>Precio: $${producto.precio.toFixed(2)}</strong></p>
            <button class="btn btn-danger btn-eliminar-producto-carrito" data-index="${index}">Eliminar</button>
        </div>
    `
    carritoProductos.append(tarjeta)
}

const traerProductos = async () => {
    try {
        const respuesta = await fetch("./suscripcion.json")
        const productos = await respuesta.json()
        productos.forEach(producto => {
            crearTarjetaProducto(producto)
        })
        return productos
    } catch (error) {
        console.error("Error al traer productos:", error)
    }
}

const agregarProductoCarrito = (productos) => {
    const containerProductos = document.getElementById("containerProductos")
    containerProductos.addEventListener("click", (event) => {
        if (event.target && event.target.classList.contains("btn-agregar-carrito")) {
            const parentElement = event.target.closest(".card")
            const nombre = parentElement.id
            const producto = productos.find(producto => producto.nombre === nombre)
            carrito.push(producto)
            localStorage.setItem("carrito", JSON.stringify(carrito))
            Swal.fire("Producto agregado al carrito!")
            actualizarTotalCarrito();
        }
    })
}

const eliminarProductoCarrito = (index) => {
    carrito.splice(index, 1)
    localStorage.setItem("carrito", JSON.stringify(carrito))
    verCarrito()
}

const verCarrito = () => {
    const carritoProductos = document.getElementById("carritoProductos")
    carritoProductos.innerHTML = ""
    carrito.forEach((producto, index) => {
        crearTarjetaProductoCarrito(producto, index)
    })
    carritoProductos.addEventListener("click", (event) => {
        if (event.target && event.target.classList.contains("btn-eliminar-producto-carrito")) {
            const index = event.target.getAttribute("data-index")
            eliminarProductoCarrito(index)
            actualizarTotalCarrito(); 
        }
    });
    actualizarTotalCarrito();
}

const confirmarCompra = () => {
    if (carrito.length === 0) {
        Swal.fire("No hay productos en el carrito")
        return
    }

    Swal.fire({
        title: 'Confirmar compra',
        text: "¿Está seguro de que desea confirmar la compra?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, confirmar'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem("carrito")
            Swal.fire(
                'Compra confirmada',
                'Gracias por suscribirte.',
                'success'
            ).then(() => {
                window.location.href = "index.html"
            })
        }
    })
}

const confirmarButton = document.getElementById('confirmarButton')
if (confirmarButton) {
    confirmarButton.addEventListener('click', confirmarCompra)
}




const principal = async () => {
    const productos = await traerProductos()
    agregarProductoCarrito(productos)
}


const actualizarTotalCarrito = () => {
    const totalCarritoElemento = document.getElementById("totalCarrito");
    let total = 0;
    carrito.forEach(producto => {
        total += parseFloat(producto.precio); 
    });
    totalCarritoElemento.textContent = `Total: $${total.toFixed(2)}`;
};
