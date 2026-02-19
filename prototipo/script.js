// Sistema de Ventas - Prototipo JavaScript

class SistemaVentas {
    constructor() {
        this.productos = [];
        this.ventaActual = {
            vendedor: null,
            cliente: '',
            local: null,
            promotor: null,
            tecnico: null,
            productos: [],
            formaPago: 'efectivo',
            montoPagado: 0
        };
        this.init();
    }

    init() {
        this.cargarDatosIniciales();
        this.configurarEventListeners();
        this.actualizarResumen();
    }

    // Datos de ejemplo basados en la estructura de la BD
    cargarDatosIniciales() {
        // Productos de ejemplo
        this.productos = [
            {
                id: 1,
                name: 'Laptop Dell Inspiron 15',
                categoria: 'Computadoras',
                precio: 850.00,
                marca: 'Dell',
                model: 'Inspiron 15',
                cantidad: 10,
                local: 1
            },
            {
                id: 2,
                name: 'Mouse USB Logitech',
                categoria: 'Accesorios',
                precio: 25.00,
                marca: 'Logitech',
                model: 'M185',
                cantidad: 50,
                local: 1
            },
            {
                id: 3,
                name: 'Monitor LG 24"',
                categoria: 'Monitores',
                precio: 180.00,
                marca: 'LG',
                model: '24MP59G',
                cantidad: 15,
                local: 1
            },
            {
                id: 4,
                name: 'Teclado Mecánico RGB',
                categoria: 'Accesorios',
                precio: 65.00,
                marca: 'Redragon',
                model: 'K552',
                cantidad: 25,
                local: 2
            },
            {
                id: 5,
                name: 'Webcam HD 1080p',
                categoria: 'Accesorios',
                precio: 45.00,
                marca: 'Logitech',
                model: 'C920',
                cantidad: 30,
                local: 1
            }
        ];

        // Promotores con sus comisiones
        this.promotores = [
            { id: 1, name: 'Ana Martínez', comision: 0.05 }, // 5%
            { id: 2, name: 'Luis Rodríguez', comision: 0.07 }, // 7%
            { id: 3, name: 'Sofía Hernández', comision: 0.06 }  // 6%
        ];

        // Técnicos
        this.tecnicos = [
            { id: 1, name: 'Roberto Sánchez' },
            { id: 2, name: 'Diana Castro' }
        ];
    }

