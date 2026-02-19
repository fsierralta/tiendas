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
