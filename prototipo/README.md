# Sistema de Ventas - Prototipo

Este prototipo implementa un sistema de ventas basado en la estructura de base de datos analizada, con soporte para:

## Características Principales

### 🏪 **Gestión de Ventas**
- Registro de ventas con múltiples productos
- Cálculo automático de totales
- Soporte para diferentes formas de pago
- Generación de números de factura

### 👥 **Participantes en la Venta**
- **Vendedores**: Asignados a cada venta
- **Promotores**: Opcional, con sistema de comisiones
- **Técnicos**: Opcional, para soporte técnico

### 💰 **Sistema de Comisiones**
- Configuración de comisiones por promotor (5%, 6%, 7%)
- Cálculo automático de comisiones por producto
- Integración con el total de la venta

### 📦 **Gestión de Productos**
- Búsqueda de productos por nombre, marca, modelo o categoría
- Control de stock
- Precios base con posibilidad de añadir comisiones

## Estructura de Datos

### Productos
```javascript
{
  id: 1,
  name: 'Laptop Dell Inspiron 15',
  categoria: 'Computadoras',
  precio: 850.00,
  marca: 'Dell',
  model: 'Inspiron 15',
  cantidad: 10,
  local: 1
}
```

### Promotores
```javascript
{
  id: 1,
  name: 'Ana Martínez',
  comision: 0.05  // 5%
}
```

### Venta
```javascript
{
  vendedor: 'Juan Pérez',
  cliente: 'Cliente Nombre',
  local: 1,
  promotor: { id: 1, name: 'Ana Martínez', comision: 0.05 },
  tecnico: { id: 1, name: 'Roberto Sánchez' },
  productos: [...],
  formaPago: 'efectivo',
  subtotal: 1000.00,
  totalComisiones: 50.00,
  totalVenta: 1050.00
}
```

## Flujo de Venta

1. **Selección de Vendedor**: El vendedor que realiza la venta
2. **Información del Cliente**: Nombre del cliente
3. **Participantes Opcionales**: 
   - Promotor (si aplica, añade comisión)
   - Técnico (si aplica, para soporte)
4. **Agregar Productos**: Búsqueda y selección de productos
5. **Revisión y Pago**: Verificación de totales y forma de pago
6. **Finalización**: Generación de factura y registro

## Cálculo de Comisiones

Las comisiones se calculan automáticamente cuando se selecciona un promotor:

```
Comisión = Subtotal del producto × Porcentaje de comisión del promotor
Total con comisión = Precio base + Comisión
```

Ejemplo:
- Producto: $100.00
- Comisión promotor (5%): $5.00
- Total con comisión: $105.00

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Diseño responsive y moderno
- **JavaScript ES6+**: Lógica de negocio
- **Diseño**: Gradientes, animaciones, y UX moderna

## Características de UX/UI

- **Diseño Responsive**: Adaptable a diferentes tamaños de pantalla
- **Notificaciones**: Sistema de alertas no intrusivo
- **Validaciones**: Verificación en tiempo real
- **Animaciones**: Transiciones suaves
- **Accesibilidad**: Etiquetas y estructura semántica

## Para Ejecutar

1. Abrir `index.html` en un navegador web
2. O usar un servidor local para mejor experiencia

## Próximos Mejoras (Integración con Laravel)

- Conexión con API REST de Laravel
- Autenticación real de usuarios
- Persistencia de datos en base de datos
- Reportes y estadísticas
- Gestión de inventario en tiempo real

---

**Nota**: Este prototipo es una demostración funcional del sistema de ventas basado en la estructura de base de datos proporcionada.
