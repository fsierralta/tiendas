<?php 
 use Illuminate\Support\Facades\Route;
 use App\Http\Controllers\EmpleadoUserController;
 
Route::prefix("admin")->group(function () {
    
    // Rutas de Asignación de Empleados a Usuarios
    Route::get('/empleado-users', [EmpleadoUserController::class, 'index'])
        ->name('empleadoUsers.index')
        ->middleware('auth','verified','check.permission:read','checkRole:admin');

    Route::get('/empleado-users/create', [EmpleadoUserController::class, 'create'])
        ->name('empleadoUsers.create')
        ->middleware('auth','verified','check.permission:read','checkRole:admin');

    Route::post('/empleado-users', [EmpleadoUserController::class, 'store'])
        ->name('empleadoUsers.store')
        ->middleware('auth','verified','check.permission:create','checkRole:admin');

    Route::get('/empleado-users/{empleadoUser}/edit', [EmpleadoUserController::class, 'edit'])
        ->name('empleadoUsers.edit')
        ->middleware('auth','verified','check.permission:read','checkRole:admin');

    Route::put('/empleado-users/{empleadoUser}', [EmpleadoUserController::class, 'update'])
        ->name('empleadoUsers.update')
        ->middleware('auth','verified','check.permission:update','checkRole:admin');

    Route::delete('/empleado-users/{empleadoUser}', [EmpleadoUserController::class, 'destroy'])
        ->name('empleadoUsers.destroy')
        ->middleware('auth','verified','check.permission:delete','checkRole:admin');
    
});
