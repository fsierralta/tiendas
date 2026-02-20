<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Models\Locale;
use App\Models\Categoria;
use App\Models\Ubicacion;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductoController extends Controller
{
    public function index(Request $request)
    {
        $query = Producto::with(['locale', 'categoria', 'ubicacion']);
        
        // Apply search filters
        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $searchField = $request->input('field', 'name');
            
            if ($searchField === 'name') {
                $query->where('name', 'like', "%{$searchTerm}%");
            } elseif ($searchField === 'id_locale') {
                $query->whereHas('locale', function ($q) use ($searchTerm) {
                    $q->where('name', 'like', "%{$searchTerm}%");
                });
            }
        }
        
        $productos = $query->paginate(10);
        
        return Inertia::render('admin/productos/Index', [
            'productos' => $productos,
        ]);
    }

    public function create()
    {
        $locales = Locale::all();
        $categorias = Categoria::all();
        $ubicaciones = Ubicacion::with('locale')->get();
        return Inertia::render('admin/productos/Create', [
            'locales' => $locales,
            'categorias' => $categorias,
            'ubicaciones' => $ubicaciones,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'id_locale' => 'required|exists:locales,id',
            'id_categoria' => 'required|exists:categorias,id',
            'precio' => 'required|numeric|min:0',
            'cantidad' => 'nullable|integer|min:0',
            'precio2' => 'nullable|numeric|min:0',
            'marca' => 'nullable|string|max:100',
            'model' => 'nullable|string|max:100',
            'reposicion' => 'nullable|integer|min:0',
            'id_ubicacion' => 'nullable|exists:ubicaciones,id',
        ]);
      
        Producto::create($request->all());

        return redirect()->route('productos.index')
            ->with('success', 'Producto creado exitosamente.');
    }

    public function edit(Producto $producto)
    {
        $producto->load(['locale', 'categoria', 'ubicacion']);
        $locales = Locale::all();
        $categorias = Categoria::all();
        $ubicaciones = Ubicacion::with('locale')->get();
        return Inertia::render('admin/productos/Edit', [
            'producto' => $producto,
            'locales' => $locales,
            'categorias' => $categorias,
            'ubicaciones' => $ubicaciones,
        ]);
    }

    public function update(Request $request, Producto $producto)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'id_locale' => 'required|exists:locales,id',
            'id_categoria' => 'required|exists:categorias,id',
            'precio' => 'required|numeric|min:0',
            'cantidad' => 'nullable|integer|min:0',
            'precio2' => 'nullable|numeric|min:0',
            'marca' => 'nullable|string|max:100',
            'model' => 'nullable|string|max:100',
            'reposicion' => 'nullable|integer|min:0',
            'id_ubicacion' => 'nullable|exists:ubicaciones,id',
        ]);

        $producto->update($request->all());

        return redirect()->route('productos.index')
            ->with('success', 'Producto actualizado exitosamente.');
    }

    public function destroy(Producto $producto)
    {
        $producto->delete();

        return redirect()->route('productos.index')
            ->with('success', 'Producto eliminado exitosamente.');
    }
}
