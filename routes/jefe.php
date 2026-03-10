<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PagoController;
use App\Crud;

Route::middleware(['auth', 'verified', 'ensureLoginCodeVerified'])->group(function () {
   
Route::resource('pagos', PagoController::class)->only(['index', 'create', 'store'])
   ->middleware(['checkRole:jefe']);

// API endpoints para carga dinámica
Route::prefix('api/pagos')->group(function () {
    Route::get('/ventas-pendientes-promotor', [PagoController::class, 'getVentasPendientesPromotor'])
        ->middleware(['checkRole:jefe']);
    
    Route::get('/ventas-pendientes-tecnico', [PagoController::class, 'getVentasPendientesTecnico'])
        ->middleware(['checkRole:jefe']);
    
    Route::get('/formas-pago', [PagoController::class, 'getFormasPago'])
        ->middleware(['checkRole:jefe']);
});
});