<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class tasabcv extends Model
{
    protected $fillable = [
        'fecha',
        'monto',
    ];
    
    protected $casts = [
        'fecha' => 'date',
        'monto' => 'decimal:2',
    ];
}
