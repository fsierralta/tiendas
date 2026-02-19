<?php 
 use Illuminate\Support\Facades\Route;
 use App\Http\Controllers\CargoEmpeladoController;
 
Route::prefix("admin")->group(function () {
    
    // Rutas de Asignación de Cargos a Empleados
    Route::get('/cargo-empleados', [CargoEmpeladoController::class, 'index'])
        ->name('cargoEmpleados.index')
        ->middleware('auth','verified','check.permission:read','checkRole:admin');

    Route::get('/cargo-empleados/create', [CargoEmpeladoController::class, 'create'])
        ->name('cargoEmpleados.create')
        ->middleware('auth','verified','check.permission:read','checkRole:admin');

    Route::post('/cargo-empleados', [CargoEmpeladoController::class, 'store'])
        ->name('cargoEmpleados.store')
        ->middleware('auth','verified','check.permission:create','checkRole:admin');

    Route::get('/cargo-empleados/{cargoEmpleado}/edit', [CargoEmpeladoController::class, 'edit'])
        ->name('cargoEmpleados.edit')
        ->middleware('auth','verified','check.permission:read','checkRole:admin');

    Route::put('/cargo-empleados/{cargoEmpleado}', [CargoEmpeladoController::class, 'update'])
        ->name('cargoEmpleados.update')
        ->middleware('auth','verified','check.permission:update','checkRole:admin');

    Route::delete('/cargo-empleados/{cargoEmpleado}', [CargoEmpeladoController::class, 'destroy'])
        ->name('cargoEmpleados.destroy')
        ->middleware('auth','verified','check.permission:delete','checkRole:admin');
    
});
