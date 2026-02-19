<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Empleado;
use Inertia\Inertia;

class EmpleadoController extends Controller
{
    public function index(Request $request)
    {
        $empleados = Empleado::query();

        if ($request->has('search')) {
            $empleados = $empleados->where('name', 'like', '%' . $request->search . '%')
                                ->orWhere('apellidos', 'like', '%' . $request->search . '%')
                                ->orWhere('celular', 'like', '%' . $request->search . '%');
        }

        $empleados = $empleados->paginate(10)->withQueryString();

        return Inertia::render('empleados/index', ['empleados' => $empleados]);
    }

    public function create()
    {
        return Inertia::render('empleados/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'apellidos' => 'required|string|max:100',
            'celular' => 'required|string|max:100',
            'sexo' => 'required|in:M,F',
        ]);

        Empleado::create($validated);

        return redirect()->route('empleados.index')
            ->with('success', 'Empleado creado exitosamente.');
    }

    public function edit(Empleado $empleado)
    {
        return Inertia::render('empleados/edit', ['empleado' => $empleado]);
    }

    public function update(Request $request, Empleado $empleado)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'apellidos' => 'required|string|max:100',
            'celular' => 'required|string|max:100',
            'sexo' => 'required|in:M,F',
        ]);

        $empleado->update($validated);

        return redirect()->route('empleados.index')
            ->with('success', 'Empleado actualizado exitosamente.');
    }

    public function destroy(Empleado $empleado)
    {
        $empleado->delete();

        return redirect()->route('empleados.index')
            ->with('success', 'Empleado eliminado exitosamente.');
    }
}
