<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'id_locale',
        'id_categoria',
        'precio',
        'cantidad',
        'precio2',
        'marca',
        'model',
        'reposicion',
        'id_ubicacion',
    ];

    protected $casts = [
        'precio' => 'decimal:2',
        'precio2' => 'decimal:2',
        'cantidad' => 'integer',
        'reposicion' => 'integer',
    ];

    public function locale()
    {
        return $this->belongsTo(Locale::class, 'id_locale');
    }

    public function categoria()
    {
        return $this->belongsTo(Categoria::class, 'id_categoria');
    }

    public function ubicacion()
    {
        return $this->belongsTo(Ubicacion::class, 'id_ubicacion');
    }
}
