<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VentaCabezera extends Model
{
    protected $fillable = [
        'fecha',
        'id_cliente',
        'id_promotor',
        'id_tecnico',
        'monto_promotor',
        'user_id',
        'monto_total',
        'locale_id',
    ];

    protected $casts = [
        'fecha' => 'date',
        'monto_promotor' => 'decimal:2',
        'monto_total' => 'decimal:2',
    ];

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class, 'id_cliente');
    }

    public function promotor(): BelongsTo
    {
        return $this->belongsTo(Promotore::class, 'id_promotor');
    }

    public function tecnico(): BelongsTo
    {
        return $this->belongsTo(Tecnico::class, 'id_tecnico');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function locale(): BelongsTo
    {
        return $this->belongsTo(Locale::class, 'locale_id');
    }

    public function ventas(): HasMany
    {
        return $this->hasMany(Venta::class, 'venta_cabezera_id');
    }

    public function ventaFooter(): HasMany
    {
        return $this->hasMany(VentaFooter::class, 'venta_cabezera_id');
    }

    public function formaPagos(): HasMany
    {
        return $this->hasMany(FormaPagoVenta::class, 'venta_cabezera_id');
    }

    public function facturaVenta(): HasMany
    {
        return $this->hasMany(FacturaVenta::class, 'id_venta_cabezera');
    }
}
