<?php
    use Illuminate\Support\Facades\Route;
    use App\Http\Controllers\VentaController;
    use App\Crud;
Route::prefix('ventasvendedor')->group(function () {
    
    // Listado de ventas
    Route::get('/', [VentaController::class, 'index'])
        ->name('ventasvendedor.index')
        ->middleware('auth', 'verified', 'check.permission:'.Crud::READ->value, 'checkRole:vendedor');
    
    // Formulario de creación de venta
    Route::get('/create', [VentaController::class, 'create'])
        ->name('ventasvendedor.create')
        ->middleware('auth', 'verified', 'check.permission:'.Crud::CREATE->value, 'checkRole:vendedor');
    
    // Procesar venta
    Route::post('/', [VentaController::class, 'store'])
        ->name('ventasvendedor.store')
        ->middleware('auth', 'verified', 'check.permission:'.Crud::CREATE->value, 'checkRole:vendedor');
    
    // Ver detalles de venta
    Route::get('/{venta}', [VentaController::class, 'show'])
        ->name('ventasvendedor.show')
        ->middleware('auth', 'verified', 'check.permission:'.Crud::READ->value, 'checkRole:vendedor');
    
     Route::delete('/{id}',[VentaController::class,"destroy"])
     ->name('ventasvendedor.destroy')
     ->middleware('auth', 'verified', 'check.permission:'.Crud::DELETE->value, 'checkRole:admin');  

    // API endpoints para el proceso de ventas
    
      
   
});