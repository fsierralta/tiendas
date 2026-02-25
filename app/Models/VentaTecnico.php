<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VentaTecnico extends Model
{
    protected $fillable = [
        'id_locale',
        'id_tecnico',
        'monto',
        'id_factura_venta',
        'fecha_venta',
        'fecha_pago',
        'referencia',
        'pagado',
    ];
    
    protected $casts = [
        'monto' => 'decimal:2',
        'fecha_venta' => 'date',
        'fecha_pago' => 'date',
        'pagado' => 'string',
    ];

}
