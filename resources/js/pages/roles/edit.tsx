import AppLayout from '@/layouts/app-layout';

import { BreadcrumbItem } from '@/types';
import { usePage, Link, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Shield, Trash2 } from 'lucide-react';

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
        title: 'Editar Rol',
        href: "#",
    },
];

interface Role {
    id: number;
    name: string;
    descripcion: string;
    update: boolean;
    create: boolean;
    read: boolean;
    delete: boolean;
}

export default function Edit() {
    const { role } = usePage().props as any;
    
    const { data, setData, put, processing, errors } = useForm({
        name: role.name,
        descripcion: role.descripcion || '',
        update: role.update === 'Y',
        create: role.create === 'Y',
        read: role.read === 'Y',
        delete: role.delete === 'Y',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/roles/${role.id}`, data);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Editar Rol</h1>
                        <p className="text-muted-foreground mt-2">
                            Modifica la información y permisos del rol
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
                            Editar Rol: {role.name}
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
                                    {processing ? 'Actualizando...' : 'Actualizar Rol'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle className="text-red-600">Zona de Peligro</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Una vez eliminado, el rol no se puede recuperar.
                                </p>
                            </div>
                            <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => {
                                    if (confirm('¿Estás seguro de eliminar este rol? Esta acción no se puede deshacer.')) {
                                        router.delete(`/admin/roles/${role.id}`);
                                    }
                                }}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Eliminar Rol
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
