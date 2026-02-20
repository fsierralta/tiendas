<?php

use App\Http\Controllers\UbicacionController;
use Illuminate\Support\Facades\Route;

Route::prefix("admin")->group(function () {
    // Rutas de Ubicaciones----------------------------

    Route::get('/ubicaciones', [UbicacionController::class, 'index'])
        ->name('ubicaciones.index')
        ->middleware('auth','verified','check.permission:read','checkRole:admin');

    Route::get('/ubicaciones/create', [UbicacionController::class, 'create'])
        ->name('ubicaciones.create')
        ->middleware('auth','verified','check.permission:read','checkRole:admin');

    Route::post('/ubicaciones', [UbicacionController::class, 'store'])
        ->name('ubicaciones.store')
        ->middleware('auth','verified','check.permission:create','checkRole:admin');

    Route::get('/ubicaciones/{ubicacion}/edit', [UbicacionController::class, 'edit'])
        ->name('ubicaciones.edit')
        ->middleware('auth','verified','check.permission:read','checkRole:admin');

    Route::put('/ubicaciones/{ubicacion}', [UbicacionController::class, 'update'])
        ->name('ubicaciones.update')
        ->middleware('auth','verified','check.permission:update','checkRole:admin');

    Route::delete('/ubicaciones/{ubicacion}', [UbicacionController::class, 'destroy'])
        ->name('ubicaciones.destroy')
        ->middleware('auth','verified','check.permission:delete','checkRole:admin');
});
