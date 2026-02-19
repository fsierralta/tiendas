<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CargoEmpleado extends Model
{
    protected $fillable = [
        'id_cargo',
        'id_empleado',
    ];

    protected $casts = [
        'id_cargo' => 'integer',
        'id_empleado' => 'integer',
    ];

    public function cargo()
    {
        return $this->belongsTo(Cargo::class, 'id_cargo');
    }

    public function empleado()
    {
        return $this->belongsTo(Empleado::class, 'id_empleado');
    }
}
