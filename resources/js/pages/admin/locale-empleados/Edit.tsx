import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, X } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface Empleado {
    id: number;
    name: string;
}

interface Locale {
    id: number;
    name: string;
}

interface LocaleEmpleado {
    id: number;
    id_empleado: number;
    id_locale: number;
    empleado: Empleado;
    locale: Locale;
}

interface Props {
    localeEmpleado: LocaleEmpleado;
    empleados: Empleado[];
    locales: Locale[];
}

export default function Edit({ localeEmpleado, empleados, locales }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        id_empleado: localeEmpleado.id_empleado.toString(),
        id_locale: localeEmpleado.id_locale.toString(),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/locale-empleados/${localeEmpleado.id}`, {
            onSuccess: () => {
                // Success message will be handled by Inertia flash
            },
            onError: () => {
                // Error will be handled by Inertia
            }
        });
    };

    return (
        <AppLayout>
            <Head title="Editar Asignación de Empleado a Locale" />
            
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Editar Asignación</h1>
                        <p className="text-muted-foreground">
                            Modifica la asignación de empleado a locale
                        </p>
                    </div>
                    <Link href="/admin/locale-empleados">
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Información de la Asignación</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="id_empleado">Empleado</Label>
                                    <Select
                                        value={data.id_empleado}
                                        onValueChange={(value) => setData('id_empleado', value)}
                                    >
                                        <SelectTrigger className={errors.id_empleado ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Seleccione un empleado" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {empleados.map((empleado) => (
                                                <SelectItem key={empleado.id} value={empleado.id.toString()}>
                                                    {empleado.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.id_empleado && (
                                        <p className="text-sm text-red-500">{errors.id_empleado}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="id_locale">Locale</Label>
                                    <Select
                                        value={data.id_locale}
                                        onValueChange={(value) => setData('id_locale', value)}
                                    >
                                        <SelectTrigger className={errors.id_locale ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Seleccione un locale" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {locales.map((locale) => (
                                                <SelectItem key={locale.id} value={locale.id.toString()}>
                                                    {locale.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.id_locale && (
                                        <p className="text-sm text-red-500">{errors.id_locale}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex space-x-4">
                                <Button type="submit" disabled={processing}>
                                    <Save className="mr-2 h-4 w-4" />
                                    Actualizar
                                </Button>
                                <Link href="/admin/locale-empleados">
                                    <Button type="button" variant="outline">
                                        <X className="mr-2 h-4 w-4" />
                                        Cancelar
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
