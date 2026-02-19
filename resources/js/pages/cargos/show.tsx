import AppLayout from '@/layouts/app-layout';

import { BreadcrumbItem } from '@/types';
import { usePage, Link, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save } from 'lucide-react';
import {update} from "@actions/App/Http/Controllers/CargoController";
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Catalogo',
        href: "/admin/tienda-cargo",
    },
    {
        title: 'Editar Cargo',
        href: "#",
    },
];

interface Cargo {
    id: number;
    name: string;
    descripcion: string;
}

export default function Show() {
    const { cargo } = usePage().props as any;
    
    const { data, setData,  processing, errors } = useForm({
        name: cargo.name,
        descripcion: cargo.descripcion || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
       router.patch(update(cargo.id), data);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Editar Cargo</h1>
                        <p className="text-muted-foreground mt-2">
                            Modifica la información del cargo seleccionado
                        </p>
                    </div>
                    <Link href="/admin/tienda-cargo">
                        <Button variant="outline">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Información del Cargo</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium">
                                        Nombre del Cargo
                                    </label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Ingrese el nombre del cargo"
                                        className={errors.name ? 'border-red-500' : ''}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500">{errors.name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="descripcion" className="text-sm font-medium">
                                        Descripción
                                    </label>
                                    <Input
                                        id="descripcion"
                                        type="text"
                                        value={data.descripcion}
                                        onChange={(e) => setData('descripcion', e.target.value)}
                                        placeholder="Ingrese una descripción (opcional)"
                                        className={errors.descripcion ? 'border-red-500' : ''}
                                    />
                                    {errors.descripcion && (
                                        <p className="text-sm text-red-500">{errors.descripcion}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <Link href="/admin/tienda-cargo">
                                    <Button variant="outline" type="button">
                                        Cancelar
                                    </Button>
                                </Link>
                                <Button 
                                    type="submit" 
                                    disabled={processing}
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    {processing ? 'Guardando...' : 'Guardar Cambios'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-red-600">Zona de Peligro</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Una vez eliminado, el cargo no se puede recuperar.
                                </p>
                            </div>
                            <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => {
                                    if (confirm('¿Estás seguro de eliminar este cargo? Esta acción no se puede deshacer.')) {
                                        router.delete(`/admin/tienda-cargo/${cargo.id}`);
                                    }
                                }}
                            >
                                Eliminar Cargo
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
