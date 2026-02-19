<?php 
 use Illuminate\Support\Facades\Route;
 use App\Http\Controllers\LocaleController;
 
Route::prefix("admin")->group(function () {
    
    // Rutas de Locales
    Route::get('/locales', [LocaleController::class, 'index'])
        ->name('locales.index')
        ->middleware('auth','verified','check.permission:read','checkRole:admin');

    Route::get('/locales/create', [LocaleController::class, 'create'])
        ->name('locales.create')
        ->middleware('auth','verified','check.permission:read','checkRole:admin');

    Route::post('/locales', [LocaleController::class, 'store'])
        ->name('locales.store')
        ->middleware('auth','verified','check.permission:create','checkRole:admin');

    Route::get('/locales/{locale}/edit', [LocaleController::class, 'edit'])
        ->name('locales.edit')
        ->middleware('auth','verified','check.permission:read','checkRole:admin');

    Route::put('/locales/{locale}', [LocaleController::class, 'update'])
        ->name('locales.update')
        ->middleware('auth','verified','check.permission:update','checkRole:admin');

    Route::delete('/locales/{locale}', [LocaleController::class, 'destroy'])
        ->name('locales.destroy')
        ->middleware('auth','verified','check.permission:delete','checkRole:admin');
    
});
