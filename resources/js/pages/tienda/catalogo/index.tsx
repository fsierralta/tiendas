import AppLayout from '@/layouts/app-layout';

import { BreadcrumbItem } from '@/types';
import { usePage, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import tienda_cargo from '@/routes/tienda_cargo';



const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Catalogo',
        href: "#",
    },
];

interface Cargo {
    id: number;
    name: string;
    descripcion: string;
}

interface PaginatedData {
    data: Cargo[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    [key: string]: any;
}

export default function Index(){
    const { cargos } = usePage().props as any;
    const [search, setSearch] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(tienda_cargo.index.url(), { search }, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        if (confirm(`¿Estás seguro de eliminar este cargo?${id}`)) {
            try {
               router.delete(tienda_cargo.destroy.url({ id }));

            } catch (error) {
            }
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Catálogo de Cargos</h1>
                        <p className="text-muted-foreground mt-2">
                            Gestiona los cargos disponibles en el sistema
                        </p>
                    </div>

                    <Link href={tienda_cargo.create.url()}>

                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Nuevo Cargo
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Listado de Cargos</span>
                            <Badge variant="secondary">
                                {cargos.total} registros
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="mb-6">
                            <div className="relative max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    type="text"
                                    placeholder="Buscar cargos..."
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
                                    {cargos.data.length > 0 ? (
                                        cargos.data.map((cargo: Cargo) => (
                                            <tr key={cargo.id} className="border-b hover:bg-muted/50">
                                                <td className="p-3">{cargo.id}</td>
                                                <td className="p-3 font-medium">{cargo.name}</td>
                                                <td className="p-3 text-muted-foreground">
                                                    {cargo.descripcion || 'Sin descripción'}
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex gap-2">
                                                        <Link href={tienda_cargo.show.url({ cargo: cargo.id })}>
                                                            <Button variant="outline" size="sm">
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm"
                                                            onClick={() => handleDelete(cargo.id)}
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
                                                No se encontraron cargos
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {cargos.last_page > 1 && (
                            <div className="flex justify-between items-center mt-6">
                                <div className="text-sm text-muted-foreground">
                                    Mostrando {cargos.from} a {cargos.to} de {cargos.total} registros
                                </div>
                                <div className="flex gap-2">
                                    {cargos.current_page > 1 && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.get(tienda_cargo.index.url(), { page: cargos.current_page - 1, search })}
                                        >
                                            Anterior
                                        </Button>
                                    )}
                                    <span className="px-3 py-1 text-sm">
                                        Página {cargos.current_page} de {cargos.last_page}
                                    </span>
                                    {cargos.current_page < cargos.last_page && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.get(tienda_cargo.index.url(), { page: cargos.current_page + 1, search })}
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