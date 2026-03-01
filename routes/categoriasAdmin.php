<?php 
 use Illuminate\Support\Facades\Route;
 use App\Http\Controllers\CategoriaController;
 use App\Crud;
 
Route::prefix("admin")->group(function () {
    
    // Rutas de Categorías
    Route::get('/categorias', [CategoriaController::class, 'index'])
        ->name('categorias.index')
        ->middleware('auth','verified','check.permission:'.Crud::READ->value,'checkRole:admin');

    Route::get('/categorias/create', [CategoriaController::class, 'create'])
        ->name('categorias.create')
        ->middleware('auth','verified','check.permission:'.Crud::READ->value,'checkRole:admin');

    Route::post('/categorias', [CategoriaController::class, 'store'])
        ->name('categorias.store')
        ->middleware('auth','verified','check.permission:'.Crud::CREATE->value,'checkRole:admin');

    Route::get('/categorias/{categoria}/edit', [CategoriaController::class, 'edit'])
        ->name('categorias.edit')
        ->middleware('auth','verified','check.permission:'.Crud::READ->value,'checkRole:admin');

    Route::put('/categorias/{categoria}', [CategoriaController::class, 'update'])
        ->name('categorias.update')
        ->middleware('auth','verified','check.permission:'.Crud::UPDATE->value,'checkRole:admin');

    Route::delete('/categorias/{categoria}', [CategoriaController::class, 'destroy'])
        ->name('categorias.destroy')
        ->middleware('auth','verified','check.permission:'.Crud::DELETE->value,'checkRole:admin');
    
});
