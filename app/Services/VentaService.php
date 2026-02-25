<?php

namespace App\Services;

use App\Models\VentaCabezera;
use App\Models\Venta;
use App\Models\VentaFooter;
use App\Models\FormaPagoVenta;
use App\Models\VentaPromotore;
use App\Models\VentaTecnico;
use App\Models\Producto;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class VentaService
{
    /**
     * Procesar una venta completa con todas las reglas de negocio
     */
    public function procesarVenta(array $data): VentaCabezera
    {
        return DB::transaction(function () use ($data) {
            // 1. Crear la cabezera de la venta
            $ventaCabezera = VentaCabezera::create([
                'fecha' => now()->toDateString(),
                'id_cliente' => $data['id_cliente'],
                'id_promotor' => $data['id_promotor'] ?? null,
                'id_tecnico' => $data['id_tecnico'] ?? null,
                'monto_promotor' => $data['monto_promotor'] ?? null,
                'user_id' => Auth::id(),
                'monto_total' => 0, // Se calculará después
                'locale_id' => $this->obtenerLocaleUsuario(),
            ]);

            // 2. Procesar los productos de la venta
            $subtotal = 0;
            info('Productos recibidos', [
                'productos_array' => $data['productos'],
                'count' => count($data['productos']),
                'first_product' => $data['productos'][0] ?? 'no hay productos'
            ]);
            
            foreach ($data['productos'] as $productoData) {
                $producto = Producto::findOrFail($productoData['id_producto']);
                
                // Validar stock disponible
                $this->validarStock($producto, $productoData['cantidad']);
                info("data venta",["data"=>$productoData]);
                
                // Determinar el precio unitario y monto promotor según el escenario
                $precioUnitario = $producto->precio;
                $montoPromotor = 0;
                $precioVenta = $producto->precio;
                
                if ($data['id_tecnico']) {
                    // Escenario con técnico: el técnico puede editar el precio
                    $precioUnitario = $productoData['precio_unitario'] ?? $producto->precio;
                    $precioVenta = $precioUnitario;
                } elseif ($data['id_promotor']) {
                    // Escenario con promotor: el promotor agrega monto adicional
                    $montoPromotor = $productoData['monto_promotor'] ?? 0;
                    
                    // Validar que el monto del promotor no supere el precio del producto
                    if ($montoPromotor > $producto->precio) {
                        throw new \Exception("El monto del promotor ({$montoPromotor}) no puede superar el precio del producto ({$producto->precio})");
                    }
                    
                    $precioVenta = $producto->precio + $montoPromotor;
                }
                
                // Crear detalle de venta
                $venta = Venta::create([
                    'venta_cabezera_id' => $ventaCabezera->id,
                    'id_producto' => $producto->id,
                    'cantidad' => $productoData['cantidad'],
                    'precio_unitario' => $precioUnitario,
                    'subtotal' => $precioUnitario * $productoData['cantidad'],
                    'monto_promotor' => $montoPromotor,
                    'precio_venta' => $precioVenta,
                    'descripcion' => $producto->name,
                ]);
                
                $subtotal += $precioVenta * $productoData['cantidad'];
                
                // Descontar del stock
                $producto->decrement('cantidad', $productoData['cantidad']);
            }

            // 3. Calcular totales
            $totales = $this->calcularTotales($data['productos'], $data['descuento'] ?? 0,$subtotal);
            $iva = $totales['iva'];
            $total = $totales['total'];

            // 4. Crear el footer de la venta
            VentaFooter::create([
                'venta_cabezera_id' => $ventaCabezera->id,
                'subtotal' => $totales['subtotal'],
                'iva' => $iva,
                'descuento' => $totales['descuento'],
                'total' => $total,
            ]);

            // 5. Actualizar monto total en la cabezera
            $ventaCabezera->update(['monto_total' => $total]);

            // 6. Procesar formas de pago
            $facturaVentaId = $this->obtenerOCrearFactura($ventaCabezera->id);
            $this->procesarFormasPago($facturaVentaId, $data['formas_pago'], $total);

            // 7. Generar registros de comisiones si aplica
            $this->generarComisiones($ventaCabezera, $total);

            return $ventaCabezera;
        });
    }

    /**
     * Validar que el producto tenga stock suficiente en el local del usuario
     */
    private function validarStock(Producto $producto, int $cantidad): void
    {
        if ($producto->cantidad < $cantidad) {
            throw new \Exception("Stock insuficiente para el producto: {$producto->name}. Stock disponible: {$producto->cantidad}");
        }
    }

    /**
     * Obtener el local asignado al usuario actual
     */
    private function obtenerLocaleUsuario(): int
    {
        $user = Auth::user();
        $localeUser = $user->localeUser()->first();
        
        if (!$localeUser) {
            throw new \Exception('El usuario no tiene un local asignado');
        }
        
        return $localeUser->id_locale;
    }

    /**
     * Procesar múltiples formas de pago
     */
    private function procesarFormasPago(int $facturaVentaId, array $formasPago, float $total): void
    {
        $totalPagos = 0;
        
        foreach ($formasPago as $pago) {
            // Crear registro en forma_pago_facturas (relacionado con la factura)
            \App\Models\FormaPagoFactura::create([
                'id_factura_venta' => $facturaVentaId,
                'id_forma_pago' => $pago['forma_pago_id'],
                'monto' => $pago['monto'],
                'referencia' => $pago['referencia'] ?? null,
            ]);
            
            $totalPagos += $pago['monto'];
        }
        
        // Validar que los pagos coincidan con el total
        info('Validación de pagos', [
            'totalPagos' => $totalPagos,
            'total' => $total,
            'diferencia' => abs($totalPagos - $total),
            'tolerancia' => 0.01
        ]);
        
        if (abs($totalPagos - $total) > 0.01) {
            throw new \Exception('El total de los pagos no coincide con el monto total de la venta');
        }
    }

    /**
     * Generar registros de comisiones según reglas de negocio
     */
    private function generarComisiones(VentaCabezera $ventaCabezera, float $total): void
    {
        $tienePromotor = $ventaCabezera->id_promotor !== null;
        $tieneTecnico = $ventaCabezera->id_tecnico !== null;

        if ($tieneTecnico && $tienePromotor) {
            // Regla 40-30-30 cuando hay técnico y promotor
            $montoTecnico = $total * 0.40;
            $montoLocale = $total * 0.30;
            $montoPromotor = $total * 0.30;

            $this->crearRegistroTecnico($ventaCabezera, $montoTecnico);
            $this->crearRegistroPromotor($ventaCabezera, $montoPromotor);
            
        } elseif ($tieneTecnico) {
            // Regla 60-40 (técnico-negocio) cuando solo hay técnico
            $montoTecnico = $total * 0.60;
            $this->crearRegistroTecnico($ventaCabezera, $montoTecnico);
            
        } elseif ($tienePromotor) {
            // Solo promotor: sumar todos los montos de promotor de los productos
            $montoTotalPromotor = $ventaCabezera->ventas()->sum('monto_promotor');
            if ($montoTotalPromotor > 0) {
                $this->crearRegistroPromotor($ventaCabezera, $montoTotalPromotor);
            }
        }
    }

    /**
     * Crear registro de pago para técnico
     */
    private function crearRegistroTecnico(VentaCabezera $ventaCabezera, float $monto): void
    {
        VentaTecnico::create([
            'id_locale' => $ventaCabezera->locale_id,
            'id_tecnico' => $ventaCabezera->id_tecnico,
            'monto' => $monto,
            'id_factura_venta' => $this->obtenerOCrearFactura($ventaCabezera->id),
            'fecha_venta' => now()->toDateString(),
            'pagado' => 'N', // Pendiente de pago
        ]);
    }

    /**
     * Crear registro de pago para promotor
     */
    private function crearRegistroPromotor(VentaCabezera $ventaCabezera, float $monto): void
    {
        VentaPromotore::create([
            'id_promotor' => $ventaCabezera->id_promotor,
            'monto' => $monto,
            'id_factura_venta' => $this->obtenerOCrearFactura($ventaCabezera->id),
            'id_locale' => $ventaCabezera->locale_id,
            'fecha_venta' => now()->toDateString(),
            'pagado' => 'N', // Pendiente de pago
        ]);
    }

    /**
     * Obtener o crear factura para la venta
     */
    private function obtenerOCrearFactura(int $ventaCabezeraId): int
    {
        // Buscar si ya existe una factura para esta venta
        $factura = \App\Models\FacturaVenta::where('id_venta_cabezera', $ventaCabezeraId)->first();
        
        if (!$factura) {
            // Obtener tasa del día actual
            $tasaHoy = \App\Models\Tasabcv::whereDate('fecha', now()->format('Y-m-d'))->first();
            
            // Crear nueva factura
            $factura = \App\Models\FacturaVenta::create([
                'id_venta_cabezera' => $ventaCabezeraId,
                'id_locale' => 1, // Asumimos locale 1, puedes ajustar según necesites
                'nrofactura' => 'FAC-' . date('Y-m-d') . '-' . str_pad($ventaCabezeraId, 6, '0', STR_PAD_LEFT),
                'id_tasabcv' => $tasaHoy ? $tasaHoy->id : null,
            ]);
        }
        
        return $factura->id;
    }

    /**
     * Calcular totales de la venta
     */
    private function calcularTotales(array $productos, float $descuento = 0,$subtotal): array
    {
        info("calcular  totales",["productos"=>$productos,"subtota"=>$subtotal]);
       // $subtotal = collect($productos)->sum('subtotal');
        $ivaRate = config('app.iva', 16) / 100; // Usar configuración del IVA
        $iva = $subtotal * $ivaRate;
        $total = $subtotal + $iva - $descuento;

        info('Cálculo de totales', [
            'productos' => $productos,
            'subtotal' => $subtotal,
            'descuento' => $descuento,
            'ivaRate' => $ivaRate,
            'iva' => $iva,
            'total' => $total
        ]);

        return [
            'subtotal' => $subtotal,
            'iva' => $iva,
            'descuento' => $descuento,
            'total' => $total,
            'iva_rate' => $ivaRate * 100 // Para mostrar en frontend
        ];
    }
}
