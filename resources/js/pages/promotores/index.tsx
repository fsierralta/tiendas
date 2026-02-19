import AppLayout from '@/layouts/app-layout';

import { BreadcrumbItem } from '@/types';
import { usePage, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, User, Mail, Phone } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Promotores',
        href: "#",
    },
];

interface Promotore {
    id: number;
    name: string;
    apellidos: string;
    email: string;
    celular: string;
    created_at: string;
    updated_at: string;
}

interface PaginatedData {
    data: Promotore[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

export default function Index(){
    const page = usePage().props as any;
    const promotores = page.promotores as PaginatedData;
    const [search, setSearch] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/promotores', { search }, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de eliminar este promotor?')) {
            router.delete(`/admin/promotores/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Promotores</h1>
                        <p className="text-muted-foreground mt-2">
                            Gestiona los promotores disponibles en el sistema
                        </p>
                    </div>
                    <Link href="/admin/promotores/create">
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Nuevo Promotor
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Listado de Promotores</span>
                            <Badge variant="secondary">
                                {promotores.total} registros
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="mb-6">
                            <div className="relative max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    type="text"
                                    placeholder="Buscar promotores..."
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
                                    {promotores.data.length > 0 ? (
                                        promotores.data.map((promotor) => (
                                            <tr key={promotor.id} className="border-b hover:bg-muted/50">
                                                <td className="p-3">{promotor.id}</td>
                                                <td className="p-3 font-medium">{promotor.name}</td>
                                                <td className="p-3">{promotor.apellidos}</td>
                                                <td className="p-3">
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="w-4 h-4 text-muted-foreground" />
                                                        <span>{promotor.email}</span>
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="w-4 h-4 text-muted-foreground" />
                                                        <span>{promotor.celular}</span>
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex gap-2">
                                                        <Link href={`/admin/promotores/${promotor.id}/edit`}>
                                                            <Button variant="outline" size="sm">
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm"
                                                            onClick={() => handleDelete(promotor.id)}
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
                                                No se encontraron promotores
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {promotores.last_page > 1 && (
                            <div className="flex justify-between items-center mt-6">
                                <div className="text-sm text-muted-foreground">
                                    Mostrando {promotores.from} a {promotores.to} de {promotores.total} registros
                                </div>
                                <div className="flex gap-2">
                                    {promotores.current_page > 1 && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.get('/admin/promotores', { page: promotores.current_page - 1, search })}
                                        >
                                            Anterior
                                        </Button>
                                    )}
                                    <span className="px-3 py-1 text-sm">
                                        Página {promotores.current_page} de {promotores.last_page}
                                    </span>
                                    {promotores.current_page < promotores.last_page && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.get('/admin/promotores', { page: promotores.current_page + 1, search })}
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
