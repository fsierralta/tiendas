<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pago extends Model
{
    protected $fillable = [
        'monto',
        'fecha',
        'referencia',
        'observacion',
        'formapago_id',
        'user_id',
        'venta_promotore_id',
        'venta_tecnico_id',
    ];

    public function casts(): array
    {
        return [
            'monto' => 'decimal:2',
            'fecha' => 'date',
        ];
    }

    public function formapago()
    {
        return $this->belongsTo(Formapago::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function ventaPromotor()
    {
        return $this->belongsTo(VentaPromotore::class, 'venta_promotore_id');
    }

    public function ventaTecnico()
    {
        return $this->belongsTo(VentaTecnico::class, 'venta_tecnico_id');
    }
}
