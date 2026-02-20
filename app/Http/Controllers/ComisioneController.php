<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comisione;
use App\Models\Locale;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ComisioneController extends Controller
{
    public function index(Request $request)
    {
        $query = Comisione::with('locale');

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('comisiones.name', 'like', "%{$search}%")
                  ->orWhereHas('locale', function ($subQuery) use ($search) {
                      $subQuery->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $comisiones = $query->paginate(10);

        return Inertia::render('comisiones/index', [
            'comisiones' => $comisiones,
        ]);
    }

    public function create()
    {
        $locales = Locale::select('id', 'name')->get();

        return Inertia::render('comisiones/create', [
            'locales' => $locales,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'porcentaje' => 'required|numeric|min:0|max:100',
            'id_locale' => 'required|exists:locales,id',
        ]);

        Comisione::create($validated);

        return redirect()->route('comisiones.index')
            ->with('success', 'Comisión creada exitosamente.');
    }

    public function edit(Comisione $comisione)
    {
        $comisione->load('locale');
        $locales = Locale::select('id', 'name')->get();

        return Inertia::render('comisiones/edit', [
            'comision' => $comisione,
            'locales' => $locales,
        ]);
    }

    public function update(Request $request, Comisione $comisione)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'porcentaje' => 'required|numeric|min:0|max:100',
            'id_locale' => 'required|exists:locales,id',
        ]);

        $comisione->update($validated);

        return redirect()->route('comisiones.index')
            ->with('success', 'Comisión actualizada exitosamente.');
    }

    public function destroy(Comisione $comisione)
    {
        $comisione->delete();

        return redirect()->route('comisiones.index')
            ->with('success', 'Comisión eliminada exitosamente.');
    }
}
