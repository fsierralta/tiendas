<?php 
 use Illuminate\Support\Facades\Route;
 use App\Http\Controllers\LocaleEmpleadoController;
 use App\Crud;
Route::prefix("admin")->group(function () {
    
    // Rutas de Asignación de Empleados a Locales
    Route::get('/locale-empleados', [LocaleEmpleadoController::class, 'index'])
        ->name('localeEmpleados.index')
        ->middleware('auth','verified','check.permission:'.Crud::READ->value,'checkRole:admin');

    Route::get('/locale-empleados/create', [LocaleEmpleadoController::class, 'create'])
        ->name('localeEmpleados.create')
        ->middleware('auth','verified','check.permission:'.Crud::READ->value,'checkRole:admin');

    Route::post('/locale-empleados', [LocaleEmpleadoController::class, 'store'])
        ->name('localeEmpleados.store')
        ->middleware('auth','verified','check.permission:'.Crud::CREATE->value,'checkRole:admin');

    Route::get('/locale-empleados/{localeEmpleado}/edit', [LocaleEmpleadoController::class, 'edit'])
        ->name('localeEmpleados.edit')
        ->middleware('auth','verified','check.permission:'.Crud::READ->value,'checkRole:admin');

    Route::put('/locale-empleados/{localeEmpleado}', [LocaleEmpleadoController::class, 'update'])
        ->name('localeEmpleados.update')
        ->middleware('auth','verified','check.permission:'.Crud::UPDATE->value,'checkRole:admin');

    Route::delete('/locale-empleados/{localeEmpleado}', [LocaleEmpleadoController::class, 'destroy'])
        ->name('localeEmpleados.destroy')
        ->middleware('auth','verified','check.permission:'.Crud::DELETE->value,'checkRole:admin');
    
});
