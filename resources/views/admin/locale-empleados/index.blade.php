@extends('app')

@section('content')
<div class="container-fluid">
    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Asignación de Empleados a Locales</h3>
                    <div class="card-tools">
                        <a href="{{ route('localeEmpleados.create') }}" class="btn btn-primary btn-sm">
                            <i class="fas fa-plus"></i> Nueva Asignación
                        </a>
                    </div>
                </div>
                <div class="card-body">
                    @if(session('success'))
                        <div class="alert alert-success">
                            {{ session('success') }}
                        </div>
                    @endif
                    
                    <table class="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Empleado</th>
                                <th>Locale</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse($localeEmpleados as $localeEmpleado)
                                <tr>
                                    <td>{{ $localeEmpleado->id }}</td>
                                    <td>{{ $localeEmpleado->empleado->nombre ?? 'N/A' }}</td>
                                    <td>{{ $localeEmpleado->locale->nombre ?? 'N/A' }}</td>
                                    <td>
                                        <div class="btn-group">
                                            <a href="{{ route('localeEmpleados.edit', $localeEmpleado) }}" 
                                               class="btn btn-warning btn-sm">
                                                <i class="fas fa-edit"></i> Editar
                                            </a>
                                            <form action="{{ route('localeEmpleados.destroy', $localeEmpleado) }}" 
                                                  method="POST" style="display: inline;">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit" class="btn btn-danger btn-sm" 
                                                        onclick="return confirm('¿Está seguro de eliminar esta asignación?')">
                                                    <i class="fas fa-trash"></i> Eliminar
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="4" class="text-center">No hay asignaciones registradas</td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
