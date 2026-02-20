<?php 
 use Illuminate\Support\Facades\Route;
 use App\Http\Controllers\ProductoController;
 
Route::prefix("admin")->group(function () {
    
    // Rutas de Productos
    Route::get('/productos', [ProductoController::class, 'index'])
        ->name('productos.index')
        ->middleware('auth','verified','check.permission:read','checkRole:admin');

    Route::get('/productos/create', [ProductoController::class, 'create'])
        ->name('productos.create')
        ->middleware('auth','verified','check.permission:read','checkRole:admin');

    Route::post('/productos', [ProductoController::class, 'store'])
        ->name('productos.store')
        ->middleware('auth','verified','check.permission:create','checkRole:admin');

    Route::get('/productos/{producto}/edit', [ProductoController::class, 'edit'])
        ->name('productos.edit')
        ->middleware('auth','verified','check.permission:read','checkRole:admin');

    Route::put('/productos/{producto}', [ProductoController::class, 'update'])
        ->name('productos.update')
        ->middleware('auth','verified','check.permission:update','checkRole:admin');

    Route::delete('/productos/{producto}', [ProductoController::class, 'destroy'])
        ->name('productos.destroy')
        ->middleware('auth','verified','check.permission:delete','checkRole:admin');
    
});
