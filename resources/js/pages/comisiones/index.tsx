import AppLayout from '@/layouts/app-layout';

import { BreadcrumbItem } from '@/types';
import { usePage, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, Percent, Building } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Comisiones',
        href: "#",
    },
];

interface Comision {
    id: number;
    name: string;
    porcentaje: number;
    id_locale: number;
    locale?: {
        id: number;
        name: string;
    };
    created_at: string;
    updated_at: string;
}

interface PaginatedData {
    data: Comision[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

export default function Index(){
    const page = usePage().props as any;
    const comisiones = page.comisiones as PaginatedData;
    const [search, setSearch] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/comisiones', { search });
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de eliminar esta comisión?')) {
            router.delete(`/admin/comisiones/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Comisiones</h1>
                        <p className="text-muted-foreground mt-2">
                            Gestiona las comisiones por local
                        </p>
                    </div>
                    <Link href="/admin/comisiones/create">
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Nueva Comisión
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Search className="w-5 h-5" />
                            Buscar Comisiones
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <Input
                                placeholder="Buscar por nombre o local..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="max-w-sm"
                            />
                            <Button type="submit">Buscar</Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Lista de Comisiones</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-4">ID</th>
                                        <th className="text-left p-4">Nombre</th>
                                        <th className="text-left p-4">Local</th>
                                        <th className="text-left p-4">Porcentaje</th>
                                        <th className="text-left p-4">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {comisiones.data.map((comision) => (
                                        <tr key={comision.id} className="border-b hover:bg-muted/50">
                                            <td className="p-4">
                                                <Badge variant="secondary">{comision.id}</Badge>
                                            </td>
                                            <td className="p-4 font-medium">{comision.name}</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <Building className="w-4 h-4 text-muted-foreground" />
                                                    {comision.locale?.name || `Local #${comision.id_locale}`}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <Badge variant="outline" className="text-green-600">
                                                    <Percent className="w-3 h-3 mr-1" />
                                                    {comision.porcentaje}%
                                                </Badge>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <Link href={`/admin/comisiones/${comision.id}/edit`}>
                                                        <Button variant="outline" size="sm">
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDelete(comision.id)}
                                                        className="text-destructive hover:text-destructive"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {comisiones.data.length === 0 && (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">No se encontraron comisiones</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
