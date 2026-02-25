<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Promotore extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'apellidos',
        'email',
        'celular',
    ];
    
    protected $casts = [
        'name' => 'string',
        'apellidos' => 'string',
        'email' => 'string',
        'celular' => 'string',
    ];
}
