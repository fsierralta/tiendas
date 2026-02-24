<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Role extends Model
{
    protected $fillable = [
        'name',
        'descripcion',
        'update',
        'create',
        'read',
        'delete',
    ];
 
    protected $casts = [
        'update' => 'boolean',
        'create' => 'boolean',
        'read' => 'boolean',
        'delete' => 'boolean',
    ];

    /**
     * Relación muchos a muchos con usuarios
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'role_users','id_role','id_user')
            ->withTimestamps();
    }

    /**
     * Verificar si el rol tiene un permiso específico
     */
    public function hasPermission(string $permission): bool
    {
        return (bool) $this->getAttribute($permission);
    }

    /**
     * Verificar si el rol puede actualizar
     */
    public function canUpdate(): bool
    {
        return $this->update;
    }

    /**
     * Verificar si el rol puede crear
     */
    public function canCreate(): bool
    {
        return $this->create;
    }

    /**
     * Verificar si el rol puede leer
     */
    public function canRead(): bool
    {
        return $this->read;
    }

    /**
     * Verificar si el rol puede eliminar
     */
    public function canDelete(): bool
    {
        return $this->delete;
    }
}
