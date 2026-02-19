<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LocaleUser extends Model
{
    protected $fillable = [
        'id_user',
        'id_locale',
    ];
    
    protected $casts = [
        'id_user' => 'integer',
        'id_locale' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }

    public function locale()
    {
        return $this->belongsTo(Locale::class, 'id_locale');
    }
}
