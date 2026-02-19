<?php

namespace App\Http\Controllers;

use App\Models\Promotore;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PromotoreController extends Controller
{
    public function index(Request $request)
    {
        $promotores = Promotore::query();

        if ($request->has('search')) {
            $promotores = $promotores->where('name', 'like', '%' . $request->search . '%')
                                    ->orWhere('apellidos', 'like', '%' . $request->search . '%')
                                    ->orWhere('email', 'like', '%' . $request->search . '%')
                                    ->orWhere('celular', 'like', '%' . $request->search . '%');
        }

        $promotores = $promotores->paginate(10)->withQueryString();

        return Inertia::render('promotores/index', ['promotores' => $promotores]);
    }

    public function create()
    {
        return Inertia::render('promotores/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'apellidos' => 'required|string|max:100',
            'email' => 'required|email|max:100|unique:promotores',
            'celular' => 'required|string|max:100',
        ]);

        Promotore::create($validated);

        return redirect()->route('promotores.index')
            ->with('success', 'Promotor creado exitosamente.');
    }

    public function edit(Promotore $promotore)
    {
        return Inertia::render('promotores/edit', ['promotore' => $promotore]);
    }

    public function update(Request $request, Promotore $promotore)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'apellidos' => 'required|string|max:100',
            'email' => 'required|email|max:100|unique:promotores,email,' . $promotore->id,
            'celular' => 'required|string|max:100',
        ]);

        $promotore->update($validated);

        return redirect()->route('promotores.index')
            ->with('success', 'Promotor actualizado exitosamente.');
    }

    public function destroy(Promotore $promotore)
    {
        $promotore->delete();

        return redirect()->route('promotores.index')
            ->with('success', 'Promotor eliminado exitosamente.');
    }
}
