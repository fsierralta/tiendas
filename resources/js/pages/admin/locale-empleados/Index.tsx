import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface LocaleEmpleado {
    id: number;
    empleado: {
        id: number;
        name: string;
    };
    locale: {
        id: number;
        name: string;
    };
}

interface Props {
    localeEmpleados: LocaleEmpleado[];
    flash?: {
        success?: string;
    };
}

export default function Index({ localeEmpleados, flash }: Props) {
    const [isDeleting, setIsDeleting] = useState<number | null>(null);

    useEffect(() => {
        if (flash?.success) {
            // Flash message will be handled by Inertia
        }
    }, [flash]);

    const handleDelete = (id: number) => {
        if (confirm('¿Está seguro de eliminar esta asignación?')) {
            setIsDeleting(id);
            router.delete(`/admin/locale-empleados/${id}`, {
                onSuccess: () => {
                    setIsDeleting(null);
                },
                onError: () => {
                    setIsDeleting(null);
                }
            });
        }
    };

    return (
        <AppLayout>
            <Head title="Asignación de Empleados a Locales" />
            
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Asignación de Empleados a Locales</h1>
                        <p className="text-muted-foreground">
                            Gestiona las asignaciones de empleados a locales
                        </p>
                    </div>
                    <Link href="/admin/locale-empleados/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Nueva Asignación
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Lista de Asignaciones</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {localeEmpleados.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Empleado</TableHead>
                                        <TableHead>Locale</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {localeEmpleados.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <Badge variant="secondary">{item.id}</Badge>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {item.empleado?.name || 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                {item.locale?.name || 'N/A'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end space-x-2">
                                                    <Link href={`/admin/locale-empleados/${item.id}/edit`}>
                                                        <Button variant="outline" size="sm">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDelete(item.id)}
                                                        disabled={isDeleting === item.id}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">No hay asignaciones registradas</p>
                                <Link href="/admin/locale-empleados/create" className="mt-4">
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Crear Primera Asignación
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
