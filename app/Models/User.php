<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    /**
     * Relación muchos a muchos con roles
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'role_users','id_user','id_role')
            ->withTimestamps();
    }

    /**
     * Verificar si el usuario tiene un rol específico
     */
    public function hasRole(string $roleName): bool
    {
        return $this->roles()->where('name', $roleName)->exists();
    }

    /**
     * Verificar si el usuario tiene algún rol de la lista
     */
    public function hasAnyRole(array $roleNames): bool
    {
        return $this->roles()->whereIn('name', $roleNames)->exists();
    }

    /**
     * Verificar si el usuario es administrador
     */
    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    /**
     * Obtener todos los permisos del usuario a través de sus roles
     */
    public function getPermissionsAttribute(): array
    {
        $permissions = [];
        
        foreach ($this->roles as $role) {
            info("queda",["role"=>$role]);
            if ($role->hasPermission('create')) $permissions[] = 'create';
            if ($role->hasPermission('read')) $permissions[] = 'read';
            if ($role->hasPermission('update')) $permissions[] = 'update';
            if ($role->hasPermission('delete')) $permissions[] = 'delete';
        }
        info('permissions',["permisos"=>$permissions]);
        return array_unique($permissions);
    }

    /**
     * Verificar si el usuario puede realizar una acción específica
     */
    public function hasPermission(string $permission): bool
    {
      //  info("permiso que tiene:".$permission,["permiso"=>$this->roles()->where($permission, true)->exists()]);
        return $this->roles()->where($permission, true)->exists();
    }

    /**
     * Obtener el rol principal del usuario
     */
    public function getPrimaryRole(): ?Role
    {
        return $this->roles()->first();
    }

    /**
     * Obtener las asignaciones de empleado del usuario
     */
    public function empleadoUser()
    {
        return $this->hasMany(EmpleadoUser::class, 'id_user');
    }

    /**
     * Obtener las asignaciones de locale del usuario
     */
    public function localeUser()
    {
        return $this->hasMany(LocaleUser::class, 'id_user');
    }
}
