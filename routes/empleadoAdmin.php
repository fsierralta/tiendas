<?php 
 use Illuminate\Support\Facades\Route;
 use App\Http\Controllers\EmpleadoController;
 
Route::prefix("admin")->group(function () {
    
    // Rutas de Empleados
    Route::get('/empleados', [EmpleadoController::class, 'index'])
        ->name('empleados.index')
        ->middleware('auth','verified','check.permission:read','checkRole:admin');

    Route::get('/empleados/create', [EmpleadoController::class, 'create'])
        ->name('empleados.create')
        ->middleware('auth','verified','check.permission:read','checkRole:admin');

    Route::post('/empleados', [EmpleadoController::class, 'store'])
        ->name('empleados.store')
        ->middleware('auth','verified','check.permission:create','checkRole:admin');

    Route::get('/empleados/{empleado}/edit', [EmpleadoController::class, 'edit'])
        ->name('empleados.edit')
        ->middleware('auth','verified','check.permission:read','checkRole:admin');

    Route::put('/empleados/{empleado}', [EmpleadoController::class, 'update'])
        ->name('empleados.update')
        ->middleware('auth','verified','check.permission:update','checkRole:admin');

    Route::delete('/empleados/{empleado}', [EmpleadoController::class, 'destroy'])
        ->name('empleados.destroy')
        ->middleware('auth','verified','check.permission:delete','checkRole:admin');
    
});
