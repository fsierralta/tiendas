<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Categoria extends Model
{
    protected $fillable = [
        'name',
        'descripcion',
    ];
    
    protected $casts = [
        'name' => 'string',
        'descripcion' => 'string',
    ];
}
