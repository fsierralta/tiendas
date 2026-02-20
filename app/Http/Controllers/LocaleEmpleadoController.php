<?php

namespace App\Http\Controllers;

use App\Models\LocaleEmpleado;
use App\Models\Empleado;
use App\Models\Locale;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LocaleEmpleadoController extends Controller
{
    public function index()
    {
        $localeEmpleados = LocaleEmpleado::with(['empleado', 'locale'])->get();
        return Inertia::render('admin/locale-empleados/Index', [
            'localeEmpleados' => $localeEmpleados,
        ]);
    }

    public function create()
    {
        $empleados = Empleado::all();
        $locales = Locale::all();
        return Inertia::render('admin/locale-empleados/Create', [
            'empleados' => $empleados,
            'locales' => $locales,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'id_empleado' => 'required|exists:empleados,id',
            'id_locale' => 'required|exists:locales,id',
        ]);

        LocaleEmpleado::create($request->all());

        return redirect()->route('localeEmpleados.index')
            ->with('success', 'Asignación de empleado a locale creada exitosamente.');
    }

    public function edit(LocaleEmpleado $localeEmpleado)
    {
        $localeEmpleado->load(['empleado', 'locale']);
        $empleados = Empleado::all();
        $locales = Locale::all();
        return Inertia::render('admin/locale-empleados/Edit', [
            'localeEmpleado' => $localeEmpleado,
            'empleados' => $empleados,
            'locales' => $locales,
        ]);
    }

    public function update(Request $request, LocaleEmpleado $localeEmpleado)
    {
        $request->validate([
            'id_empleado' => 'required|exists:empleados,id',
            'id_locale' => 'required|exists:locales,id',
        ]);

        $localeEmpleado->update($request->all());

        return redirect()->route('localeEmpleados.index')
            ->with('success', 'Asignación de empleado a locale actualizada exitosamente.');
    }

    public function destroy(LocaleEmpleado $localeEmpleado)
    {
        $localeEmpleado->delete();

        return redirect()->route('localeEmpleados.index')
            ->with('success', 'Asignación de empleado a locale eliminada exitosamente.');
    }
}
