<?php

use App\Http\Controllers\UbicacionController;
use Illuminate\Support\Facades\Route;
 use App\Crud;
Route::prefix("admin")->group(function () {
    // Rutas de Ubicaciones----------------------------

    Route::get('/ubicaciones', [UbicacionController::class, 'index'])
        ->name('ubicaciones.index')
        ->middleware('auth','verified','check.permission:'.Crud::READ->value,'checkRole:admin');

    Route::get('/ubicaciones/create', [UbicacionController::class, 'create'])
        ->name('ubicaciones.create')
        ->middleware('auth','verified','check.permission:'.Crud::READ->value,'checkRole:admin');

    Route::post('/ubicaciones', [UbicacionController::class, 'store'])
        ->name('ubicaciones.store')
        ->middleware('auth','verified','check.permission:'.Crud::CREATE->value,'checkRole:admin');

    Route::get('/ubicaciones/{ubicacion}/edit', [UbicacionController::class, 'edit'])
        ->name('ubicaciones.edit')
        ->middleware('auth','verified','check.permission:'.Crud::READ->value,'checkRole:admin');

    Route::put('/ubicaciones/{ubicacion}', [UbicacionController::class, 'update'])
        ->name('ubicaciones.update')
        ->middleware('auth','verified','check.permission:'.Crud::UPDATE->value,'checkRole:admin');

    Route::delete('/ubicaciones/{ubicacion}', [UbicacionController::class, 'destroy'])
        ->name('ubicaciones.destroy')
        ->middleware('auth','verified','check.permission:'.Crud::DELETE->value,'checkRole:admin');
});
