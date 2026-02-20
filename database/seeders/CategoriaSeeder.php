<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Categoria;

class CategoriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categorias = [
            ['name' => 'Electrónicos', 'descripcion' => 'Productos electrónicos y accesorios'],
            ['name' => 'Ropa', 'descripcion' => 'Prendas de vestir y accesorios'],
            ['name' => 'Alimentos', 'descripcion' => 'Productos alimenticios y bebidas'],
            ['name' => 'Herramientas', 'descripcion' => 'Herramientas y equipos de trabajo'],
            ['name' => 'Limpieza', 'descripcion' => 'Productos de limpieza y mantenimiento'],
            ['name' => 'Oficina', 'descripcion' => 'Útiles de oficina y papelería'],
            ['name' => 'Deportes', 'descripcion' => 'Artículos deportivos y equipamiento'],
        ];

        foreach ($categorias as $categoria) {
            Categoria::create($categoria);
        }
    }
}
