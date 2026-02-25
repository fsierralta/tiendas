<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Locale extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'rif',
        'direccion',
        'estado',
        'ciudad',
        'email',
        'celular',
        'telefono',
        'logo',
      
    ];
    
    

    public function localeUser()
    {
        return $this->hasMany(LocaleUser::class, 'id_locale');
    }
}
