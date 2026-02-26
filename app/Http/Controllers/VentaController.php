<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreVentaRequest;
use App\Http\Requests\UpdateVentaRequest;
use App\Models\VentaCabezera;
use App\Models\Venta;
use App\Models\Producto;
use App\Models\Formapago;
use App\Services\VentaService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class VentaController extends Controller
{
    public function __construct(private VentaService $ventaService)
    {
        // El middleware se define en las rutas, no en el constructor
    }

    /**
     * Mostrar formulario para crear nueva venta
     */
    public function create(Request $request)
    {
        // Obtener productos del local del usuario
       // info("create",['requet crearte'=>$request]);
        $productos = Producto::whereHas('locale', function ($query) {
            $query->whereHas('localeUser', function ($subQuery) {
                $subQuery->where('id_user', auth()->id());
            });
        })->with(['categoria', 'ubicacion'])->get();

        // Obtener formas de pago
        $formasPago = Formapago::all();

        // Obtener clientes
        $clientes = \App\Models\Cliente::all();

        // Obtener promotores
        $promotores = \App\Models\Promotore::all();

        // Obtener técnicos
        $tecnicos = \App\Models\Tecnico::all();

        // Obtener configuración del IVA
        $ivaRate = config('app.iva', 16);

        return Inertia::render('Ventas/Create', [
            'productos' => $productos,
            'formasPago' => $formasPago,
            'clientes' => $clientes,
            'promotores' => $promotores,
            'tecnicos' => $tecnicos,
            'ivaRate' => $ivaRate,
        ]);
    }

    /**
     * Almacenar una nueva venta
     */
    public function store(StoreVentaRequest $request){
        try {
            $venta = $this->ventaService->procesarVenta($request->validated());
            
            return redirect()->route("ventas.index") 
            ->with([
                'success' => 'Venta procesada exitosamente',
                //'venta' => $venta->load(['cliente', 'ventas.producto', 'ventaFooter'])
            ]);

        } catch (\Exception $e) {
            info('error',[
                'message' => 'Error al procesar la venta: ' . $e->getMessage()."linea:".$e->getLine().'archivo:'.$e->getFile()
            ]);

            return redirect()->route("ventas.index")
            ->with ([
                'error' => 'Error al procesar la venta: ' . $e->getMessage()."linea:".$e->getLine().'archivo:'.$e->getFile()
            ]);
        }
    }

    /**
     * Mostrar lista de ventas del usuario
     */
    public function index(Request $request)
    {
        $ventas = VentaCabezera::where('user_id', auth()->id())
            ->with(['cliente', 'ventas.producto', 'ventaFooter', 'promotor', 'tecnico'])
            ->when($request->search, function ($query, $search) {
                $query->whereHas('cliente', function ($subQuery) use ($search) {
                    $subQuery->where('name', 'like', "%{$search}%")
                            ->orWhere('cedula_rif', 'like', "%{$search}%");
                });
            })
            ->when($request->fecha_inicio, function ($query, $fecha) {
                $query->where('fecha', '>=', $fecha);
            })
            ->when($request->fecha_fin, function ($query, $fecha) {
                $query->where('fecha', '<=', $fecha);
            })
            ->orderBy('fecha', 'desc')
            ->paginate(2);

        // Agregar logging para depuración
        info('Ventas Index', [
            'ventas_count' => $ventas->count(),
            'primera_venta' => $ventas->first(),
            'ventaFooter_primera' => $ventas->first()?->ventaFooter,
            'ventaFooter_count_primera' => $ventas->first()?->ventaFooter?->count()
        ]);

        return Inertia::render('Ventas/Index', [
            'ventas' => $ventas,
        ]);
    }

    /**
     * Mostrar detalles de una venta específica
     */
    public function show(VentaCabezera $venta)
    {
        // Verificar que el usuario tenga acceso a esta venta
        if ($venta->user_id !== auth()->id()) {
            abort(403);
        }

        $venta->load([
            'cliente',
            'ventas.producto',
            'ventaFooter',
            'formaPagos.formaPago',
            'promotor',
            'tecnico',
            'locale'
        ]);

        return Inertia::render('Ventas/Show', [
            'venta' => $venta,
        ]);
    }

    /**
     * Buscar clientes en tiempo real
     */
    public function buscarClientes(Request $request): JsonResponse
    {
        $query = \App\Models\Cliente::query();

        // Filtro por nombre
        if ($request->filled('nombre')) {
            $query->where('name', 'like', '%' . $request->nombre . '%');
        }

        // Filtro por apellido
        if ($request->filled('apellido')) {
            $query->where('apellido', 'like', '%' . $request->apellido . '%');
        }

        // Filtro por cédula/RIF
        if ($request->filled('cedula_rif')) {
            $query->where('cedula_rif', 'like', '%' . $request->cedula_rif . '%');
        }

        // Limitar resultados para mejor performance
        $clientes = $query->limit(50)->get();

        return response()->json($clientes);
    }

    /**
     * Crear un nuevo cliente
     */
    public function crearCliente(Request $request): JsonResponse
    {
     //  info("API",["APIDATA"=>$request]);
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'apellido' => 'required|string|max:255',
                'cedula_rif' => 'required|string|max:50|unique:clientes,cedula_rif',
                'email' => 'nullable|email|max:255',
                'telefono' => 'nullable|string|max:50',
                'ciudad' => 'nullable|string|max:255',
                'direccion' => 'nullable|string|max:255',
                'tipo' => 'required|string|max:1',
            ], [
                'name.required' => 'El nombre es obligatorio',
                'apellido.required' => 'El apellido es obligatorio',
                'cedula_rif.required' => 'La cédula/RIF es obligatoria',
                'cedula_rif.unique' => 'Esta cédula/RIF ya está registrada',
                'email.email' => 'El email debe ser válido',
                'tipo.required' => 'El tipo de cliente es obligatorio',
            ]);

            $cliente = \App\Models\Cliente::create($validated);

            return response()->json([
                'success' => true,
                'cliente' => $cliente,
                'message' => 'Cliente creado exitosamente'
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors' => $e->errors(),
                'message' => 'Error de validación'
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el cliente: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Buscar productos en tiempo real
     */
    public function buscarProductos(Request $request): JsonResponse
    {
        $query = Producto::whereHas('locale', function ($query) {
            $query->whereHas('localeUser', function ($subQuery) {
                $subQuery->where('id_user', auth()->id());
            });
        })->with(['categoria', 'ubicacion']);

        // Filtro por nombre
        if ($request->filled('nombre')) {
            $query->where('name', 'like', '%' . $request->nombre . '%');
        }

        // Filtro por marca
        if ($request->filled('marca')) {
            $query->where('marca', 'like', '%' . $request->marca . '%');
        }

        // Solo productos con stock
        $query->where('cantidad', '>', 0);

        // Limitar resultados para mejor performance
        $productos = $query->limit(50)->get();

        return response()->json($productos);
    }

    /**
     * Obtener productos disponibles para venta (API endpoint)
     */
    public function getProductos(): JsonResponse
    {
        $productos = Producto::whereHas('locale', function ($query) {
            $query->whereHas('localeUser', function ($subQuery) {
                $subQuery->where('id_user', auth()->id());
            });
        })
        ->where('cantidad', '>', 0)
        ->with(['categoria', 'ubicacion'])
        ->get();

        return response()->json($productos);
    }

    /**
     * Validar stock de productos antes de la venta
     */
    public function validarStock(Request $request): JsonResponse
    {
        $request->validate([
            'productos' => 'required|array',
            'productos.*.id_producto' => 'required|exists:productos,id',
            'productos.*.cantidad' => 'required|integer|min:1',
        ]);

        $productosSinStock = [];
        
        foreach ($request->productos as $productoData) {
            $producto = Producto::find($productoData['id_producto']);
            
            if ($producto->cantidad < $productoData['cantidad']) {
                $productosSinStock[] = [
                    'producto' => $producto->name,
                    'solicitado' => $productoData['cantidad'],
                    'disponible' => $producto->cantidad,
                ];
            }
        }

        if (count($productosSinStock) > 0) {
            return response()->json([
                'valid' => false,
                'message' => 'Productos con stock insuficiente',
                'productos' => $productosSinStock,
            ], 422);
        }

        return response()->json(['valid' => true]);
    }

    /**
     * Calcular totales de la venta en tiempo real
     */
    public function calcularTotales(Request $request): JsonResponse
    {
        $request->validate([
            'productos' => 'required|array',
            'productos.*.id_producto' => 'required|exists:productos,id',
            'productos.*.cantidad' => 'required|integer|min:1',
            'descuento' => 'nullable|numeric|min:0',
        ]);

        $subtotal = 0;
        $detalles = [];

        foreach ($request->productos as $productoData) {
            $producto = Producto::find($productoData['id_producto']);
            $subtotalProducto = $producto->precio * $productoData['cantidad'];
            $subtotal += $subtotalProducto;
            
            $detalles[] = [
                'id_producto' => $producto->id,
                'nombre' => $producto->name,
                'cantidad' => $productoData['cantidad'],
                'precio_unitario' => $producto->precio,
                'subtotal' => $subtotalProducto,
            ];
        }

        $iva = $subtotal * 0.16;
        $descuento = $request->descuento ?? 0;
        $total = $subtotal + $iva - $descuento;

        return response()->json([
            'subtotal' => $subtotal,
            'iva' => $iva,
            'descuento' => $descuento,
            'total' => $total,
            'detalles' => $detalles,
        ]);
    }

    /**
     * Eliminar una venta
     */
    public function destroy($id)
    {
     

        try {
            $venta=VentaCabezera::findOrFail($id);
            info("venta",["ventacabezera"=>$venta]);
            // Verificar que el usuario tenga acceso a esta venta
            if ($venta->user_id !== auth()->id()) {
                abort(403, 'No tienes permiso para eliminar esta venta');
            }

            // Usar una transacción para asegurar la integridad de los datos
            DB::transaction(function () use ($venta) {
                // Restaurar stock de productos
                foreach ($venta->ventas as $ventaDetalle) {
                    $producto = $ventaDetalle->producto;
                    if ($producto) {
                        $producto->increment('cantidad', $ventaDetalle->cantidad);
                    }
                }

                // Eliminar registros relacionados en orden correcto
                // 1. Formas de pago
                $venta->formaPagos()->delete();
                
                // 2. Footer de venta
                $venta->ventaFooter()->delete();
                
                // 3. Detalles de venta (con restauración de stock)
                $venta->ventas()->delete();
                
                // 4. Comisiones de promotor y técnico
                \App\Models\VentaPromotore::where('id_factura_venta', function($query) use ($venta) {
                    $query->select('id')->from('factura_ventas')->where('id_venta_cabezera', $venta->id);
                })->delete();
                
                \App\Models\VentaTecnico::where('id_factura_venta', function($query) use ($venta) {
                    $query->select('id')->from('factura_ventas')->where('id_venta_cabezera', $venta->id);
                })->delete();
                
                // 5. Factura
                \App\Models\FacturaVenta::where('id_venta_cabezera', $venta->id)->delete();
                
                // 6. Finalmente eliminar la cabezera
                $venta->delete();
            });

            return redirect()->route('ventas.index')
                ->with('success', 'Venta eliminada exitosamente 02');

        } catch (\Exception $e) {
            info('Error al eliminar venta', [
                'venta_id' => $venta->id,
                'error' => $e->getMessage(),
                'linea' => $e->getLine(),
                'archivo' => $e->getFile()
            ]);

            return redirect()->route('ventas.index')
                ->with('error', 'Error al eliminar la venta: ' . $e->getMessage());
        }
    }
}
