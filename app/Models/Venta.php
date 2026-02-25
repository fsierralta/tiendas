<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Venta extends Model
{
    protected $fillable = [
        'venta_cabezera_id',
        'id_producto',
        'cantidad',
        'precio_unitario',
        'subtotal',
        'monto_promotor',
        'precio_venta',
        'descripcion',
    ];

    protected $casts = [
        'cantidad' => 'integer',
        'precio_unitario' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'monto_promotor' => 'decimal:2',
        'precio_venta' => 'decimal:2',
    ];

    public function ventaCabezera(): BelongsTo
    {
        return $this->belongsTo(VentaCabezera::class, 'venta_cabezera_id');
    }

    public function producto(): BelongsTo
    {
        return $this->belongsTo(Producto::class, 'id_producto');
    }

    /**
     * Calcular el subtotal basado en cantidad y precio unitario
     */
    public function calcularSubtotal(): float
    {
        return $this->cantidad * $this->precio_unitario;
    }

    /**
     * Actualizar el subtotal automáticamente
     */
    public function save(array $options = [])
    {
        $this->subtotal = $this->calcularSubtotal();
        return parent::save($options);
    }
}
