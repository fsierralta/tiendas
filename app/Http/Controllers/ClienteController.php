<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClienteController extends Controller
{
    public function index(Request $request)
    {
        $clientes = Cliente::query();

        if ($request->has('search')) {
            $clientes = $clientes->where('name', 'like', '%' . $request->search . '%')
                ->orWhere('apellido', 'like', '%' . $request->search . '%')
                ->orWhere('cedula_rif', 'like', '%' . $request->search . '%');
        }

        $clientes = $clientes->paginate(10)->withQueryString();

        return Inertia::render('clientes/index', ['clientes' => $clientes]);
    }

    public function create()
    {
        return Inertia::render('clientes/create');
    }

    /**
     * Buscar clientes en tiempo real
     */
    public function buscar(Request $request): JsonResponse
    {
        $query = Cliente::query();

        // Filtro por nombre
        if ($request->filled('nombre')) {
            $query->where('name', 'like', '%' . $request->nombre . '%');
        }

        // Filtro por apellido
        if ($request->filled('apellido')) {
            $query->where('apellido', 'like', '%' . $request->apellido . '%');
        }

        // Filtro por cédula/RIF
        if ($request->filled('cedula_rif')) {
            $query->where('cedula_rif', 'like', '%' . $request->cedula_rif . '%');
        }

        // Limitar resultados para mejor performance
        $clientes = $query->limit(50)->get();

        return response()->json($clientes);
    }

    public function store(Request $request)
    {
         info("validated",["validated: cliente"=>$request]);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'email' => 'nullable|email|max:255|unique:clientes,email',
            'ciudad' => 'nullable|string|max:255',
            'direccion' => 'nullable|string|max:255',
            'telefono' => 'nullable|string|max:20',
            'cedula_rif' => 'required|string|max:20|unique:clientes,cedula_rif',
            'tipo' => 'required|string|max:1',
        ]);
       

         try{    

        $cliente = Cliente::create($validated);

        // Si es una petición AJAX, devolver JSON
        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'cliente' => $cliente,
                'message' => 'Cliente creado exitosamente'
            ]);
        }

        // Si es una petición normal, redireccionar
        return redirect()->route('clientes.index')
            ->with('success', 'Cliente creado exitosamente.');
    }
    catch (\Exception $e) {
        info("error create cliente",["error:"=>$e->getMessage()] );
        return redirect()->route('clientes.index')
            ->with('error', 'Error al crear el cliente: ' . $e->getMessage());
    }  

    }

    public function edit(Cliente $cliente)
    {
        return Inertia::render('clientes/edit', ['cliente' => $cliente]);
    }

    public function update(Request $request, Cliente $cliente)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'email' => 'nullable|email|max:255|unique:clientes,email,' . $cliente->id,
            'ciudad' => 'nullable|string|max:255',
            'direccion' => 'nullable|string|max:255',
            'telefono' => 'nullable|string|max:20',
            'cedula_rif' => 'required|string|max:20|unique:clientes,cedula_rif,' . $cliente->id,
            'tipo' => 'required|string|max:1',
        ]);

        $cliente->update($validated);

        return redirect()->route('clientes.index')
            ->with('success', 'Cliente actualizado exitosamente.');
    }

    public function destroy(Cliente $cliente)
    {
        $cliente->delete();

        return redirect()->route('clientes.index')
            ->with('success', 'Cliente eliminado exitosamente.');
    }
}
