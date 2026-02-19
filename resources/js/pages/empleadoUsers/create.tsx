import AppLayout from '@/layouts/app-layout';

import { BreadcrumbItem } from '@/types';
import { Link, useForm, Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Users, User } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Asignación Empleado-Usuario',
        href: "/admin/empleado-users",
    },
    {
        title: 'Crear Asignación',
        href: "#",
    },
];

export default function Create({ users, empleados }: { users: any[], empleados: any[] }){
    const { data, setData, post, processing, errors } = useForm({
        id_user: '',
        id_empleado: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/empleado-users');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Asignación Empleado-Usuario" />
            
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/empleado-users">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Crear Nueva Asignación</h1>
                        <p className="text-muted-foreground mt-2">
                            Asigna un empleado a un usuario del sistema
                        </p>
                    </div>
                </div>

                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Información de la Asignación</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="id_user">Usuario *</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 z-10" />
                                        <Select value={data.id_user} onValueChange={(value) => setData('id_user', value)}>
                                            <SelectTrigger className="pl-10">
                                                <SelectValue placeholder="Selecciona un usuario" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {users.map((user) => (
                                                    <SelectItem key={user.id} value={user.id.toString()}>
                                                        {user.name} ({user.email})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {errors.id_user && (
                                        <p className="text-sm text-destructive">{errors.id_user}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="id_empleado">Empleado *</Label>
                                    <div className="relative">
                                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 z-10" />
                                        <Select value={data.id_empleado} onValueChange={(value) => setData('id_empleado', value)}>
                                            <SelectTrigger className="pl-10">
                                                <SelectValue placeholder="Selecciona un empleado" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {empleados.map((empleado) => (
                                                    <SelectItem key={empleado.id} value={empleado.id.toString()}>
                                                        {empleado.name} {empleado.apellidos}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {errors.id_empleado && (
                                        <p className="text-sm text-destructive">{errors.id_empleado}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 pt-6">
                                <Link href="/admin/empleado-users">
                                    <Button variant="outline" type="button">
                                        Cancelar
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    <Save className="w-4 h-4 mr-2" />
                                    {processing ? 'Guardando...' : 'Guardar Asignación'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
