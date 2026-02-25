import AppLayout from '@/layouts/app-layout';

import { BreadcrumbItem } from '@/types';
import { usePage, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, Calendar, DollarSign } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasas BCV',
        href: "#",
    },
];

interface Tasabcv {
    id: number;
    fecha: string;
    monto: number;
    created_at: string;
    updated_at: string;
}

interface PaginatedData {
    data: Tasabcv[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

export default function Index(){
    const page = usePage().props as any;
    const tasabcvs = page.tasabcvs as PaginatedData;
    const [search, setSearch] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/tasabcvs', { search }, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de eliminar esta tasa BCV?')) {
            router.delete(`/admin/tasabcvs/${id}`);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-VE', {
            style: 'currency',
            currency: 'VES'
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        try {
            // Intentar parsear la fecha como UTC y mostrar en hora local
            const date = new Date(dateString);
            
            // Verificar si la fecha es válida
            if (isNaN(date.getTime())) {
                return 'Fecha inválida';
            }
            
            // Usar UTC para evitar desface y luego mostrar en formato local
            return date.toLocaleDateString('es-VE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: 'UTC' // Especificar UTC para consistencia
            });
        } catch (error) {
            console.error('Error al formatear fecha:', error);
            return dateString; // Retornar el original si hay error
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Tasas BCV</h1>
                        <p className="text-muted-foreground mt-2">
                            Gestiona las tasas de cambio del Banco Central de Venezuela
                        </p>
                    </div>
                    <Link href="/admin/tasabcvs/create">
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Nueva Tasa BCV
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Listado de Tasas BCV</span>
                            <Badge variant="secondary">
                                {tasabcvs.total} registros
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="mb-6">
                            <div className="relative max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    type="text"
                                    placeholder="Buscar tasas..."
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
                                        <th className="text-left p-3 font-medium">Fecha</th>
                                        <th className="text-left p-3 font-medium">Monto</th>
                                        <th className="text-left p-3 font-medium">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tasabcvs.data.length > 0 ? (
                                        tasabcvs.data.map((tasabcv) => (
                                            <tr key={tasabcv.id} className="border-b hover:bg-muted/50">
                                                <td className="p-3">{tasabcv.id}</td>
                                                <td className="p-3">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                                        <span>{formatDate(tasabcv.fecha)}</span>
                                                    </div>
                                                </td>
                                                <td className="p-3 font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                                                        <span className="text-green-600">
                                                            {formatCurrency(tasabcv.monto)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex gap-2">
                                                        <Link href={`/admin/tasabcvs/${tasabcv.id}/edit`}>
                                                            <Button variant="outline" size="sm">
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm"
                                                            onClick={() => handleDelete(tasabcv.id)}
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
                                                No se encontraron tasas BCV
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {tasabcvs.last_page > 1 && (
                            <div className="flex justify-between items-center mt-6">
                                <div className="text-sm text-muted-foreground">
                                    Mostrando {tasabcvs.from} a {tasabcvs.to} de {tasabcvs.total} registros
                                </div>
                                <div className="flex gap-2">
                                    {tasabcvs.current_page > 1 && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.get('/admin/tasabcvs', { page: tasabcvs.current_page - 1, search })}
                                        >
                                            Anterior
                                        </Button>
                                    )}
                                    <span className="px-3 py-1 text-sm">
                                        Página {tasabcvs.current_page} de {tasabcvs.last_page}
                                    </span>
                                    {tasabcvs.current_page < tasabcvs.last_page && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.get('/admin/tasabcvs', { page: tasabcvs.current_page + 1, search })}
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
