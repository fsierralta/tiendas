<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tasabcv extends Model
{
    protected $fillable = [
        'fecha',
        'monto',
    ];
    
    protected $casts = [
        'fecha' => 'date',
        'monto' => 'decimal:2',
    ];

    public function facturaVentas()
    {
        return $this->hasMany(FacturaVenta::class, 'id_tasabcv');
    }
}
