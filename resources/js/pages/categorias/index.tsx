import AppLayout from '@/layouts/app-layout';

import { BreadcrumbItem } from '@/types';
import { usePage, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, Folder } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categorías',
        href: "#",
    },
];

interface Categoria {
    id: number;
    name: string;
    descripcion?: string;
    created_at: string;
    updated_at: string;
}

interface PaginatedData {
    data: Categoria[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

export default function Index(){
    const page = usePage().props as any;
    const categorias = page.categorias as PaginatedData;
    const [search, setSearch] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/categorias', { search }, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de eliminar esta categoría?')) {
            router.delete(`/admin/categorias/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Categorías</h1>
                        <p className="text-muted-foreground mt-2">
                            Gestiona las categorías disponibles en el sistema
                        </p>
                    </div>
                    <Link href="/admin/categorias/create">
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Nueva Categoría
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Listado de Categorías</span>
                            <Badge variant="secondary">
                                {categorias.total} registros
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="mb-6">
                            <div className="relative max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    type="text"
                                    placeholder="Buscar categorías..."
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
                                        <th className="text-left p-3 font-medium">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categorias.data.length > 0 ? (
                                        categorias.data.map((categoria) => (
                                            <tr key={categoria.id} className="border-b hover:bg-muted/50">
                                                <td className="p-3">{categoria.id}</td>
                                                <td className="p-3 font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <Folder className="w-4 h-4 text-muted-foreground" />
                                                        <span>{categoria.name}</span>
                                                    </div>
                                                </td>
                                                <td className="p-3 text-muted-foreground">
                                                    <span className="max-w-xs truncate">
                                                        {categoria.descripcion || 'Sin descripción'}
                                                    </span>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex gap-2">
                                                        <Link href={`/admin/categorias/${categoria.id}/edit`}>
                                                            <Button variant="outline" size="sm">
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm"
                                                            onClick={() => handleDelete(categoria.id)}
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
                                            <td colSpan={4} className="text-center p-8 text-muted-foreground">
                                                No se encontraron categorías
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {categorias.last_page > 1 && (
                            <div className="flex justify-between items-center mt-6">
                                <div className="text-sm text-muted-foreground">
                                    Mostrando {categorias.from} a {categorias.to} de {categorias.total} registros
                                </div>
                                <div className="flex gap-2">
                                    {categorias.current_page > 1 && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.get('/admin/categorias', { page: categorias.current_page - 1, search })}
                                        >
                                            Anterior
                                        </Button>
                                    )}
                                    <span className="px-3 py-1 text-sm">
                                        Página {categorias.current_page} de {categorias.last_page}
                                    </span>
                                    {categorias.current_page < categorias.last_page && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.get('/admin/categorias', { page: categorias.current_page + 1, search })}
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
