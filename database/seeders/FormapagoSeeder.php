<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Formapago;
class FormapagoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        if(Formapago::count() > 0) {
            return;
        }
        Formapago::create([
            'name' => 'Efectivo Bs',
            'descripcion' => 'Efectivo en bolivares',
        ]);
        Formapago::create([
            'name' => 'Efectivo USD',
            'descripcion' => 'Efectivo en dolares',
        ]);
        Formapago::create([
            'name' => 'Transferencia   Bs',
            'descripcion' => 'Transferencia bancaria en bolivares',
        ]);
        Formapago::create([
            'name' => 'Transferencia   USD zelle',
            'descripcion' => 'Transferencia bancaria en dolares',
        ]);
        Formapago::create([
            'name' => 'Pago mobil Bs',
            'descripcion' => 'Pago movil en bolivares',
        ]);
        
        

        


        


    }
}
