import AppLayout from '@/layouts/app-layout';

import { BreadcrumbItem } from '@/types';
import { usePage, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, User, Mail, Phone, Wrench } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Técnicos',
        href: "#",
    },
];

interface Tecnico {
    id: number;
    name: string;
    apellidos?: string;
    email: string;
    celular: string;
    created_at: string;
    updated_at: string;
}

interface PaginatedData {
    data: Tecnico[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

export default function Index(){
    const page = usePage().props as any;
    const tecnicos = page.tecnicos as PaginatedData;
    const [search, setSearch] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/tecnicos', { search }, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de eliminar este técnico?')) {
            router.delete(`/admin/tecnicos/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Técnicos</h1>
                        <p className="text-muted-foreground mt-2">
                            Gestiona los técnicos disponibles en el sistema
                        </p>
                    </div>
                    <Link href="/admin/tecnicos/create">
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Nuevo Técnico
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Listado de Técnicos</span>
                            <Badge variant="secondary">
                                {tecnicos.total} registros
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="mb-6">
                            <div className="relative max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    type="text"
                                    placeholder="Buscar técnicos..."
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
                                        <th className="text-left p-3 font-medium">Apellidos</th>
                                        <th className="text-left p-3 font-medium">Email</th>
                                        <th className="text-left p-3 font-medium">Celular</th>
                                        <th className="text-left p-3 font-medium">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tecnicos.data.length > 0 ? (
                                        tecnicos.data.map((tecnico) => (
                                            <tr key={tecnico.id} className="border-b hover:bg-muted/50">
                                                <td className="p-3">{tecnico.id}</td>
                                                <td className="p-3 font-medium">{tecnico.name}</td>
                                                <td className="p-3">{tecnico.apellidos || '-'}</td>
                                                <td className="p-3">
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="w-4 h-4 text-muted-foreground" />
                                                        <span>{tecnico.email}</span>
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="w-4 h-4 text-muted-foreground" />
                                                        <span>{tecnico.celular}</span>
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex gap-2">
                                                        <Link href={`/admin/tecnicos/${tecnico.id}/edit`}>
                                                            <Button variant="outline" size="sm">
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm"
                                                            onClick={() => handleDelete(tecnico.id)}
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
                                                No se encontraron técnicos
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {tecnicos.last_page > 1 && (
                            <div className="flex justify-between items-center mt-6">
                                <div className="text-sm text-muted-foreground">
                                    Mostrando {tecnicos.from} a {tecnicos.to} de {tecnicos.total} registros
                                </div>
                                <div className="flex gap-2">
                                    {tecnicos.current_page > 1 && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.get('/admin/tecnicos', { page: tecnicos.current_page - 1, search })}
                                        >
                                            Anterior
                                        </Button>
                                    )}
                                    <span className="px-3 py-1 text-sm">
                                        Página {tecnicos.current_page} de {tecnicos.last_page}
                                    </span>
                                    {tecnicos.current_page < tecnicos.last_page && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.get('/admin/tecnicos', { page: tecnicos.current_page + 1, search })}
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
