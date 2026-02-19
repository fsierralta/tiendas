<?php

namespace App\Http\Controllers;

use App\Models\CargoEmpleado;
use App\Models\Cargo;
use App\Models\Empleado;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CargoEmpeladoController extends Controller
{
    public function index(Request $request)
    {
        $cargoEmpleados = CargoEmpleado::with(['cargo', 'empleado']);

        if ($request->has('search')) {
            $search = $request->search;
            $cargoEmpleados = $cargoEmpleados->where(function ($query) use ($search) {
                $query->whereHas('cargo', function ($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%');
                })
                ->orWhereHas('empleado', function ($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%')
                      ->orWhere('apellidos', 'like', '%' . $search . '%');
                });
            });
        }

        $cargoEmpleados = $cargoEmpleados->paginate(10)->withQueryString();

        return Inertia::render('cargoEmpleados/index', ['cargoEmpleados' => $cargoEmpleados]);
    }

    public function create()
    {
        $cargos = Cargo::all();
        $empleados = Empleado::all();

        return Inertia::render('cargoEmpleados/create', [
            'cargos' => $cargos,
            'empleados' => $empleados
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_cargo' => 'required|exists:cargos,id',
            'id_empleado' => 'required|exists:empleados,id',
        ]);

        // Check if assignment already exists
        $exists = CargoEmpleado::where('id_cargo', $validated['id_cargo'])
                                      ->where('id_empleado', $validated['id_empleado'])
                                      ->exists();

        if ($exists) {
            return redirect()->back()
                ->with('error', 'Este empleado ya tiene asignado este cargo.');
        }

        CargoEmpleado::create($validated);

        return redirect()->route('cargoEmpleados.index')
            ->with('success', 'Cargo asignado exitosamente.');
    }

    public function edit(CargoEmpleado $cargoEmpleado)
    {
        $cargos = Cargo::all();
        $empleados = Empleado::all();

        return Inertia::render('cargoEmpleados/edit', [
            'cargoEmpleado' => $cargoEmpleado,
            'cargos' => $cargos,
            'empleados' => $empleados
        ]);
    }

    public function update(Request $request, CargoEmpleado $cargoEmpleado)
    {
        $validated = $request->validate([
            'id_cargo' => 'required|exists:cargos,id',
            'id_empleado' => 'required|exists:empleados,id',
        ]);

        // Check if assignment already exists (excluding current record)
        $exists = CargoEmpleado::where('id_cargo', $validated['id_cargo'])
                                      ->where('id_empleado', $validated['id_empleado'])
                                      ->where('id', '!=', $cargoEmpleado->id)
                                      ->exists();

        if ($exists) {
            return redirect()->back()
                ->with('error', 'Este empleado ya tiene asignado este cargo.');
        }

        $cargoEmpleado->update($validated);

        return redirect()->route('cargoEmpleados.index')
            ->with('success', 'Asignación actualizada exitosamente.');
    }

    public function destroy(CargoEmpleado $cargoEmpleado)
    {
        $cargoEmpleado->delete();

        return redirect()->route('cargoEmpleados.index')
            ->with('success', 'Asignación eliminada exitosamente.');
    }
}
