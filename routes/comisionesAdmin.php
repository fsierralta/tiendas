<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ComisioneController;

Route::prefix("admin")->group(function () {
    // Rutas de Comisiones----------------------------

    Route::get('/comisiones', [ComisioneController::class, 'index'])
        ->name('comisiones.index')
        ->middleware('auth','verified','check.permission:read','checkRole:admin');

    Route::get('/comisiones/create', [ComisioneController::class, 'create'])
        ->name('comisiones.create')
        ->middleware('auth','verified','check.permission:create','checkRole:admin');

    Route::post('/comisiones', [ComisioneController::class, 'store'])
        ->name('comisiones.store')
        ->middleware('auth','verified','check.permission:create','checkRole:admin');

    Route::get('/comisiones/{comisione}/edit', [ComisioneController::class, 'edit'])
        ->name('comisiones.edit')
        ->middleware('auth','verified','check.permission:update','checkRole:admin');

    Route::put('/comisiones/{comisione}', [ComisioneController::class, 'update'])
        ->name('comisiones.update')
        ->middleware('auth','verified','check.permission:update','checkRole:admin');

    Route::delete('/comisiones/{comisione}', [ComisioneController::class, 'destroy'])
        ->name('comisiones.destroy')
        ->middleware('auth','verified','check.permission:delete','checkRole:admin');
});
