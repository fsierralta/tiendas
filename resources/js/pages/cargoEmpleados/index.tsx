import AppLayout from '@/layouts/app-layout';

import { BreadcrumbItem } from '@/types';
import { usePage, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, Briefcase, User } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Asignación de Cargos',
        href: "#",
    },
];

interface CargoEmpleado {
    id: number;
    id_cargo: number;
    id_empleado: number;
    created_at: string;
    updated_at: string;
    cargo: {
        id: number;
        name: string;
        descripcion?: string;
    };
    empleado: {
        id: number;
        name: string;
        apellidos: string;
        celular: string;
        sexo: 'M' | 'F';
    };
}

interface PaginatedData {
    data: CargoEmpleado[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

export default function Index(){
    const page = usePage().props as any;
    const cargoEmpleados = page.cargoEmpleados as PaginatedData;
    const [search, setSearch] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/cargo-empleados', { search }, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de eliminar esta asignación?')) {
            router.delete(`/admin/cargo-empleados/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Asignación de Cargos</h1>
                        <p className="text-muted-foreground mt-2">
                            Gestiona la asignación de cargos a empleados
                        </p>
                    </div>
                    <Link href="/admin/cargo-empleados/create">
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Nueva Asignación
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Asignaciones Activas</span>
                            <Badge variant="secondary">
                                {cargoEmpleados.total} registros
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="mb-6">
                            <div className="relative max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    type="text"
                                    placeholder="Buscar asignaciones..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </form>

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-3 font-medium">ID</th>
                                        <th className="text-left p-3 font-medium">Cargo</th>
                                        <th className="text-left p-3 font-medium">Empleado</th>
                                        <th className="text-left p-3 font-medium">Celular</th>
                                        <th className="text-left p-3 font-medium">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cargoEmpleados.data.length > 0 ? (
                                        cargoEmpleados.data.map((asignacion) => (
                                            <tr key={asignacion.id} className="border-b hover:bg-muted/50">
                                                <td className="p-3">{asignacion.id}</td>
                                                <td className="p-3">
                                                    <div className="flex items-center gap-2">
                                                        <Briefcase className="w-4 h-4 text-muted-foreground" />
                                                        <div>
                                                            <span className="font-medium">{asignacion.cargo.name}</span>
                                                            {asignacion.cargo.descripcion && (
                                                                <p className="text-sm text-muted-foreground">{asignacion.cargo.descripcion}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-4 h-4 text-muted-foreground" />
                                                        <div>
                                                            <span className="font-medium">{asignacion.empleado.name} {asignacion.empleado.apellidos}</span>
                                                            <p className="text-sm text-muted-foreground">{asignacion.empleado.celular}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-3">{asignacion.empleado.celular}</td>
                                                <td className="p-3">
                                                    <div className="flex gap-2">
                                                        <Link href={`/admin/cargo-empleados/${asignacion.id}/edit`}>
                                                            <Button variant="outline" size="sm">
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm"
                                                            onClick={() => handleDelete(asignacion.id)}
                                                            className="text-destructive hover:text-destructive"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="text-center p-8 text-muted-foreground">
                                                No se encontraron asignaciones
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {cargoEmpleados.last_page > 1 && (
                            <div className="flex justify-between items-center mt-6">
                                <div className="text-sm text-muted-foreground">
                                    Mostrando {cargoEmpleados.from} a {cargoEmpleados.to} de {cargoEmpleados.total} registros
                                </div>
                                <div className="flex gap-2">
                                    {cargoEmpleados.current_page > 1 && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.get('/admin/cargo-empleados', { page: cargoEmpleados.current_page - 1, search })}
                                        >
                                            Anterior
                                        </Button>
                                    )}
                                    <span className="px-3 py-1 text-sm">
                                        Página {cargoEmpleados.current_page} de {cargoEmpleados.last_page}
                                    </span>
                                    {cargoEmpleados.current_page < cargoEmpleados.last_page && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.get('/admin/cargo-empleados', { page: cargoEmpleados.current_page + 1, search })}
                                        >
                                            Siguiente
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
