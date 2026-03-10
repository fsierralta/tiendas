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

    public function pagos()
    {
        return $this->hasMany(Pago::class, 'venta_promotore_id');
    }

    public function promotor()
    {
        return $this->belongsTo(Promotore::class, 'id_promotor');
    }

    public function facturaVenta()
    {
        return $this->belongsTo(FacturaVenta::class, 'id_factura_venta');
    }

    public function locale()
    {
        return $this->belongsTo(Locale::class, 'id_locale');
    }
}
