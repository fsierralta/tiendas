<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FormaPagoVenta extends Model
{
    protected $fillable = [
        'venta_cabezera_id',
        'forma_pago_id',
        'monto',
        'referencia',
        'notas',
    ];

    protected $casts = [
        'monto' => 'decimal:2',
    ];

    public function ventaCabezera(): BelongsTo
    {
        return $this->belongsTo(VentaCabezera::class, 'venta_cabezera_id');
    }

    public function formaPago(): BelongsTo
    {
        return $this->belongsTo(Formapago::class, 'forma_pago_id');
    }
}
