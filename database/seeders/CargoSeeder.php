<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Cargo;
class CargoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        if (Cargo::count() > 0) {
            return;
        }
        
        Cargo::create([
            'name' => 'Administrador',
            'descripcion' => 'Administrador de la tienda',
        ]);

        Cargo::create([
            'name' => 'Vendedor',
            'descripcion' => 'Vendedor de la tienda',
        ]);

        Cargo::create([
            'name' => 'Encargado',
            'descripcion' => 'Encargado de la tienda',
        ]);

        Cargo::create([
            'name' => 'Tecnico',
            'descripcion' => 'Tecnico de la tienda',
        ]);

        Cargo::create([
            'name' => 'Promotor',
            'descripcion' => 'Promotor de la tienda',
        ]);

        Cargo::create([
            'name' => 'Jefe de administración',
            'descripcion' => 'Jefe de administración de la tienda',
        ]);

        
    }
}
