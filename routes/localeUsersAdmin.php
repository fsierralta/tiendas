<?php 
 use Illuminate\Support\Facades\Route;
 use App\Http\Controllers\LocaleUserController;
 
Route::prefix("admin")->group(function () {
    
    // Rutas de Asignación de Usuarios a Locales
    Route::get('/locale-users', [LocaleUserController::class, 'index'])
        ->name('localeUsers.index')
        ->middleware('auth','verified','check.permission:read','checkRole:admin');

    Route::get('/locale-users/create', [LocaleUserController::class, 'create'])
        ->name('localeUsers.create')
        ->middleware('auth','verified','check.permission:read','checkRole:admin');

    Route::post('/locale-users', [LocaleUserController::class, 'store'])
        ->name('localeUsers.store')
        ->middleware('auth','verified','check.permission:create','checkRole:admin');

    Route::get('/locale-users/{localeUser}/edit', [LocaleUserController::class, 'edit'])
        ->name('localeUsers.edit')
        ->middleware('auth','verified','check.permission:read','checkRole:admin');

    Route::put('/locale-users/{localeUser}', [LocaleUserController::class, 'update'])
        ->name('localeUsers.update')
        ->middleware('auth','verified','check.permission:update','checkRole:admin');

    Route::delete('/locale-users/{localeUser}', [LocaleUserController::class, 'destroy'])
        ->name('localeUsers.destroy')
        ->middleware('auth','verified','check.permission:delete','checkRole:admin');
    
});
