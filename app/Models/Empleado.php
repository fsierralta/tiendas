<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Empleado extends Model
{
    protected $fillable = [
        'name',
        'apellidos',
        'celular',
        'sexo',
    ];
    
    protected $casts = [
        'sexo' => 'string',
    ];

    public function cargos()
    {
        return $this->hasMany(CargoEmpleado::class, 'id_empleado');
    }
}
