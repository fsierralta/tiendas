import AppLayout from '@/layouts/app-layout';

import { BreadcrumbItem } from '@/types';
import { Link, useForm, Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Locales',
        href: "/admin/locales",
    },
    {
        title: 'Crear Local',
        href: "#",
    },
];

export default function Create(){
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        rif: '',
        direccion: '',
        ciudad: '',
        telefono: '',
        celular: '',
        email: '',
        logo: '',
        estado: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/locales');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Local" />
            
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/locales">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Crear Nuevo Local</h1>
                        <p className="text-muted-foreground mt-2">
                            Completa los datos para registrar un nuevo local comercial
                        </p>
                    </div>
                </div>

                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Información del Local</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre del Local *</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Ej: Tienda Central"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-destructive">{errors.name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="rif">RIF *</Label>
                                    <Input
                                        id="rif"
                                        type="text"
                                        value={data.rif}
                                        onChange={(e) => setData('rif', e.target.value)}
                                        placeholder="Ej: J-12345678-9"
                                        required
                                    />
                                    {errors.rif && (
                                        <p className="text-sm text-destructive">{errors.rif}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="ciudad">Ciudad *</Label>
                                    <Input
                                        id="ciudad"
                                        type="text"
                                        value={data.ciudad}
                                        onChange={(e) => setData('ciudad', e.target.value)}
                                        placeholder="Ej: Caracas"
                                        required
                                    />
                                    {errors.ciudad && (
                                        <p className="text-sm text-destructive">{errors.ciudad}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Correo Electrónico</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="Ej: tienda@ejemplo.com"
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-destructive">{errors.email}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="direccion">Dirección *</Label>
                                <Input
                                    id="direccion"
                                    type="text"
                                    value={data.direccion}
                                    onChange={(e) => setData('direccion', e.target.value)}
                                    placeholder="Ej: Calle Principal #123, Ciudad"
                                    required
                                />
                                {errors.direccion && (
                                    <p className="text-sm text-destructive">{errors.direccion}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="telefono">Teléfono</Label>
                                    <Input
                                        id="telefono"
                                        type="text"
                                        value={data.telefono}
                                        onChange={(e) => setData('telefono', e.target.value)}
                                        placeholder="Ej: 0212-1234567"
                                    />
                                    {errors.telefono && (
                                        <p className="text-sm text-destructive">{errors.telefono}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="celular">Celular</Label>
                                    <Input
                                        id="celular"
                                        type="text"
                                        value={data.celular}
                                        onChange={(e) => setData('celular', e.target.value)}
                                        placeholder="Ej: 0414-1234567"
                                    />
                                    {errors.celular && (
                                        <p className="text-sm text-destructive">{errors.celular}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="logo">Logo</Label>
                                <Input
                                    id="logo"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('logo', e.target.files?.[0] || null)}
                                />
                                <p className="text-sm text-muted-foreground">
                                    Formatos permitidos: JPEG, PNG, JPG, GIF. Máximo 2MB.
                                </p>
                                {errors.logo && (
                                    <p className="text-sm text-destructive">{errors.logo}</p>
                                )}
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="estado"
                                    checked={data.estado}
                                    onCheckedChange={(checked) => setData('estado', checked as boolean)}
                                />
                                <Label htmlFor="estado">Local Activo</Label>
                            </div>

                            <div className="flex justify-end gap-4 pt-6">
                                <Link href="/admin/locales">
                                    <Button variant="outline" type="button">
                                        Cancelar
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    <Save className="w-4 h-4 mr-2" />
                                    {processing ? 'Guardando...' : 'Guardar Local'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
