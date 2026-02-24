<?php
 use Illuminate\Support\Facades\Route;
 use App\Http\Controllers\CargoController;
 use App\Http\Controllers\RoleController;
 use App\Http\Controllers\UserController;

Route::prefix("admin")->group(function () {
      // Rutas de Roles----------------------------

    Route::get('/roles', [RoleController::class, 'index'])
        ->name('roles.index')
        ->middleware('auth','verified','check.permission:read','checkRole:admin');
     

    Route::get('/roles/create', [RoleController::class, 'create'])
        ->name('roles.create')
        ->middleware('auth','verified','check.permission:read','checkRole:admin');
     

    Route::post('/roles', [RoleController::class, 'store'])
        ->name('roles.store')
        ->middleware('auth','verified','check.permission:create','checkRole:admin');
      

    Route::get('/roles/{role}/edit', [RoleController::class, 'edit'])
        ->name('roles.edit')
        ->middleware('auth','verified','check.permission:read','checkRole:admin');
      

    Route::put('/roles/{role}', [RoleController::class, 'update'])
        ->name('roles.update')
        ->middleware('auth','verified','check.permission:update','checkRole:admin');
      

    Route::delete('/roles/{role}', [RoleController::class, 'destroy'])
        ->name('roles.destroy')
        ->middleware('auth','verified','check.permission:delete','checkRole:admin');
      

    Route::get('/roles/assign', [RoleController::class, 'assign'])
        ->name('roles.assign')
        ->middleware('auth','verified','check.permission:read','checkRole:admin');
      

    Route::post('/roles/assign', [RoleController::class, 'assignRole'])
        ->name('roles.assignRole')
        ->middleware('auth','verified','check.permission:create','checkRole:admin');

    Route::post('/roles/revoke', [RoleController::class, 'revokeRole'])
        ->name('roles.revoke')
        ->middleware('auth','verified','check.permission:create','checkRole:admin');
       

    // Rutas de Usuarios
    Route::get('/users', [UserController::class, 'index'])
        ->name('users.index')
        ->middleware('auth','verified','check.permission:read','checkRole:admin');
       

    Route::get('/users/create', [UserController::class, 'create'])
        ->name('users.create')
        ->middleware('auth','verified','check.permission:read','checkRole:admin');     

    Route::post('/users', [UserController::class, 'store'])
        ->name('users.store')
        ->middleware('auth','verified','check.permission:create','checkRole:admin');
      

    Route::get('/users/{user}', [UserController::class, 'show'])
        ->name('users.show')
        ->middleware('auth','verified','check.permission:read','checkRole:admin');
       

    Route::get('/users/{user}/edit', [UserController::class, 'edit'])
        ->name('users.edit')    
        ->middleware('auth','verified','check.permission:read','checkRole:admin');


    Route::put('/users/{user}', [UserController::class, 'update'])
        ->name('users.update')
        ->middleware('auth','verified','check.permission:update','checkRole:admin');
      

    Route::delete('/users/{user}', [UserController::class, 'destroy'])
        ->name('users.destroy')
        ->middleware('auth','verified','check.permission:delete','checkRole:admin'   );

   
        
});


