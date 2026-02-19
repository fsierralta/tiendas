import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { usePage, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Users, Shield, Mail, Calendar, User } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '#',
    },
    {
        title: 'Usuarios',
        href: '/admin/users',
    },
    {
        title: 'Detalles del Usuario',
        href: '#',
    },
];

interface Role {
    id: number;
    name: string;
    descripcion: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
    roles: Role[];
}

export default function Show() {
    const { user } = usePage().props as any;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/users">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Volver
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-2">
                                <Users className="w-8 h-8" />
                                Detalles del Usuario
                            </h1>
                            <p className="text-muted-foreground mt-2">
                                Información completa del usuario
                            </p>
                        </div>
                    </div>
                    <Link href={`/admin/users/${user.id}/edit`}>
                        <Button>
                            <Edit className="w-4 h-4 mr-2" />
                            Editar Usuario
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Información Personal
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Nombre</label>
                                        <p className="text-lg">{user.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Email</label>
                                        <p className="text-lg flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            {user.email}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">ID de Usuario</label>
                                        <p className="text-lg">#{user.id}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Estado</label>
                                        <p className="text-lg">
                                            <Badge variant="default">Activo</Badge>
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="w-5 h-5" />
                                    Roles y Permisos
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {user.roles.length > 0 ? (
                                    <div className="space-y-4">
                                        <div className="flex flex-wrap gap-2">
                                            {user.roles.map((role: Role) => (
                                                <Badge 
                                                    key={role.id} 
                                                    variant="secondary"
                                                    className="flex items-center gap-1 px-3 py-1"
                                                >
                                                    <Shield className="w-3 h-3" />
                                                    {role.name}
                                                </Badge>
                                            ))}
                                        </div>
                                        <div className="space-y-3">
                                            {user.roles.map((role: Role) => (
                                                <div key={role.id} className="border rounded-lg p-3">
                                                    <h4 className="font-medium mb-2">{role.name}</h4>
                                                    <p className="text-sm text-muted-foreground">{role.descripcion}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Shield className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                        <p className="text-muted-foreground">Este usuario no tiene roles asignados</p>
                                        <Link href="/admin/roles/assign">
                                            <Button variant="outline" size="sm" className="mt-2">
                                                Asignar Roles
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    Información de Sistema
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Fecha de Creación</label>
                                    <p className="text-sm">
                                        {new Date(user.created_at).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Última Actualización</label>
                                    <p className="text-sm">
                                        {new Date(user.updated_at).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Cantidad de Roles</label>
                                    <p className="text-sm">{user.roles.length} roles asignados</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>Acciones Rápidas</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Link href={`/admin/users/${user.id}/edit`} className="block">
                                    <Button variant="outline" className="w-full justify-start">
                                        <Edit className="w-4 h-4 mr-2" />
                                        Editar Usuario
                                    </Button>
                                </Link>
                                <Link href="/admin/roles/assign" className="block">
                                    <Button variant="outline" className="w-full justify-start">
                                        <Shield className="w-4 h-4 mr-2" />
                                        Gestionar Roles
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
