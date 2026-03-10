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

    public function pagos()
    {
        return $this->hasMany(Pago::class, 'venta_tecnico_id');
    }

    public function tecnico()
    {
        return $this->belongsTo(Tecnico::class, 'id_tecnico');
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
