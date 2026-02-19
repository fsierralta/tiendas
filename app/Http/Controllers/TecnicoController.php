<?php

namespace App\Http\Controllers;

use App\Models\Tecnico;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TecnicoController extends Controller
{
    public function index(Request $request)
    {
        $tecnicos = Tecnico::query();

        if ($request->has('search')) {
            $tecnicos = $tecnicos->where('name', 'like', '%' . $request->search . '%')
                                   ->orWhere('apellidos', 'like', '%' . $request->search . '%')
                                   ->orWhere('email', 'like', '%' . $request->search . '%')
                                   ->orWhere('celular', 'like', '%' . $request->search . '%');
        }

        $tecnicos = $tecnicos->paginate(10)->withQueryString();

        return Inertia::render('tecnicos/index', ['tecnicos' => $tecnicos]);
    }

    public function create()
    {
        return Inertia::render('tecnicos/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'apellidos' => 'nullable|string|max:100',
            'email' => 'required|email|max:100|unique:tecnicos',
            'celular' => 'required|string|max:100',
        ]);

        Tecnico::create($validated);

        return redirect()->route('tecnicos.index')
            ->with('success', 'Técnico creado exitosamente.');
    }

    public function edit(Tecnico $tecnico)
    {
        return Inertia::render('tecnicos/edit', ['tecnico' => $tecnico]);
    }

    public function update(Request $request, Tecnico $tecnico)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'apellidos' => 'nullable|string|max:100',
            'email' => 'required|email|max:100|unique:tecnicos,email,' . $tecnico->id,
            'celular' => 'required|string|max:100',
        ]);

        $tecnico->update($validated);

        return redirect()->route('tecnicos.index')
            ->with('success', 'Técnico actualizado exitosamente.');
    }

    public function destroy(Tecnico $tecnico)
    {
        $tecnico->delete();

        return redirect()->route('tecnicos.index')
            ->with('success', 'Técnico eliminado exitosamente.');
    }
}
