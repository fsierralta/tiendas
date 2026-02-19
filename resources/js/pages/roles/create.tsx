import AppLayout from '@/layouts/app-layout';

import { BreadcrumbItem } from '@/types';
import { usePage, Link, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Shield } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Sistema',
        href: "/admin/roles",
    },
    {
        title: 'Roles',
        href: "/admin/roles",
    },
    {
        title: 'Nuevo Rol',
        href: "#",
    },
];

interface Role {
    id?: number;
    name: string;
    descripcion: string;
    update: boolean;
    create: boolean;
    read: boolean;
    delete: boolean;
}

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        descripcion: '',
        update: false,
        create: false,
        read: false,
        delete: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/roles', data);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Nuevo Rol</h1>
                        <p className="text-muted-foreground mt-2">
                            Crea un nuevo rol con sus permisos específicos
                        </p>
                    </div>
                    <Link href="/admin/roles">
                        <Button variant="outline">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="w-5 h-5" />
                            Información del Rol
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <label htmlFor="name" className="text-sm font-medium">
                                        Nombre del Rol *
                                    </label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Ingrese el nombre del rol"
                                        className={errors.name ? 'border-red-500' : ''}
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500">{errors.name}</p>
                                    )}
                                </div>

                                <div className="space-y-2 md:col-span-2">
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

                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium mb-4">Permisos del Rol</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="space-y-2">
                                            <label className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    checked={data.read}
                                                    onChange={(e) => setData('read', e.target.checked)}
                                                    className="rounded"
                                                />
                                                <span className="text-sm font-medium">Leer</span>
                                            </label>
                                            <p className="text-xs text-muted-foreground">Permite ver información</p>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    checked={data.create}
                                                    onChange={(e) => setData('create', e.target.checked)}
                                                    className="rounded"
                                                />
                                                <span className="text-sm font-medium">Crear</span>
                                            </label>
                                            <p className="text-xs text-muted-foreground">Permite crear nuevos registros</p>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    checked={data.update}
                                                    onChange={(e) => setData('update', e.target.checked)}
                                                    className="rounded"
                                                />
                                                <span className="text-sm font-medium">Actualizar</span>
                                            </label>
                                            <p className="text-xs text-muted-foreground">Permite modificar registros</p>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    checked={data.delete}
                                                    onChange={(e) => setData('delete', e.target.checked)}
                                                    className="rounded"
                                                />
                                                <span className="text-sm font-medium">Eliminar</span>
                                            </label>
                                            <p className="text-xs text-muted-foreground">Permite eliminar registros</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-6">
                                <Link href="/admin/roles">
                                    <Button variant="outline" type="button">
                                        Cancelar
                                    </Button>
                                </Link>
                                <Button 
                                    type="submit" 
                                    disabled={processing}
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    {processing ? 'Guardando...' : 'Guardar Rol'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
