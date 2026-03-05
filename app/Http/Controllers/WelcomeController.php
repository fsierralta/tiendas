<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Models\Locale;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WelcomeController extends Controller
{
    public function index(): Response
    {
        // Obtener productos destacados (ej: productos con stock > 0)
        $productosDestacados = Producto::with(['locale', 'categoria', 'ubicacion'])
            ->where('cantidad', '>', 0)
            ->orderBy('cantidad', 'desc')
            ->take(12)
            ->get()
            ->map(function ($producto) {
                return [
                    'id' => $producto->id,
                    'name' => $producto->name,
                    'marca' => $producto->marca,
                    'model' => $producto->model,
                    'precio' => $producto->precio,
                    'precio2' => $producto->precio2,
                    'cantidad' => $producto->cantidad,
                    'locale' => $producto->locale ? $producto->locale->name : 'N/A',
                    'categoria' => $producto->categoria ? $producto->categoria->name : 'N/A',
                    'ubicacion' => $producto->ubicacion ? $producto->ubicacion->name : 'N/A',
                ];
            });

        // Obtener todos los locales para el buscador
        $locales = Locale::select('id', 'name', 'ciudad', 'estado')
            ->orderBy('name')
            ->get();

        return Inertia::render('Welcome', [
            'productosDestacados' => $productosDestacados,
            'locales' => $locales,
        ]);
    }

    public function buscarProductos(Request $request)
    {
        $query = $request->input('query');
        $localeId = $request->input('locale_id');

        $productos = Producto::with(['locale', 'categoria', 'ubicacion'])
            ->where('name', 'LIKE', "%{$query}%")
            ->orWhere('marca', 'LIKE', "%{$query}%")
            ->orWhere('model', 'LIKE', "%{$query}%")
            ->when($localeId, function ($query, $localeId) {
                return $query->where('id_locale', $localeId);
            })
            ->where('cantidad', '>', 0)
            ->orderBy('name')
            ->get()
            ->map(function ($producto) {
                return [
                    'id' => $producto->id,
                    'name' => $producto->name,
                    'marca' => $producto->marca,
                    'model' => $producto->model,
                    'precio' => $producto->precio,
                    'precio2' => $producto->precio2,
                    'cantidad' => $producto->cantidad,
                    'locale' => $producto->locale ? $producto->locale->name : 'N/A',
                    'locale_ciudad' => $producto->locale ? $producto->locale->ciudad : 'N/A',
                    'locale_estado' => $producto->locale ? $producto->locale->estado : 'N/A',
                    'categoria' => $producto->categoria ? $producto->categoria->name : 'N/A',
                    'ubicacion' => $producto->ubicacion ? $producto->ubicacion->name : 'N/A',
                ];
            });

        return response()->json([
            'productos' => $productos,
        ]);
    }
}