    configurarEventListeners() {
        // Eventos de checkboxes
        document.getElementById('con-promotor').addEventListener('change', (e) => {
            const promotorGroup = document.getElementById('promotor-group');
            promotorGroup.style.display = e.target.checked ? 'block' : 'none';
            if (!e.target.checked) {
                document.getElementById('promotor').value = '';
                this.ventaActual.promotor = null;
            }
            this.actualizarResumen();
        });

        document.getElementById('con-tecnico').addEventListener('change', (e) => {
            const tecnicoGroup = document.getElementById('tecnico-group');
            tecnicoGroup.style.display = e.target.checked ? 'block' : 'none';
            if (!e.target.checked) {
                document.getElementById('tecnico').value = '';
                this.ventaActual.tecnico = null;
            }
        });

        // Eventos de selects
        document.getElementById('promotor').addEventListener('change', (e) => {
            this.ventaActual.promotor = e.target.value ? this.promotores.find(p => p.id == e.target.value) : null;
            this.actualizarResumen();
        });

        // Eventos de búsqueda
        document.getElementById('btn-buscar').addEventListener('click', () => this.buscarProductos());
        document.getElementById('buscar-producto').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.buscarProductos();
        });

        // Eventos de botones principales
        document.getElementById('btn-limpiar').addEventListener('click', () => this.limpiarVenta());
        document.getElementById('btn-finalizar-venta').addEventListener('click', () => this.finalizarVenta());

        // Eventos de forma de pago
        document.getElementById('forma-pago').addEventListener('change', (e) => {
            this.ventaActual.formaPago = e.target.value;
        });

        document.getElementById('monto-pagado').addEventListener('input', (e) => {
            this.ventaActual.montoPagado = parseFloat(e.target.value) || 0;
        });

        // Modal
        this.configurarModal();
    }

    configurarModal() {
        const modal = document.getElementById('modal-productos');
        const closeBtn = document.querySelector('.close');
        
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Búsqueda en modal
        document.getElementById('modal-buscar-producto').addEventListener('input', (e) => {
            this.mostrarProductosEnModal(e.target.value);
        });
    }

    buscarProductos() {
        const termino = document.getElementById('buscar-producto').value.toLowerCase();
        if (termino.length < 2) {
            this.mostrarMensaje('Ingrese al menos 2 caracteres para buscar', 'warning');
            return;
        }

        const resultados = this.productos.filter(producto => 
            producto.name.toLowerCase().includes(termino) ||
            producto.marca.toLowerCase().includes(termino) ||
            producto.model.toLowerCase().includes(termino) ||
            producto.categoria.toLowerCase().includes(termino)
        );

        this.mostrarResultadosBusqueda(resultados);
    }

    mostrarResultadosBusqueda(resultados) {
        const contenedor = document.getElementById('productos-resultados');
        
        if (resultados.length === 0) {
            contenedor.innerHTML = '<p>No se encontraron productos</p>';
            return;
        }

        contenedor.innerHTML = resultados.map(producto => `
            <div class="producto-item" onclick="sistemaVentas.agregarProducto(${producto.id})">
                <h4>${producto.name}</h4>
                <p>Marca: ${producto.marca} | Modelo: ${producto.model}</p>
                <p>Categoría: ${producto.categoria} | Stock: ${producto.cantidad}</p>
                <p class="precio">Precio: $${producto.precio.toFixed(2)}</p>
            </div>
        `).join('');
    }

    agregarProducto(productoId) {
        const producto = this.productos.find(p => p.id === productoId);
        if (!producto) return;

        // Verificar si el producto ya está en la venta
        const productoExistente = this.ventaActual.productos.find(p => p.id === productoId);
        if (productoExistente) {
            productoExistente.cantidad += 1;
        } else {
            this.ventaActual.productos.push({
                ...producto,
                cantidad: 1,
                precioEditado: producto.precio,
                comisionPromotor: 0,
                comisionPersonalizada: 0
            });
        }

        this.actualizarTablaProductos();
        this.actualizarResumen();
        
        // Limpiar búsqueda
        document.getElementById('productos-resultados').innerHTML = '';
        document.getElementById('buscar-producto').value = '';
        
        this.mostrarMensaje('Producto agregado correctamente', 'success');
    }

    actualizarTablaProductos() {
        const tbody = document.getElementById('productos-tbody');
        
        if (this.ventaActual.productos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No hay productos agregados</td></tr>';
            return;
        }

        tbody.innerHTML = this.ventaActual.productos.map((producto, index) => {
            const comisionPromotor = this.ventaActual.promotor ? 
                (producto.comisionPersonalizada || (producto.precioEditado * this.ventaActual.promotor.comision)) : 0;
            const subtotal = (producto.precioEditado * producto.cantidad) + comisionPromotor;
            
            return `
                <tr>
                    <td>${producto.name}</td>
                    <td>
                        <input type="number" 
                               value="${producto.cantidad}" 
                               min="1" 
                               max="${producto.cantidad}"
                               onchange="sistemaVentas.actualizarCantidad(${index}, this.value)"
                               style="width: 60px; padding: 5px;">
                    </td>
                    <td>
                        <input type="number" 
                               value="${producto.precioEditado}" 
                               min="0" 
                               step="0.01"
                               onchange="sistemaVentas.actualizarPrecio(${index}, this.value)"
                               style="width: 80px; padding: 5px;">
                    </td>
                    <td>
                        ${this.ventaActual.promotor ? `
                            <input type="number" 
                                   value="${comisionPromotor.toFixed(2)}" 
                                   min="0" 
                                   step="0.01"
                                   onchange="sistemaVentas.actualizarComision(${index}, this.value)"
                                   style="width: 80px; padding: 5px;">
                        ` : '$0.00'}
                    </td>
                    <td>$${subtotal.toFixed(2)}</td>
                    <td>
                        <button class="btn-eliminar" onclick="sistemaVentas.eliminarProducto(${index})">Eliminar</button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    calcularComisionPromotor(producto) {
        if (!this.ventaActual.promotor) return 0;
        
        const subtotal = producto.precioEditado * producto.cantidad;
        return producto.comisionPersonalizada || (subtotal * this.ventaActual.promotor.comision);
    }

    actualizarPrecio(index, nuevoPrecio) {
        const precio = parseFloat(nuevoPrecio);
        if (precio < 0) {
            this.mostrarMensaje('El precio no puede ser negativo', 'error');
            this.actualizarTablaProductos();
            return;
        }

        this.ventaActual.productos[index].precioEditado = precio;
        
        // Si hay una comisión personalizada, mantenerla
        if (!this.ventaActual.productos[index].comisionPersonalizada && this.ventaActual.promotor) {
            // Recalcular comisión automática basada en el nuevo precio
            this.ventaActual.productos[index].comisionPersonalizada = 0;
        }
        
        this.actualizarTablaProductos();
        this.actualizarResumen();
    }

    actualizarComision(index, nuevaComision) {
        const comision = parseFloat(nuevaComision);
        if (comision < 0) {
            this.mostrarMensaje('La comisión no puede ser negativa', 'error');
            this.actualizarTablaProductos();
            return;
        }

        this.ventaActual.productos[index].comisionPersonalizada = comision;
        this.actualizarTablaProductos();
        this.actualizarResumen();
    }

    actualizarCantidad(index, nuevaCantidad) {
        const cantidad = parseInt(nuevaCantidad);
        if (cantidad < 1 || cantidad > this.ventaActual.productos[index].cantidad) {
            this.mostrarMensaje('Cantidad inválida', 'error');
            this.actualizarTablaProductos();
            return;
        }

        this.ventaActual.productos[index].cantidad = cantidad;
        this.actualizarTablaProductos();
        this.actualizarResumen();
    }

    eliminarProducto(index) {
        this.ventaActual.productos.splice(index, 1);
        this.actualizarTablaProductos();
        this.actualizarResumen();
        this.mostrarMensaje('Producto eliminado', 'info');
    }

    actualizarResumen() {
        const subtotal = this.ventaActual.productos.reduce((total, producto) => {
            return total + (producto.precioEditado * producto.cantidad);
        }, 0);

        const totalComisiones = this.ventaActual.productos.reduce((total, producto) => {
            return total + this.calcularComisionPromotor(producto);
        }, 0);

        const totalVenta = subtotal + totalComisiones;

        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('total-comisiones').textContent = `$${totalComisiones.toFixed(2)}`;
        document.getElementById('total-venta').textContent = `$${totalVenta.toFixed(2)}`;
    }

    limpiarVenta() {
        if (confirm('¿Está seguro de limpiar la venta actual?')) {
            this.ventaActual = {
                vendedor: null,
                cliente: '',
                local: null,
                promotor: null,
                tecnico: null,
                productos: [],
                formaPago: 'efectivo',
                montoPagado: 0
            };

            // Resetear formulario
            document.getElementById('cliente').value = '';
            document.getElementById('con-promotor').checked = false;
            document.getElementById('con-tecnico').checked = false;
            document.getElementById('promotor-group').style.display = 'none';
            document.getElementById('tecnico-group').style.display = 'none';
            document.getElementById('promotor').value = '';
            document.getElementById('tecnico').value = '';
            document.getElementById('forma-pago').value = 'efectivo';
            document.getElementById('monto-pagado').value = '';

            this.actualizarTablaProductos();
            this.actualizarResumen();
            this.mostrarMensaje('Venta limpiada', 'info');
        }
    }

    finalizarVenta() {
        // Validaciones
        if (this.ventaActual.productos.length === 0) {
            this.mostrarMensaje('Debe agregar al menos un producto', 'error');
            return;
        }

        const vendedor = document.getElementById('vendedor').value;
        if (!vendedor) {
            this.mostrarMensaje('Debe seleccionar un vendedor', 'error');
            return;
        }

        const cliente = document.getElementById('cliente').value.trim();
        if (!cliente) {
            this.mostrarMensaje('Debe ingresar el nombre del cliente', 'error');
            return;
        }

        // Calcular totales
        const subtotal = this.ventaActual.productos.reduce((total, producto) => {
            return total + (producto.precioEditado * producto.cantidad);
        }, 0);

        const totalComisiones = this.ventaActual.productos.reduce((total, producto) => {
            return total + this.calcularComisionPromotor(producto);
        }, 0);

        const totalVenta = subtotal + totalComisiones;

        // Crear objeto de venta para guardar/enviar
        const ventaFinal = {
            ...this.ventaActual,
            vendedor: vendedor,
            cliente: cliente,
            local: document.getElementById('local').value,
            subtotal: subtotal,
            totalComisiones: totalComisiones,
            totalVenta: totalVenta,
            fecha: new Date().toISOString(),
            numeroFactura: this.generarNumeroFactura()
        };

        // Simular guardado (en una app real esto se enviaría al backend)
        console.log('Venta finalizada:', ventaFinal);
        
        // Mostrar resumen
        this.mostrarResumenFinal(ventaFinal);
        
        // Limpiar después de guardar
        setTimeout(() => {
            this.limpiarVenta();
        }, 3000);
    }

    generarNumeroFactura() {
        const fecha = new Date();
        const año = fecha.getFullYear();
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const dia = String(fecha.getDate()).padStart(2, '0');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `F-${año}${mes}${dia}-${random}`;
    }

    mostrarResumenFinal(venta) {
        let mensaje = `✅ Venta realizada con éxito\n\n`;
        mensaje += `📋 Factura: ${venta.numeroFactura}\n`;
        mensaje += `👤 Cliente: ${venta.cliente}\n`;
        mensaje += `📅 Fecha: ${new Date(venta.fecha).toLocaleString()}\n`;
        mensaje += `🛒 Productos: ${venta.productos.length}\n`;
        mensaje += `💰 Total: $${venta.totalVenta.toFixed(2)}\n`;
        
        if (venta.promotor) {
            mensaje += `🤝 Promotor: ${venta.promotor.name}\n`;
            mensaje += `💸 Comisión: $${venta.totalComisiones.toFixed(2)}\n`;
        }
        
        if (venta.tecnico) {
            mensaje += `🔧 Técnico: ${venta.tecnico.name}\n`;
        }
        
        mensaje += `💳 Forma de pago: ${venta.formaPago}`;
        
        alert(mensaje);
    }

    mostrarProductosEnModal(termino = '') {
        const modalLista = document.getElementById('modal-lista-productos');
        const resultados = termino ? 
            this.productos.filter(p => 
                p.name.toLowerCase().includes(termino.toLowerCase()) ||
                p.marca.toLowerCase().includes(termino.toLowerCase())
            ) : this.productos;

        modalLista.innerHTML = resultados.map(producto => `
            <div class="modal-producto" onclick="sistemaVentas.agregarProducto(${producto.id})">
                <h4>${producto.name}</h4>
                <p>Marca: ${producto.marca} | Modelo: ${producto.model}</p>
                <p>Categoría: ${producto.categoria}</p>
                <p>Precio: $${producto.precio.toFixed(2)} | Stock: ${producto.cantidad}</p>
            </div>
        `).join('');
    }

    mostrarMensaje(mensaje, tipo = 'info') {
        // Crear elemento de notificación
        const notificacion = document.createElement('div');
        notificacion.className = `notificacion notificacion-${tipo}`;
        notificacion.textContent = mensaje;
        
        // Estilos para la notificación
        Object.assign(notificacion.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '5px',
            color: 'white',
            fontWeight: 'bold',
            zIndex: '9999',
            maxWidth: '300px',
            wordWrap: 'break-word'
        });

        // Colores según tipo
        const colores = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        notificacion.style.backgroundColor = colores[tipo] || colores.info;

        document.body.appendChild(notificacion);

        // Eliminar después de 3 segundos
        setTimeout(() => {
            if (notificacion.parentNode) {
                notificacion.parentNode.removeChild(notificacion);
            }
        }, 3000);
    }
}

// Inicializar el sistema cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.sistemaVentas = new SistemaVentas();
});

// Funciones globales para acceso desde HTML
function agregarProducto(id) {
    window.sistemaVentas.agregarProducto(id);
}

function actualizarCantidad(index, cantidad) {
    window.sistemaVentas.actualizarCantidad(index, cantidad);
}

function actualizarPrecio(index, precio) {
    window.sistemaVentas.actualizarPrecio(index, precio);
}

function actualizarComision(index, comision) {
    window.sistemaVentas.actualizarComision(index, comision);
}

function eliminarProducto(index) {
    window.sistemaVentas.eliminarProducto(index);
}
