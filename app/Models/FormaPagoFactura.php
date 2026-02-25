<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FormaPagoFactura extends Model
{
    protected $fillable = [
        'id_factura_venta',
        'id_forma_pago',
        'monto',
        'referencia',
    ];
    
    protected $casts = [
        'monto' => 'decimal:2',
        'referencia' => 'string',
    ];

    public function facturaVenta()
    {
        return $this->belongsTo(FacturaVenta::class, 'id_factura_venta');
    }

    public function formaPago()
    {
        return $this->belongsTo(Formapago::class, 'id_forma_pago');
    }
}
