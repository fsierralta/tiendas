import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, ArrowLeft, MapPin } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface Ubicacion {
    id: number;
    name: string;
    id_locales: number;
    locale: {
        id: number;
        name: string;
    };
}

interface Props {
    ubicaciones: Ubicacion[];
    flash?: {
        success?: string;
    };
}

export default function Index({ ubicaciones, flash }: Props) {
    const [isDeleting, setIsDeleting] = useState<number | null>(null);

    useEffect(() => {
        if (flash?.success) {
            // Flash message will be handled by Inertia
        }
    }, [flash]);

    const handleDelete = (id: number) => {
        if (confirm('¿Está seguro de eliminar esta ubicación?')) {
            setIsDeleting(id);
            router.delete(`/admin/ubicaciones/${id}`, {
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
            <Head title="Ubicaciones" />
            
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Ubicaciones</h1>
                        <p className="text-muted-foreground">
                            Gestiona las ubicaciones de almacenamiento
                        </p>
                    </div>
                    <Link href="/admin/ubicaciones/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Nueva Ubicación
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Lista de Ubicaciones</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {ubicaciones.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Nombre</TableHead>
                                        <TableHead>Locale</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {ubicaciones.map((ubicacion) => (
                                        <TableRow key={ubicacion.id}>
                                            <TableCell>
                                                <Badge variant="secondary">{ubicacion.id}</Badge>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center">
                                                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                                                    {ubicacion.name}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {ubicacion.locale?.name || 'N/A'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end space-x-2">
                                                    <Link href={`/admin/ubicaciones/${ubicacion.id}/edit`}>
                                                        <Button variant="outline" size="sm">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDelete(ubicacion.id)}
                                                        disabled={isDeleting === ubicacion.id}
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
                                <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
                                <p className="text-muted-foreground mt-2">No hay ubicaciones registradas</p>
                                <Link href="/admin/ubicaciones/create" className="mt-4">
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Crear Primera Ubicación
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
