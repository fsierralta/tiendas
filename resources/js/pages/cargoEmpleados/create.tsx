import AppLayout from '@/layouts/app-layout';

import { BreadcrumbItem } from '@/types';
import { Link, useForm, Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Briefcase, User } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Asignación de Cargos',
        href: "/admin/cargo-empleados",
    },
    {
        title: 'Nueva Asignación',
        href: "#",
    },
];

export default function Create({ cargos, empleados }: { cargos: any[], empleados: any[] }){
    const { data, setData, post, processing, errors } = useForm({
        id_cargo: '',
        id_empleado: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/cargo-empleados');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nueva Asignación de Cargo" />
            
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/cargo-empleados">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Nueva Asignación de Cargo</h1>
                        <p className="text-muted-foreground mt-2">
                            Asigna un cargo a un empleado
                        </p>
                    </div>
                </div>

                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Asignar Cargo a Empleado</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="id_cargo">Cargo *</Label>
                                    <select
                                        id="id_cargo"
                                        value={data.id_cargo}
                                        onChange={(e) => setData('id_cargo', e.target.value)}
                                        className="w-full p-3 border border-input bg-background text-sm ring-offset-background file:ring-2 file:ring-ring file:ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        required
                                    >
                                        <option value="">Selecciona un cargo...</option>
                                        {cargos.map((cargo: any) => (
                                            <option key={cargo.id} value={cargo.id}>
                                                {cargo.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.id_cargo && (
                                        <p className="text-sm text-destructive">{errors.id_cargo}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="id_empleado">Empleado *</Label>
                                    <select
                                        id="id_empleado"
                                        value={data.id_empleado}
                                        onChange={(e) => setData('id_empleado', e.target.value)}
                                        className="w-full p-3 border border-input bg-background text-sm ring-offset-background file:ring-2 file:ring-ring file:ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        required
                                    >
                                        <option value="">Selecciona un empleado...</option>
                                        {empleados.map((empleado: any) => (
                                            <option key={empleado.id} value={empleado.id}>
                                                {empleado.name} {empleado.apellidos}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.id_empleado && (
                                        <p className="text-sm text-destructive">{errors.id_empleado}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 pt-6">
                                <Link href="/admin/cargo-empleados">
                                    <Button variant="outline" type="button">
                                        Cancelar
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    <Save className="w-4 h-4 mr-2" />
                                    {processing ? 'Guardando...' : 'Asignar Cargo'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
