<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
{
    /**
     * Mostrar lista de roles
     */
    public function index(Request $request)
    {
        $roles = Role::query();
        
        if ($request->has('search')) {
            $roles = $roles->where('name', 'like', '%' . $request->search . '%');
        }

        $roles = $roles->paginate(10)->withQueryString();

        return Inertia::render('roles/index', ['roles' => $roles]);
    }

    /**
     * Mostrar formulario para crear nuevo rol
     */
    public function create()
    {
        return Inertia::render('roles/create');
    }

    /**
     * Guardar nuevo rol
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:45|unique:roles,name',
            'descripcion' => 'nullable|string|max:200',
            'update' => 'required|boolean',
            'create' => 'required|boolean',
            'read' => 'required|boolean',
            'delete' => 'required|boolean',
        ]);

        $role = Role::create([
            'name' => $request->name,
            'descripcion' => $request->descripcion,
            'update' => $request->boolean('update') ? 'Y' : 'N',
            'create' => $request->boolean('create') ? 'Y' : 'N',
            'read' => $request->boolean('read') ? 'Y' : 'N',
            'delete' => $request->boolean('delete') ? 'Y' : 'N',
        ]);

        return redirect()->route('roles.index')->with('success', 'Rol creado correctamente');
    }

    /**
     * Mostrar formulario para editar rol
     */
    public function edit(Role $role)
    {
        return Inertia::render('roles/edit', ['role' => $role]);
    }

    /**
     * Actualizar rol
     */
    public function update(Request $request, Role $role)
    {
        $request->validate([
            'name' => 'required|string|max:45|unique:roles,name,' . $role->id,
            'descripcion' => 'nullable|string|max:200',
            'update' => 'required|boolean',
            'create' => 'required|boolean',
            'read' => 'required|boolean',
            'delete' => 'required|boolean',
        ]);

        $role->update([
            'name' => $request->name,
            'descripcion' => $request->descripcion,
            'update' => $request->boolean('update') ? 'Y' : 'N',
            'create' => $request->boolean('create') ? 'Y' : 'N',
            'read' => $request->boolean('read') ? 'Y' : 'N',
            'delete' => $request->boolean('delete') ? 'Y' : 'N',
        ]);

        return redirect()->route('roles.index')->with('success', 'Rol actualizado correctamente');
    }

    /**
     * Eliminar rol
     */
    public function destroy(Role $role)
    {
        // Verificar si el rol tiene usuarios asignados
        if ($role->users()->count() > 0) {
            return redirect()->route('roles.index')
                ->with('error', 'No se puede eliminar el rol porque tiene usuarios asignados');
        }

        $role->delete();

        return redirect()->route('roles.index')->with('success', 'Rol eliminado correctamente');
    }

    /**
     * Asignar rol a usuario
     */
    public function assignRole(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'role_id' => 'required|exists:roles,id',
        ]);

        $user = User::findOrFail($request->user_id);
        $role = Role::findOrFail($request->role_id);

        // Verificar si ya tiene el rol asignado
        if ($user->roles()->where('role_id', $role->id)->exists()) {
            return redirect()->route('roles.index')
                ->with('error', 'El usuario ya tiene este rol asignado');
        }

        $user->roles()->attach($role->id);

        return redirect()->route('roles.index')
            ->with('success', 'Rol asignado correctamente al usuario');
    }

    /**
     * Mostrar página para asignar roles a usuarios
     */
    public function assign()
    {
        $users = User::with('roles')->get();
        $roles = Role::all();
        
        return Inertia::render('roles/assign', [
            'users' => $users,
            'roles' => $roles,
        ]);
    }

    /**
     * Revocar rol de usuario
     */
    public function revokeRole(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'role_id' => 'required|exists:roles,id',
        ]);

        $user = User::findOrFail($request->user_id);
        $role = Role::findOrFail($request->role_id);

        // Verificar si tiene el rol asignado
        if (!$user->roles()->where('role_id', $role->id)->exists()) {
            return redirect()->route('roles.index')
                ->with('error', 'El usuario no tiene este rol asignado');
        }

        $user->roles()->detach($role->id);

        return redirect()->route('roles.index')
            ->with('success', 'Rol revocado correctamente del usuario');
    }
}
