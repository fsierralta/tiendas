<?php

namespace App\Http\Controllers;

use App\Models\EmpleadoUser;
use App\Models\User;
use App\Models\Empleado;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmpleadoUserController extends Controller
{
    public function index(Request $request)
    {
        $empleadoUsers = EmpleadoUser::with(['user', 'empleado']);

        if ($request->has('search')) {
            $search = $request->search;
            $empleadoUsers = $empleadoUsers->where(function ($query) use ($search) {
                $query->whereHas('user', function ($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%')
                      ->orWhere('email', 'like', '%' . $search . '%');
                })
                ->orWhereHas('empleado', function ($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%')
                      ->orWhere('apellidos', 'like', '%' . $search . '%');
                });
            });
        }

        $empleadoUsers = $empleadoUsers->paginate(10)->withQueryString();

        return Inertia::render('empleadoUsers/index', ['empleadoUsers' => $empleadoUsers]);
    }

    public function create()
    {
        $users = User::whereDoesntHave('empleadoUser')->get();
        $empleados = Empleado::whereDoesntHave('empleadoUser')->get();

        return Inertia::render('empleadoUsers/create', [
            'users' => $users,
            'empleados' => $empleados
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_user' => 'required|exists:users,id|unique:empleado_users,id_user',
            'id_empleado' => 'required|exists:empleados,id|unique:empleado_users,id_empleado',
        ]);

        // Check if assignment already exists
        $exists = EmpleadoUser::where('id_user', $validated['id_user'])
                              ->where('id_empleado', $validated['id_empleado'])
                              ->exists();

        if ($exists) {
            return redirect()->back()
                ->with('error', 'Esta asignación ya existe.');
        }

        EmpleadoUser::create($validated);

        return redirect()->route('empleadoUsers.index')
            ->with('success', 'Asignación creada exitosamente.');
    }

    public function edit(EmpleadoUser $empleadoUser)
    {
        $users = User::all();
        $empleados = Empleado::all();

        return Inertia::render('empleadoUsers/edit', [
            'empleadoUser' => $empleadoUser,
            'users' => $users,
            'empleados' => $empleados
        ]);
    }

    public function update(Request $request, EmpleadoUser $empleadoUser)
    {
        $validated = $request->validate([
            'id_user' => 'required|exists:users,id|unique:empleado_users,id_user,' . $empleadoUser->id,
            'id_empleado' => 'required|exists:empleados,id|unique:empleado_users,id_empleado,' . $empleadoUser->id,
        ]);

        // Check if assignment already exists (excluding current record)
        $exists = EmpleadoUser::where('id_user', $validated['id_user'])
                              ->where('id_empleado', $validated['id_empleado'])
                              ->where('id', '!=', $empleadoUser->id)
                              ->exists();

        if ($exists) {
            return redirect()->back()
                ->with('error', 'Esta asignación ya existe.');
        }

        $empleadoUser->update($validated);

        return redirect()->route('empleadoUsers.index')
            ->with('success', 'Asignación actualizada exitosamente.');
    }

    public function destroy(EmpleadoUser $empleadoUser)
    {
        $empleadoUser->delete();

        return redirect()->route('empleadoUsers.index')
            ->with('success', 'Asignación eliminada exitosamente.');
    }
}
