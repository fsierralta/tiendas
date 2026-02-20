<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Comisione extends Model
{
    protected $table = "comisiones";
    
    protected $fillable = [
        'name',
        'porcentaje',
        'id_locale',
    ];

    protected $casts = [
        'porcentaje' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function locale(): BelongsTo
    {
        return $this->belongsTo(Locale::class, 'id_locale');
    }
}
