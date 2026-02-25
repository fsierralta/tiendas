<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FacturaVenta extends Model
{
    protected $fillable = [
        'nrofactura',
        'id_venta_cabezera',
        'id_locale',
        'id_tasabcv',
    ];
    
    protected $casts = [
        'nrofactura' => 'string',
        'id_tasabcv' => 'integer',
    ];

    public function ventaCabezera()
    {
        return $this->belongsTo(VentaCabezera::class, 'id_venta_cabezera');
    }

    public function locale()
    {
        return $this->belongsTo(Locale::class, 'id_locale');
    }

    public function tasaAbcv()
    {
        return $this->belongsTo(Tasabcv::class, 'id_tasabcv');
    }

    public function formaPagoFacturas()
    {
        return $this->hasMany(FormaPagoFactura::class, 'id_factura_venta');
    }
}
