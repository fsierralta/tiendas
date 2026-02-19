import AppLayout from '@/layouts/app-layout';

import { BreadcrumbItem } from '@/types';
import { Link, useForm, Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, User, Phone } from 'lucide-react';

interface Empleado {
    id: number;
    name: string;
    apellidos: string;
    celular: string;
    sexo: 'M' | 'F';
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Empleados',
        href: "/admin/empleados",
    },
    {
        title: 'Editar Empleado',
        href: "#",
    },
];

export default function Edit({ empleado }: { empleado: Empleado }){
    const { data, setData, put, processing, errors } = useForm({
        name: empleado.name || '',
        apellidos: empleado.apellidos || '',
        celular: empleado.celular || '',
        sexo: empleado.sexo || 'M',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/empleados/${empleado.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Empleado" />
            
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/empleados">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Editar Empleado</h1>
                        <p className="text-muted-foreground mt-2">
                            Actualiza la información del empleado
                        </p>
                    </div>
                </div>

                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Información del Empleado</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre *</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Ej: Juan"
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                    {errors.name && (
                                        <p className="text-sm text-destructive">{errors.name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="apellidos">Apellidos *</Label>
                                    <Input
                                        id="apellidos"
                                        type="text"
                                        value={data.apellidos}
                                        onChange={(e) => setData('apellidos', e.target.value)}
                                        placeholder="Ej: Pérez García"
                                        required
                                    />
                                    {errors.apellidos && (
                                        <p className="text-sm text-destructive">{errors.apellidos}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="celular">Celular *</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                        <Input
                                            id="celular"
                                            type="text"
                                            value={data.celular}
                                            onChange={(e) => setData('celular', e.target.value)}
                                            placeholder="Ej: 0414-1234567"
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                    {errors.celular && (
                                        <p className="text-sm text-destructive">{errors.celular}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sexo">Sexo *</Label>
                                    <div className="flex gap-4 mt-2">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="sexo-m"
                                                checked={data.sexo === 'M'}
                                                onCheckedChange={() => setData('sexo', 'M')}
                                            />
                                            <Label htmlFor="sexo-m">Masculino</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="sexo-f"
                                                checked={data.sexo === 'F'}
                                                onCheckedChange={() => setData('sexo', 'F')}
                                            />
                                            <Label htmlFor="sexo-f">Femenino</Label>
                                        </div>
                                    </div>
                                    {errors.sexo && (
                                        <p className="text-sm text-destructive">{errors.sexo}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 pt-6">
                                <Link href="/admin/empleados">
                                    <Button variant="outline" type="button">
                                        Cancelar
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    <Save className="w-4 h-4 mr-2" />
                                    {processing ? 'Actualizando...' : 'Actualizar Empleado'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
