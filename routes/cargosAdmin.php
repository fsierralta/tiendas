<?php 
 use Illuminate\Support\Facades\Route;
 use App\Http\Controllers\CargoController;
 
Route::prefix("admin")->group(function () {
    
    // Rutas de Cargos
    Route::get('/cargos', [CargoController::class, 'index'])
        ->name('cargos.index')
        ->middleware('auth','verified','check.permission:read','checkRole:admin');

    Route::get('/cargos/create', [CargoController::class, 'create'])
        ->name('cargos.create')
        ->middleware('auth','verified','check.permission:read','checkRole:admin');

    Route::post('/cargos', [CargoController::class, 'store'])
        ->name('cargos.store')
        ->middleware('auth','verified','check.permission:create','checkRole:admin');

    Route::get('/cargos/{cargo}/edit', [CargoController::class, 'edit'])
        ->name('cargos.edit')
        ->middleware('auth','verified','check.permission:read','checkRole:admin');

    Route::put('/cargos/{cargo}', [CargoController::class, 'update'])
        ->name('cargos.update')
        ->middleware('auth','verified','check.permission:update','checkRole:admin');

    Route::delete('/cargos/{cargo}', [CargoController::class, 'destroy'])
        ->name('cargos.destroy')
        ->middleware('auth','verified','check.permission:delete','checkRole:admin');
    Route::get(" /admin/cargo-empleados,",[CargoController::class,"asignarcargo"])
    ->name('cargo.asignacargo')
    ->middleware("auth","verified",'check.permission:read','checkRole:admin');
        
    
});
