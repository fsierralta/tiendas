<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Locale;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class LocaleController extends Controller
{
    public function index(Request $request)
    {
        $locales = Locale::query();

        if ($request->has('search')) {
            $locales = $locales->where('name', 'like', '%' . $request->search . '%')
                                ->orWhere('direccion', 'like', '%' . $request->search . '%')
                                ->orWhere('rif', 'like', '%' . $request->search . '%')
                                ->orWhere('ciudad', 'like', '%' . $request->search . '%');
        }

        $locales = $locales->paginate(10)->withQueryString();

        return Inertia::render('locales/index', ['locales' => $locales]);
    }

    public function create()
    {
        return Inertia::render('locales/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'rif' => 'required|string|max:20|unique:locales',
            'direccion' => 'required|string|max:500',
            'ciudad' => 'required|string|max:255',
            'telefono' => 'nullable|string|max:20',
            'celular' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'estado' => 'required|boolean',
        ]);

        // Handle logo upload and convert to URL
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('locales/logos', 'public');
            $validated['logo'] = asset('storage/' . $logoPath);
        }

        Locale::create($validated);

        return redirect()->route('locales.index')
            ->with('success', 'Local creado exitosamente.');
    }

    public function edit(Locale $locale)
    {
        return Inertia::render('locales/edit', ['locale' => $locale]);
    }

    public function update(Request $request, Locale $locale)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'rif' => 'required|string|max:20|unique:locales,rif,' . $locale->id,
            'direccion' => 'required|string|max:500',
            'ciudad' => 'required|string|max:255',
            'telefono' => 'nullable|string|max:20',
            'celular' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'estado' => 'required|boolean',
        ]);

        // Handle logo upload and convert to URL
        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            if ($locale->logo) {
                $oldLogoPath = str_replace(asset('storage/'), '', $locale->logo);
                if (Storage::disk('public')->exists($oldLogoPath)) {
                    Storage::disk('public')->delete($oldLogoPath);
                }
            }
            
            $logoPath = $request->file('logo')->store('locales/logos', 'public');
            $validated['logo'] = asset('storage/' . $logoPath);
        }

        $locale->update($validated);

        return redirect()->route('locales.index')
            ->with('success', 'Local actualizado exitosamente.');
    }

    public function destroy(Locale $locale)
    {
        $locale->delete();

        return redirect()->route('locales.index')
            ->with('success', 'Local eliminado exitosamente.');
    }
}
