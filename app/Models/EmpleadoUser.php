<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmpleadoUser extends Model
{
    protected $fillable = [
        'id_user',
        'id_empleado',
    ];
    
    protected $casts = [
        'id_user' => 'integer',
        'id_empleado' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }

    public function empleado()
    {
        return $this->belongsTo(Empleado::class, 'id_empleado');
    }
}
