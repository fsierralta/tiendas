<?php 
 use Illuminate\Support\Facades\Route;
 use App\Http\Controllers\TasabcvController;
 
Route::prefix("admin")->group(function () {
    
    // Rutas de Tasas BCV
    Route::get('/tasabcvs', [TasabcvController::class, 'index'])
        ->name('tasabcvs.index')
        ->middleware('auth','verified','check.permission:read','checkRole:admin');

    Route::get('/tasabcvs/create', [TasabcvController::class, 'create'])
        ->name('tasabcvs.create')
        ->middleware('auth','verified','check.permission:read','checkRole:admin');

    Route::post('/tasabcvs', [TasabcvController::class, 'store'])
        ->name('tasabcvs.store')
        ->middleware('auth','verified','check.permission:create','checkRole:admin');

    Route::get('/tasabcvs/{tasabcv}/edit', [TasabcvController::class, 'edit'])
        ->name('tasabcvs.edit')
        ->middleware('auth','verified','check.permission:read','checkRole:admin');

    Route::put('/tasabcvs/{tasabcv}', [TasabcvController::class, 'update'])
        ->name('tasabcvs.update')
        ->middleware('auth','verified','check.permission:update','checkRole:admin');

    Route::delete('/tasabcvs/{tasabcv}', [TasabcvController::class, 'destroy'])
        ->name('tasabcvs.destroy')
        ->middleware('auth','verified','check.permission:delete','checkRole:admin');
    
});
