@extends('app')

@section('content')
<div class="container-fluid">
    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Editar Asignación de Empleado a Locale</h3>
                    <div class="card-tools">
                        <a href="{{ route('localeEmpleados.index') }}" class="btn btn-secondary btn-sm">
                            <i class="fas fa-arrow-left"></i> Volver
                        </a>
                    </div>
                </div>
                <div class="card-body">
                    <form action="{{ route('localeEmpleados.update', $localeEmpleado) }}" method="POST">
                        @csrf
                        @method('PUT')
                        
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="id_empleado">Empleado</label>
                                    <select name="id_empleado" id="id_empleado" class="form-control @error('id_empleado') is-invalid @enderror" required>
                                        <option value="">Seleccione un empleado</option>
                                        @foreach($empleados as $empleado)
                                            <option value="{{ $empleado->id }}" {{ $localeEmpleado->id_empleado == $empleado->id ? 'selected' : '' }}>
                                                {{ $empleado->nombre }}
                                            </option>
                                        @endforeach
                                    </select>
                                    @error('id_empleado')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>
                            
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="id_locale">Locale</label>
                                    <select name="id_locale" id="id_locale" class="form-control @error('id_locale') is-invalid @enderror" required>
                                        <option value="">Seleccione un locale</option>
                                        @foreach($locales as $locale)
                                            <option value="{{ $locale->id }}" {{ $localeEmpleado->id_locale == $locale->id ? 'selected' : '' }}>
                                                {{ $locale->nombre }}
                                            </option>
                                        @endforeach
                                    </select>
                                    @error('id_locale')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i> Actualizar
                            </button>
                            <a href="{{ route('localeEmpleados.index') }}" class="btn btn-secondary">
                                <i class="fas fa-times"></i> Cancelar
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
