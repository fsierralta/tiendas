<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ubicacion extends Model
{
    protected $fillable = [
        'name',
        'id_locales',
    ];

    protected $casts = [
        'name' => 'string',
        'id_locales' => 'integer',
    ];
  protected $table="ubicaciones";

    public function locale()
    {
        return $this->belongsTo(Locale::class, 'id_locales');
    }

    public function productos()
    {
        return $this->hasMany(Producto::class, 'id_ubicacion');
    }
}
