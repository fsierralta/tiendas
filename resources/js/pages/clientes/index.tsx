import { Head, Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';

const breadcrumbs = [
    {
        title: 'Clientes',
        href: "#",
    },
];

interface Cliente {
    id: number;
    name: string;
    apellido: string;
    email: string | null;
    ciudad: string | null;
    direccion: string | null;
    telefono: string | null;
    cedula_rif: string;
    tipo: string;
}

interface PaginatedData {
    data: Cliente[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    [key: string]: any;
}

export default function Index(){
    const { clientes } = usePage().props as any;
    const [search, setSearch] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/clientes', { search }, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        if (confirm(`¿Estás seguro de eliminar este cliente?`)) {
            router.delete(`/admin/clientes/${id}`);
        }
    };

    return (
        <>
            <Head title="Clientes" />
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold">Clientes</h1>
                            <p className="text-muted-foreground mt-2">
                                Gestiona los clientes del sistema
                            </p>
                        </div>
                        <Link href="/admin/clientes/create">
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Nuevo Cliente
                            </Button>
                        </Link>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Listado de Clientes</span>
                                <Badge variant="secondary">
                                    {clientes.total} registros
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSearch} className="mb-6">
                                <div className="relative max-w-md">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                    <Input
                                        type="text"
                                        placeholder="Buscar clientes..."
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
                                            <th className="text-left p-3 font-medium">Cédula/RIF</th>
                                            <th className="text-left p-3 font-medium">Nombre</th>
                                            <th className="text-left p-3 font-medium">Apellido</th>
                                            <th className="text-left p-3 font-medium">Email</th>
                                            <th className="text-left p-3 font-medium">Teléfono</th>
                                            <th className="text-left p-3 font-medium">Ciudad</th>
                                            <th className="text-left p-3 font-medium">Tipo</th>
                                            <th className="text-left p-3 font-medium">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {clientes.data.length > 0 ? (
                                            clientes.data.map((cliente: Cliente) => (
                                                <tr key={cliente.id} className="border-b hover:bg-muted/50">
                                                    <td className="p-3">{cliente.id}</td>
                                                    <td className="p-3 font-medium">{cliente.cedula_rif}</td>
                                                    <td className="p-3">{cliente.name}</td>
                                                    <td className="p-3">{cliente.apellido}</td>
                                                    <td className="p-3 text-muted-foreground">
                                                        {cliente.email || 'Sin email'}
                                                    </td>
                                                    <td className="p-3 text-muted-foreground">
                                                        {cliente.telefono || 'Sin teléfono'}
                                                    </td>
                                                    <td className="p-3 text-muted-foreground">
                                                        {cliente.ciudad || 'Sin ciudad'}
                                                    </td>
                                                    <td className="p-3">
                                                        <Badge variant={cliente.tipo === 'N' ? 'default' : 'secondary'}>
                                                            {cliente.tipo === 'N' ? 'Natural' : 'Jurídico'}
                                                        </Badge>
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="flex gap-2">
                                                            <Link href={`/admin/clientes/${cliente.id}/edit`}>
                                                                <Button variant="outline" size="sm">
                                                                    <Edit className="w-4 h-4" />
                                                                </Button>
                                                            </Link>
                                                            <Button 
                                                                variant="outline" 
                                                                size="sm"
                                                                onClick={() => handleDelete(cliente.id)}
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
                                                <td colSpan={9} className="text-center p-8 text-muted-foreground">
                                                    No se encontraron clientes
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {clientes.last_page > 1 && (
                                <div className="flex justify-between items-center mt-6">
                                    <div className="text-sm text-muted-foreground">
                                        Mostrando {clientes.from} a {clientes.to} de {clientes.total} registros
                                    </div>
                                    <div className="flex gap-2">
                                        {clientes.current_page > 1 && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => router.get('/admin/clientes', { page: clientes.current_page - 1, search })}
                                            >
                                                Anterior
                                            </Button>
                                        )}
                                        <span className="px-3 py-1 text-sm">
                                            Página {clientes.current_page} de {clientes.last_page}
                                        </span>
                                        {clientes.current_page < clientes.last_page && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => router.get('/admin/clientes', { page: clientes.current_page + 1, search })}
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
        </>
    );
}
