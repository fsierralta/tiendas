<?php 
 use Illuminate\Support\Facades\Route;
 use App\Http\Controllers\CategoriaController;
 
Route::prefix("admin")->group(function () {
    
    // Rutas de Categorías
    Route::get('/categorias', [CategoriaController::class, 'index'])
        ->name('categorias.index')
        ->middleware('auth','verified','check.permission:read','checkRole:admin');

    Route::get('/categorias/create', [CategoriaController::class, 'create'])
        ->name('categorias.create')
        ->middleware('auth','verified','check.permission:read','checkRole:admin');

    Route::post('/categorias', [CategoriaController::class, 'store'])
        ->name('categorias.store')
        ->middleware('auth','verified','check.permission:create','checkRole:admin');

    Route::get('/categorias/{categoria}/edit', [CategoriaController::class, 'edit'])
        ->name('categorias.edit')
        ->middleware('auth','verified','check.permission:read','checkRole:admin');

    Route::put('/categorias/{categoria}', [CategoriaController::class, 'update'])
        ->name('categorias.update')
        ->middleware('auth','verified','check.permission:update','checkRole:admin');

    Route::delete('/categorias/{categoria}', [CategoriaController::class, 'destroy'])
        ->name('categorias.destroy')
        ->middleware('auth','verified','check.permission:delete','checkRole:admin');
    
});
