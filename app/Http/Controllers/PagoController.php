<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePagoRequest;
use App\Models\Pago;
use App\Models\VentaPromotore;
use App\Models\VentaTecnico;
use App\Models\Formapago;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;


class PagoController extends Controller
{
    public function index(Request $request)
    {
        $query = Pago::with(['formapago', 'user', 'ventaPromotor', 'ventaTecnico']);
        
        // Filtros
        if ($request->filled('fecha_inicio')) {
            $query->whereDate('fecha', '>=', $request->fecha_inicio);
        }
        
        if ($request->filled('fecha_fin')) {
            $query->whereDate('fecha', '<=', $request->fecha_fin);
        }
        
        if ($request->filled('tipo')) {
            if ($request->tipo === 'promotor') {
                $query->whereNotNull('venta_promotore_id');
            } elseif ($request->tipo === 'tecnico') {
                $query->whereNotNull('venta_tecnico_id');
            }
        }
        
        if ($request->filled('responsable')) {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->responsable . '%');
            });
        }
        
        $pagos = $query->latest()->paginate(15);
        
        // Calcular totales
        $totalPagado = $query->sum('monto');
        $totalPromotores = Pago::whereNotNull('venta_promotore_id')->sum('monto');
        $totalTecnicos = Pago::whereNotNull('venta_tecnico_id')->sum('monto');
        
        return Inertia::render('Pagos/Index', [
            'pagos' => $pagos,
            'filters' => $request->only(['fecha_inicio', 'fecha_fin', 'tipo', 'responsable']),
            'totales' => [
                'total_pagado' => $totalPagado,
                'total_promotores' => $totalPromotores,
                'total_tecnicos' => $totalTecnicos,
            ]
        ]);
    }

    public function create()
    {
        return Inertia::render('Pagos/Create');
    }

    /**
     * Obtener ventas pendientes de promotores
     */
    public function getVentasPendientesPromotor(): JsonResponse
    {
        info("Cargando ventas pendientes de promotor");
        
        $ventas = VentaPromotore::where('pagado', 'N')
            ->with([
                'promotor',
                'facturaVenta.ventaCabezera.cliente',
                'facturaVenta.ventaCabezera.user'
            ])
            ->get();
            
        info("Ventas encontradas", ['count' => $ventas->count(), 'data' => $ventas->toArray()]);
        
        $result = $ventas->map(function ($venta) {
            return [
                'id' => $venta->id,
                'monto' => $venta->monto,
                'fecha_venta' => $venta->fecha_venta,
                'promotor' => $venta->promotor?->name,
                'cliente' => $venta->facturaVenta?->ventaCabezera?->cliente?->name,
                'vendedor' => $venta->facturaVenta?->ventaCabezera?->user?->name,
                'descripcion' => "Promotor: {$venta->promotor?->name} - Cliente: {$venta->facturaVenta?->ventaCabezera?->cliente?->name}"
            ];
        });

        return response()->json($result);
    }

    /**
     * Obtener ventas pendientes de técnicos
     */
    public function getVentasPendientesTecnico(): JsonResponse
    {
        info("Cargando ventas pendientes de técnico");
        
        $ventas = VentaTecnico::where('pagado', 'N')
            ->with([
                'tecnico',
                'facturaVenta.ventaCabezera.cliente',
                'facturaVenta.ventaCabezera.user'
            ])
            ->get();
            
        info("Ventas encontradas", ['count' => $ventas->count(), 'data' => $ventas->toArray()]);
        
        $result = $ventas->map(function ($venta) {
            return [
                'id' => $venta->id,
                'monto' => $venta->monto,
                'fecha_venta' => $venta->fecha_venta,
                'tecnico' => $venta->tecnico?->name,
                'cliente' => $venta->facturaVenta?->ventaCabezera?->cliente?->name,
                'vendedor' => $venta->facturaVenta?->ventaCabezera?->user?->name,
                'descripcion' => "Técnico: {$venta->tecnico?->name} - Cliente: {$venta->facturaVenta?->ventaCabezera?->cliente?->name}"
            ];
        });

        return response()->json($result);
    }

    /**
     * Obtener formas de pago para select
     */
    public function getFormasPago(): JsonResponse
    {
        $formasPago = Formapago::select('id', 'name')
            ->orderBy('name')
            ->get();

        return response()->json($formasPago);
    }

    public function store(StorePagoRequest $request)
    {
       // info("pago",["pago"=>$request]);
       $validated = $request->validated();
        try{
        info("Datos recibidos", ["request" => $request->all(), "validated" => $validated]);
        
        DB::transaction(function () use ($validated) {
            $pago = new Pago();
            $pago->monto = $validated['monto'];
            $pago->fecha = $validated['fecha'];
            $pago->referencia = $validated['referencia'] ?? null;
            $pago->observacion = $validated['observacion'] ?? null;
            $pago->formapago_id = $validated['formapago_id'];
            $pago->user_id = auth()->id();
            
            if ($validated['tipo_venta'] === 'promotor') {
                $pago->venta_promotore_id = $validated['venta_id'];
                $venta = VentaPromotore::findOrFail($validated['venta_id']);
            } else {
                $pago->venta_tecnico_id = $validated['venta_id'];
                $venta = VentaTecnico::findOrFail($validated['venta_id']);
            }
            
            $pago->save();

            // Marcar la venta como pagada
            $venta->pagado = 'S';
            $venta->fecha_pago = now();
            $venta->save();
        });

        return redirect()->route('pagos.index')->with('success', 'Pago registrado correctamente.');
        } catch (\Exception $e) {
            info("error",["pago"=>$e->getMessage()       ]);
            return redirect()->back()->with('error', 'Error al registrar el pago: ' . $e->getMessage());
        }
    }

}
