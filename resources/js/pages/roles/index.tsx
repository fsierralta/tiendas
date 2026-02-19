import AppLayout from '@/layouts/app-layout';

import { BreadcrumbItem } from '@/types';
import { usePage, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, Users, Shield } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Sistema',
        href: "#",
    },
    {
        title: 'Roles',
        href: "#",
    },
];

interface Role {
    id: number;
    name: string;
    descripcion: string;
    update: boolean;
    create: boolean;
    read: boolean;
    delete: boolean;
    users_count?: number;
}

interface PaginatedData {
    data: Role[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    [key: string]: any;
}

export default function Index(){
    const { roles } = usePage().props as any;
    const [search, setSearch] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/roles', { search }, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de eliminar este rol?')) {
            router.delete(`/admin/roles/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Gestión de Roles</h1>
                        <p className="text-muted-foreground mt-2">
                            Administra los roles y permisos del sistema
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/admin/roles/create">
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Nuevo Rol
                            </Button>
                        </Link>
                        <Link href="/admin/roles/assign">
                            <Button variant="outline">
                                <Shield className="w-4 h-4 mr-2" />
                                Asignar Roles
                            </Button>
                        </Link>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <Shield className="w-5 h-5" />
                                Listado de Roles
                            </span>
                            <Badge variant="secondary">
                                {roles.total} registros
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="mb-6">
                            <div className="relative max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    type="text"
                                    placeholder="Buscar roles..."
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
                                        <th className="text-left p-3 font-medium">Nombre</th>
                                        <th className="text-left p-3 font-medium">Descripción</th>
                                        <th className="text-left p-3 font-medium">Permisos</th>
                                        <th className="text-left p-3 font-medium">Usuarios</th>
                                        <th className="text-left p-3 font-medium">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {roles.data.length > 0 ? (
                                        roles.data.map((role: Role) => (
                                            <tr key={role.id} className="border-b hover:bg-muted/50">
                                                <td className="p-3">{role.id}</td>
                                                <td className="p-3 font-medium">{role.name}</td>
                                                <td className="p-3 text-muted-foreground">
                                                    {role.descripcion || 'Sin descripción'}
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex gap-1">
                                                        {role.read && (
                                                            <Badge variant="outline" className="text-xs">Leer</Badge>
                                                        )}
                                                        {role.create && (
                                                            <Badge variant="outline" className="text-xs">Crear</Badge>
                                                        )}
                                                        {role.update && (
                                                            <Badge variant="outline" className="text-xs">Actualizar</Badge>
                                                        )}
                                                        {role.delete && (
                                                            <Badge variant="destructive" className="text-xs">Eliminar</Badge>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex items-center gap-1">
                                                        <Users className="w-4 h-4 text-muted-foreground" />
                                                        <span className="text-sm">{role.users_count || 0}</span>
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex gap-2">
                                                        <Link href={`/admin/roles/${role.id}/edit`}>
                                                            <Button variant="outline" size="sm">
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm"
                                                            onClick={() => handleDelete(role.id)}
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
                                            <td colSpan={6} className="text-center p-8 text-muted-foreground">
                                                No se encontraron roles
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {roles.last_page > 1 && (
                            <div className="flex justify-between items-center mt-6">
                                <div className="text-sm text-muted-foreground">
                                    Mostrando {roles.from} a {roles.to} de {roles.total} registros
                                </div>
                                <div className="flex gap-2">
                                    {roles.current_page > 1 && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.get('/admin/roles', { page: roles.current_page - 1, search })}
                                        >
                                            Anterior
                                        </Button>
                                    )}
                                    <span className="px-3 py-1 text-sm">
                                        Página {roles.current_page} de {roles.last_page}
                                    </span>
                                    {roles.current_page < roles.last_page && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.get('/admin/roles', { page: roles.current_page + 1, search })}
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
