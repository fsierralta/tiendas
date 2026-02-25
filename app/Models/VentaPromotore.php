<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VentaPromotore extends Model
{
    protected $fillable = [
        'id_promotor',
        'monto',
        'fecha_venta',
        'fecha_pago',
        'referencia',
        'pagado',
        'id_factura_venta',
        'id_locale',
    ];
    
    protected $casts = [
        'monto' => 'decimal:2',
        'fecha_venta' => 'date',
        'fecha_pago' => 'date',
        'pagado' => 'string',
    ];
}
