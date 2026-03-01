<?php 
 use Illuminate\Support\Facades\Route;
 use App\Http\Controllers\FormapagoController;
 use App\Crud;
Route::prefix("admin")->group(function () {
    
    // Rutas de Formas de Pago
    Route::get('/formapagos', [FormapagoController::class, 'index'])
        ->name('formapagos.index')
        ->middleware('auth','verified','check.permission:'.Crud::READ->value,'checkRole:admin');

    Route::get('/formapagos/create', [FormapagoController::class, 'create'])
        ->name('formapagos.create')
        ->middleware('auth','verified','check.permission:'.Crud::READ->value,'checkRole:admin');

    Route::post('/formapagos', [FormapagoController::class, 'store'])
        ->name('formapagos.store')
        ->middleware('auth','verified','check.permission:'.Crud::CREATE->value,'checkRole:admin');

    Route::get('/formapagos/{formapago}/edit', [FormapagoController::class, 'edit'])
        ->name('formapagos.edit')
        ->middleware('auth','verified','check.permission:'.Crud::READ->value,'checkRole:admin');

    Route::put('/formapagos/{formapago}', [FormapagoController::class, 'update'])
        ->name('formapagos.update')
        ->middleware('auth','verified','check.permission:'.Crud::UPDATE->value,'checkRole:admin');

    Route::delete('/formapagos/{formapago}', [FormapagoController::class, 'destroy'])
        ->name('formapagos.destroy')
        ->middleware('auth','verified','check.permission:'.Crud::DELETE->value,'checkRole:admin');
    
});
