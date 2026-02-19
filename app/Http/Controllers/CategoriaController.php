<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoriaController extends Controller
{
    public function index(Request $request)
    {
        $categorias = Categoria::query();

        if ($request->has('search')) {
            $categorias = $categorias->where('name', 'like', '%' . $request->search . '%');
        }

        $categorias = $categorias->paginate(10)->withQueryString();

        return Inertia::render('categorias/index', ['categorias' => $categorias]);
    }

    public function create()
    {
        return Inertia::render('categorias/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'descripcion' => 'nullable|string|max:100',
        ]);

        Categoria::create($validated);

        return redirect()->route('categorias.index')
            ->with('success', 'Categoría creada exitosamente.');
    }

    public function edit(Categoria $categoria)
    {
        return Inertia::render('categorias/edit', ['categoria' => $categoria]);
    }

    public function update(Request $request, Categoria $categoria)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'descripcion' => 'nullable|string|max:100',
        ]);

        $categoria->update($validated);

        return redirect()->route('categorias.index')
            ->with('success', 'Categoría actualizada exitosamente.');
    }

    public function destroy(Categoria $categoria)
    {
        $categoria->delete();

        return redirect()->route('categorias.index')
            ->with('success', 'Categoría eliminada exitosamente.');
    }
}
