<?php

namespace App\Http\Controllers;

use App\Models\tasabcv;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TasabcvController extends Controller
{
    public function index(Request $request)
    {
        $tasabcvs = tasabcv::query();

        if ($request->has('search')) {
            $tasabcvs = $tasabcvs->where('fecha', 'like', '%' . $request->search . '%')
                                    ->orWhere('monto', 'like', '%' . $request->search . '%');
        }

        $tasabcvs = $tasabcvs->orderBy('fecha', 'desc')->paginate(10)->withQueryString();

        return Inertia::render('tasabcvs/index', ['tasabcvs' => $tasabcvs]);
    }

    public function create()
    {
        return Inertia::render('tasabcvs/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'fecha' => 'required|date',
            'monto' => 'required|numeric|min:0|max:99999999.99',
        ]);

        tasabcv::create($validated);

        return redirect()->route('tasabcvs.index')
            ->with('success', 'Tasa BCV creada exitosamente.');
    }

    public function edit(tasabcv $tasabcv)
    {
        return Inertia::render('tasabcvs/edit', ['tasabcv' => $tasabcv]);
    }

    public function update(Request $request, tasabcv $tasabcv)
    {
        $validated = $request->validate([
            'fecha' => 'required|date',
            'monto' => 'required|numeric|min:0|max:99999999.99',
        ]);

        $tasabcv->update($validated);

        return redirect()->route('tasabcvs.index')
            ->with('success', 'Tasa BCV actualizada exitosamente.');
    }

    public function destroy(tasabcv $tasabcv)
    {
        $tasabcv->delete();

        return redirect()->route('tasabcvs.index')
            ->with('success', 'Tasa BCV eliminada exitosamente.');
    }
}
