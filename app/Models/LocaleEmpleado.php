<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LocaleEmpleado extends Model
{
    protected $fillable = [
        'id_empleado',
        'id_locale',
    ];

    public function empleado()
    {
        return $this->belongsTo(Empleado::class, 'id_empleado');
    }

    public function locale()
    {
        return $this->belongsTo(Locale::class, 'id_locale');
    }
}
