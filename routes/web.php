<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

require __DIR__.'/settings.php';

require __DIR__.'/tiendaAdmin.php';

require __DIR__.'/localesAdmin.php';

require __DIR__.'/empleadoAdmin.php';

require __DIR__.'/cargosAdmin.php';

require __DIR__.'/cargoEmpleadoAdmin.php';

require __DIR__.'/categoriasAdmin.php';

require __DIR__.'/promotoresAdmin.php';

require __DIR__.'/tecnicosAdmin.php';

require __DIR__.'/formapagosAdmin.php';

require __DIR__.'/tasabcvsAdmin.php';

require __DIR__.'/empleadoUsersAdmin.php';

require __DIR__.'/localeUsersAdmin.php';

require __DIR__.'/localeEmpleadosAdmin.php';

require __DIR__.'/productosAdmin.php';

require __DIR__.'/ubicacionesAdmin.php';

require __DIR__.'/comisionesAdmin.php';

require __DIR__.'/clientesAdmin.php';   

require __DIR__.'/ventas.php';

//require __DIR__.'/ventasVendedor.php';

// Rutas de clientes para el módulo de ventas (sin prefijo admin)
Route::middleware(['auth', 'verified'])->group(function () {
    // Buscar clientes para ventas
    Route::get('/clientes/buscar', [App\Http\Controllers\ClienteController::class, 'buscar'])
        ->name('clientes.buscar');
    
    // Crear cliente desde ventas (AJAX)
    Route::post('/clientes', [App\Http\Controllers\ClienteController::class, 'store'])
        ->name('clientes.store.ventas');
});


