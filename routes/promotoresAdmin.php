<?php 
 use Illuminate\Support\Facades\Route;
 use App\Http\Controllers\PromotoreController;
 use App\Crud;
Route::prefix("admin")->group(function () {
    
    // Rutas de Promotores
    Route::get('/promotores', [PromotoreController::class, 'index'])
        ->name('promotores.index')
        ->middleware('auth','verified','check.permission:'.Crud::READ->value,'checkRole:admin');

    Route::get('/promotores/create', [PromotoreController::class, 'create'])
        ->name('promotores.create')
        ->middleware('auth','verified','check.permission:'.Crud::READ->value,'checkRole:admin');

    Route::post('/promotores', [PromotoreController::class, 'store'])
        ->name('promotores.store')
        ->middleware('auth','verified','check.permission:'.Crud::CREATE->value,'checkRole:admin');

    Route::get('/promotores/{promotore}/edit', [PromotoreController::class, 'edit'])
        ->name('promotores.edit')
        ->middleware('auth','verified','check.permission:'.Crud::READ->value,'checkRole:admin');

    Route::put('/promotores/{promotore}', [PromotoreController::class, 'update'])
        ->name('promotores.update')
        ->middleware('auth','verified','check.permission:'.Crud::UPDATE->value,'checkRole:admin');

    Route::delete('/promotores/{promotore}', [PromotoreController::class, 'destroy'])
        ->name('promotores.destroy')
        ->middleware('auth','verified','check.permission:'.Crud::DELETE->value,'checkRole:admin');
    
});
