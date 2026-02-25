<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VentaController;

Route::prefix('ventas')->group(function () {
    
    // Listado de ventas
    Route::get('/', [VentaController::class, 'index'])
        ->name('ventas.index')
        ->middleware('auth', 'verified', 'check.permission:read', 'checkRole:admin');
    
    // Formulario de creación de venta
    Route::get('/create', [VentaController::class, 'create'])
        ->name('ventas.create')
        ->middleware('auth', 'verified', 'check.permission:create', 'checkRole:admin');
    
    // Procesar venta
    Route::post('/', [VentaController::class, 'store'])
        ->name('ventas.store')
        ->middleware('auth', 'verified', 'check.permission:create', 'checkRole:admin');
    
    // Ver detalles de venta
    Route::get('/{venta}', [VentaController::class, 'show'])
        ->name('ventas.show')
        ->middleware('auth', 'verified', 'check.permission:read', 'checkRole:admin');
    
    // API endpoints para el proceso de ventas
    Route::prefix('api')->group(function () {
        // Buscar clientes en tiempo real
        Route::get('/buscar-clientes', [VentaController::class, 'buscarClientes'])
            ->name('api.ventas.buscar-clientes')
            ->middleware('auth', 'verified', 'check.permission:read', 'checkRole:admin');
        
        // Crear nuevo cliente
        Route::post('/crear-cliente', [VentaController::class, 'crearCliente'])
            ->name('api.ventas.crear-cliente')
          ->middleware('auth', 'verified', 'check.permission:create', 'checkRole:admin');
        
        // Buscar productos en tiempo real
        Route::get('/buscar-productos', [VentaController::class, 'buscarProductos'])
            ->name('api.ventas.buscar-productos')
            ->middleware('auth', 'verified', 'check.permission:read', 'checkRole:admin');
        
        // Obtener productos disponibles
        Route::get('/productos', [VentaController::class, 'getProductos'])
            ->name('api.ventas.productos')
            ->middleware('auth', 'verified', 'check.permission:read', 'checkRole:admin');
        
        // Validar stock
        Route::post('/validar-stock', [VentaController::class, 'validarStock'])
            ->name('api.ventas.validar-stock')
            ->middleware('auth', 'verified', 'check.permission:read', 'checkRole:admin');
        
        // Calcular totales
        Route::post('/calcular-totales', [VentaController::class, 'calcularTotales'])
            ->name('api.ventas.calcular-totales')
            ->middleware('auth', 'verified', 'check.permission:read', 'checkRole:admin');
    });
});
