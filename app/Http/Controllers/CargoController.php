<?php

namespace App\Http\Controllers;

use App\Models\Cargo;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CargoController extends Controller
{
    public function index(Request $request)
    {
        $cargos = Cargo::query();

        if ($request->has('search')) {
            $cargos = $cargos->where('name', 'like', '%' . $request->search . '%');
        }

        $cargos = $cargos->paginate(10)->withQueryString();

        return Inertia::render('cargos/index', ['cargos' => $cargos]);
    }

    public function create()
    {
        return Inertia::render('cargos/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'descripcion' => 'nullable|string|max:500',
        ]);

        Cargo::create($validated);

        return redirect()->route('cargos.index')
            ->with('success', 'Cargo creado exitosamente.');
    }

    public function edit(Cargo $cargo)
    {
        return Inertia::render('cargos/edit', ['cargo' => $cargo]);
    }

    public function update(Request $request, Cargo $cargo)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'descripcion' => 'nullable|string|max:500',
        ]);

        $cargo->update($validated);

        return redirect()->route('cargos.index')
            ->with('success', 'Cargo actualizado exitosamente.');
    }

    public function destroy(Cargo $cargo)
    {
        $cargo->delete();

        return redirect()->route('cargos.index')
            ->with('success', 'Cargo eliminado exitosamente.');
    }
   
}
