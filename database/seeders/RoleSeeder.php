<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Limpiar tabla de roles antes de insertar
        DB::table('roles')->delete();

        // Crear roles predeterminados según la especificación
        $roles = [
            [
                'name' => 'admin',
                'descripcion' => 'Administrador del sistema',
                'update' => 'Y',
                'create' => 'Y',
                'read' => 'Y',
                'delete' => 'Y',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Vendedor',
                'descripcion' => 'Vendedor',
                'update' => 'N',
                'create' => 'N',
                'read' => 'Y',
                'delete' => 'N',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Jefe',
                'descripcion' => 'Jefe de tienda',
                'update' => 'Y',
                'create' => 'Y',
                'read' => 'Y',
                'delete' => 'N',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Promotor',
                'descripcion' => 'Promotor de tienda',
                'update' => 'N',
                'create' => 'N',
                'read' => 'Y',
                'delete' => 'N',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        // Insertar roles en la base de datos
        DB::table('roles')->insert($roles);

        $this->command->info('Roles predeterminados creados correctamente:');
        $this->command->info('- admin: Administrador del sistema (todos los permisos)');
        $this->command->info('- Vendedor: Vendedor (solo lectura)');
        $this->command->info('- Jefe: Jefe de tienda (crear, leer, actualizar)');
        $this->command->info('- Promotor: Promotor de tienda (solo lectura)');
    }
}
