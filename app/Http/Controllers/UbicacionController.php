<?php

namespace App\Http\Controllers;

use App\Models\Ubicacion;
use App\Models\Locale;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UbicacionController extends Controller
{
    public function index()
    {
        $ubicaciones = Ubicacion::with('locale')->get();
        return Inertia::render('admin/ubicaciones/Index', [
            'ubicaciones' => $ubicaciones,
        ]);
    }

    public function create()
    {
        $locales = Locale::all();
        return Inertia::render('admin/ubicaciones/Create', [
            'locales' => $locales,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'id_locales' => 'required|exists:locales,id',
        ]);

        Ubicacion::create($request->all());

        return redirect()->route('ubicaciones.index')
            ->with('success', 'Ubicación creada exitosamente.');
    }

    public function edit(Ubicacion $ubicacion)
    {
        $ubicacion->load('locale');
        $locales = Locale::all();
        return Inertia::render('admin/ubicaciones/Edit', [
            'ubicacion' => $ubicacion,
            'locales' => $locales,
        ]);
    }

    public function update(Request $request, Ubicacion $ubicacion)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'id_locales' => 'required|exists:locales,id',
        ]);

        $ubicacion->update($request->all());

        return redirect()->route('ubicaciones.index')
            ->with('success', 'Ubicación actualizada exitosamente.');
    }

    public function destroy(Ubicacion $ubicacion)
    {
        $ubicacion->delete();

        return redirect()->route('ubicaciones.index')
            ->with('success', 'Ubicación eliminada exitosamente.');
    }
}
