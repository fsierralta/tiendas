<?php

namespace App\Http\Controllers;

use App\Models\Formapago;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FormapagoController extends Controller
{
    public function index(Request $request)
    {
        $formapagos = Formapago::query();

        if ($request->has('search')) {
            $formapagos = $formapagos->where('name', 'like', '%' . $request->search . '%')
                                     ->orWhere('descripcion', 'like', '%' . $request->search . '%');
        }

        $formapagos = $formapagos->paginate(10)->withQueryString();

        return Inertia::render('formapagos/index', ['formapagos' => $formapagos]);
    }

    public function create()
    {
        return Inertia::render('formapagos/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'descripcion' => 'nullable|string|max:100',
        ]);

        Formapago::create($validated);

        return redirect()->route('formapagos.index')
            ->with('success', 'Forma de pago creada exitosamente.');
    }

    public function edit(Formapago $formapago)
    {
        return Inertia::render('formapagos/edit', ['formapago' => $formapago]);
    }

    public function update(Request $request, Formapago $formapago)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'descripcion' => 'nullable|string|max:100',
        ]);

        $formapago->update($validated);

        return redirect()->route('formapagos.index')
            ->with('success', 'Forma de pago actualizada exitosamente.');
    }

    public function destroy(Formapago $formapago)
    {
        $formapago->delete();

        return redirect()->route('formapagos.index')
            ->with('success', 'Forma de pago eliminada exitosamente.');
    }
}
