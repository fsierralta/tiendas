<?php 
 use Illuminate\Support\Facades\Route;
 use App\Http\Controllers\TecnicoController;
 
Route::prefix("admin")->group(function () {
    
    // Rutas de Técnicos
    Route::get('/tecnicos', [TecnicoController::class, 'index'])
        ->name('tecnicos.index')
        ->middleware('auth','verified','check.permission:read','checkRole:admin');

    Route::get('/tecnicos/create', [TecnicoController::class, 'create'])
        ->name('tecnicos.create')
        ->middleware('auth','verified','check.permission:read','checkRole:admin');

    Route::post('/tecnicos', [TecnicoController::class, 'store'])
        ->name('tecnicos.store')
        ->middleware('auth','verified','check.permission:create','checkRole:admin');

    Route::get('/tecnicos/{tecnico}/edit', [TecnicoController::class, 'edit'])
        ->name('tecnicos.edit')
        ->middleware('auth','verified','check.permission:read','checkRole:admin');

    Route::put('/tecnicos/{tecnico}', [TecnicoController::class, 'update'])
        ->name('tecnicos.update')
        ->middleware('auth','verified','check.permission:update','checkRole:admin');

    Route::delete('/tecnicos/{tecnico}', [TecnicoController::class, 'destroy'])
        ->name('tecnicos.destroy')
        ->middleware('auth','verified','check.permission:delete','checkRole:admin');
    
});
